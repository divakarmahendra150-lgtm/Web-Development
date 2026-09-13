"""
Core game logic services for Life RPG.
Backend is the source of truth for all XP, Gold, Level, Attribute calculations.
"""
import math
from datetime import date, timedelta
from django.db import transaction
from django.utils import timezone

from .models import Character, Task, TaskCompletion, XPTransaction, GoldTransaction, Badge, UserBadge, HistoryEntry


# ─── XP & LEVEL SYSTEM ────────────────────────────────────────────────────────

XP_DIFFICULTY_MAP = {
    'easy': 50,
    'medium': 100,
    'hard': 200,
    'epic': 400,
}

GOLD_DIFFICULTY_MAP = {
    'easy': 25,
    'medium': 50,
    'hard': 100,
    'epic': 200,
}

ATTRIBUTE_CATEGORY_MAP = {
    'coding': 'intellect',
    'study': 'intellect',
    'reading': 'intellect',
    'fitness': 'strength',
    'health': 'vitality',
    'work': 'discipline',
    'personal': 'discipline',
    'other': 'charisma',
}

ATTRIBUTE_XP_THRESHOLD = {
    'easy': 1,
    'medium': 1,
    'hard': 2,
    'epic': 3,
}


def xp_for_level(level: int) -> int:
    """Total XP required to reach a given level (non-linear)."""
    if level <= 1:
        return 0
    return int(100 * (level - 1) ** 1.8)


def xp_to_next_level(level: int) -> int:
    """XP required to go from current level to next level."""
    return xp_for_level(level + 1) - xp_for_level(level)


def calculate_level(total_xp: int) -> int:
    """Calculate level from total XP."""
    level = 1
    while xp_for_level(level + 1) <= total_xp:
        level += 1
    return level


def calculate_xp_reward(difficulty: str) -> int:
    return XP_DIFFICULTY_MAP.get(difficulty, 100)


def calculate_gold_reward(difficulty: str) -> int:
    return GOLD_DIFFICULTY_MAP.get(difficulty, 50)


def get_attribute_for_category(category: str) -> str:
    return ATTRIBUTE_CATEGORY_MAP.get(category, 'charisma')


def calculate_attribute_points(difficulty: str) -> int:
    return ATTRIBUTE_XP_THRESHOLD.get(difficulty, 1)


# ─── STREAK SYSTEM ────────────────────────────────────────────────────────────

def update_streak(character: Character) -> dict:
    """Update streak based on today's activity. Returns streak info."""
    today = date.today()
    last = character.last_activity_date
    result = {
        'streak_before': character.current_streak,
        'streak_after': character.current_streak,
        'streak_broken': False,
        'streak_continued': False,
    }

    if last is None:
        # First quest ever
        character.current_streak = 1
        character.longest_streak = max(character.longest_streak, 1)
        result['streak_after'] = 1
        result['streak_continued'] = True
    elif last == today:
        # Already completed a quest today — no streak change
        result['streak_after'] = character.current_streak
    elif last == today - timedelta(days=1):
        # Consecutive day
        character.current_streak += 1
        character.longest_streak = max(character.longest_streak, character.current_streak)
        result['streak_after'] = character.current_streak
        result['streak_continued'] = True
    else:
        # Streak broken (missed at least one day)
        result['streak_broken'] = True
        character.current_streak = 1
        result['streak_after'] = 1

    character.last_activity_date = today
    return result


# ─── BADGE SYSTEM ─────────────────────────────────────────────────────────────

def check_and_unlock_badges(user, character: Character) -> list:
    """Check all badge requirements and unlock any newly earned badges."""
    unlocked = []
    existing_badge_ids = set(UserBadge.objects.filter(user=user).values_list('badge_id', flat=True))
    all_badges = Badge.objects.exclude(id__in=existing_badge_ids)

    total_completions = TaskCompletion.objects.filter(user=user).count()
    total_xp = character.total_xp
    level = character.level
    streak = character.current_streak

    for badge in all_badges:
        req_type = badge.requirement_type
        req_val = badge.requirement_value
        req_cat = badge.requirement_category

        earned = False

        if req_type == 'quest_count':
            earned = total_completions >= req_val
        elif req_type == 'xp_total':
            earned = total_xp >= req_val
        elif req_type == 'level':
            earned = level >= req_val
        elif req_type == 'streak':
            earned = streak >= req_val
        elif req_type == 'category_count':
            cat_count = TaskCompletion.objects.filter(
                user=user, task__category=req_cat
            ).count()
            earned = cat_count >= req_val

        if earned:
            ub = UserBadge.objects.create(user=user, badge=badge)
            unlocked.append(badge)
            HistoryEntry.objects.create(
                user=user,
                entry_type='badge_unlock',
                title=f'Badge Unlocked: {badge.name}',
                description=badge.description,
                metadata={'badge_id': badge.id, 'badge_name': badge.name, 'badge_icon': badge.icon}
            )

    return unlocked


# ─── MAIN QUEST COMPLETION SERVICE ────────────────────────────────────────────

@transaction.atomic
def complete_task(task: Task, user) -> dict:
    """
    Complete a task. Returns the full game state update.
    All calculations happen server-side.
    """
    # Validate
    if task.status == 'completed':
        raise ValueError('Quest has already been completed.')
    if task.user_id != user.id:
        raise PermissionError('You do not own this quest.')

    # Get or create character
    character, _ = Character.objects.select_for_update().get_or_create(user=user)

    # Calculate rewards (server-side only)
    xp_earned = calculate_xp_reward(task.difficulty)
    gold_earned = calculate_gold_reward(task.difficulty)
    attribute = get_attribute_for_category(task.category)
    attr_points = calculate_attribute_points(task.difficulty)

    level_before = character.level

    # Apply XP and Gold
    character.total_xp += xp_earned
    character.gold += gold_earned

    # Apply attribute
    setattr(character, attribute, getattr(character, attribute) + attr_points)

    # Calculate new level
    new_level = calculate_level(character.total_xp)
    leveled_up = new_level > level_before
    character.level = new_level

    # Update streak
    streak_info = update_streak(character)
    character.save()

    # Mark task complete
    task.status = 'completed'
    task.completed_at = timezone.now()
    task.xp_reward = xp_earned
    task.gold_reward = gold_earned
    task.attribute = attribute
    task.save()

    # Create completion record
    completion = TaskCompletion.objects.create(
        task=task,
        user=user,
        xp_earned=xp_earned,
        gold_earned=gold_earned,
        attribute_gained=attribute,
        attribute_points=attr_points,
        level_before=level_before,
        level_after=new_level,
        leveled_up=leveled_up,
    )

    # Create XP transaction record
    XPTransaction.objects.create(
        user=user,
        amount=xp_earned,
        source=f'Quest: {task.title}',
        task=task,
    )

    # Create Gold transaction record
    GoldTransaction.objects.create(
        user=user,
        amount=gold_earned,
        transaction_type='earned',
        source=f'Quest: {task.title}',
        task=task,
    )

    # Create history entry
    HistoryEntry.objects.create(
        user=user,
        entry_type='quest_complete',
        title=f'Quest Completed: {task.title}',
        description=f'Earned {xp_earned} XP and {gold_earned} Gold',
        xp=xp_earned,
        gold=gold_earned,
        metadata={
            'task_id': task.id,
            'task_title': task.title,
            'difficulty': task.difficulty,
            'category': task.category,
            'attribute': attribute,
            'attribute_points': attr_points,
            'level_before': level_before,
            'level_after': new_level,
            'leveled_up': leveled_up,
        }
    )

    if leveled_up:
        HistoryEntry.objects.create(
            user=user,
            entry_type='level_up',
            title=f'Level Up! Reached Level {new_level}',
            description=f'Advanced from Level {level_before} to Level {new_level}',
            metadata={'level_before': level_before, 'level_after': new_level}
        )

    # Check for new badges
    new_badges = check_and_unlock_badges(user, character)

    # Calculate XP progress for response
    xp_for_current = xp_for_level(new_level)
    xp_for_next = xp_for_level(new_level + 1)
    xp_in_level = character.total_xp - xp_for_current
    xp_needed = xp_for_next - xp_for_current

    return {
        'task_id': task.id,
        'xp_earned': xp_earned,
        'gold_earned': gold_earned,
        'attribute_gained': attribute,
        'attribute_points': attr_points,
        'level_before': level_before,
        'level_after': new_level,
        'leveled_up': leveled_up,
        'total_xp': character.total_xp,
        'gold': character.gold,
        'level': new_level,
        'xp_in_level': xp_in_level,
        'xp_needed': xp_needed,
        'xp_progress_percent': round((xp_in_level / xp_needed) * 100, 1) if xp_needed > 0 else 100,
        'current_streak': character.current_streak,
        'longest_streak': character.longest_streak,
        'streak_info': streak_info,
        'new_badges': [{'id': b.id, 'name': b.name, 'icon': b.icon, 'description': b.description} for b in new_badges],
        'character': {
            'strength': character.strength,
            'intellect': character.intellect,
            'discipline': character.discipline,
            'vitality': character.vitality,
            'charisma': character.charisma,
        }
    }
