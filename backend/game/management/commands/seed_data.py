from django.core.management.base import BaseCommand
from game.models import Badge
from rewards.models import Reward


BADGES = [
    {'name': 'First Quest', 'description': 'Complete your very first quest', 'icon': 'star', 'rarity': 'common', 'requirement_type': 'quest_count', 'requirement_value': 1},
    {'name': 'Quest Veteran', 'description': 'Complete 10 quests', 'icon': 'shield', 'rarity': 'common', 'requirement_type': 'quest_count', 'requirement_value': 10},
    {'name': 'Quest Master', 'description': 'Complete 50 quests', 'icon': 'trophy', 'rarity': 'rare', 'requirement_type': 'quest_count', 'requirement_value': 50},
    {'name': 'Century Hero', 'description': 'Complete 100 quests', 'icon': 'crown', 'rarity': 'epic', 'requirement_type': 'quest_count', 'requirement_value': 100},
    {'name': 'XP Initiate', 'description': 'Earn 500 XP total', 'icon': 'zap', 'rarity': 'common', 'requirement_type': 'xp_total', 'requirement_value': 500},
    {'name': 'XP Warrior', 'description': 'Earn 1,000 XP total', 'icon': 'zap', 'rarity': 'rare', 'requirement_type': 'xp_total', 'requirement_value': 1000},
    {'name': 'XP Legend', 'description': 'Earn 10,000 XP total', 'icon': 'zap', 'rarity': 'legendary', 'requirement_type': 'xp_total', 'requirement_value': 10000},
    {'name': 'Rising Hero', 'description': 'Reach Level 5', 'icon': 'trending-up', 'rarity': 'common', 'requirement_type': 'level', 'requirement_value': 5},
    {'name': 'Champion', 'description': 'Reach Level 10', 'icon': 'award', 'rarity': 'rare', 'requirement_type': 'level', 'requirement_value': 10},
    {'name': 'Legend', 'description': 'Reach Level 25', 'icon': 'crown', 'rarity': 'legendary', 'requirement_type': 'level', 'requirement_value': 25},
    {'name': 'Week Warrior', 'description': 'Maintain a 7-day streak', 'icon': 'flame', 'rarity': 'common', 'requirement_type': 'streak', 'requirement_value': 7},
    {'name': 'Month Master', 'description': 'Maintain a 30-day streak', 'icon': 'flame', 'rarity': 'epic', 'requirement_type': 'streak', 'requirement_value': 30},
    {'name': 'Coding Master', 'description': 'Complete 10 Coding quests', 'icon': 'code', 'rarity': 'rare', 'requirement_type': 'category_count', 'requirement_value': 10, 'requirement_category': 'coding'},
    {'name': 'Study Warrior', 'description': 'Complete 10 Study quests', 'icon': 'book-open', 'rarity': 'rare', 'requirement_type': 'category_count', 'requirement_value': 10, 'requirement_category': 'study'},
    {'name': 'Fitness Warrior', 'description': 'Complete 10 Fitness quests', 'icon': 'dumbbell', 'rarity': 'rare', 'requirement_type': 'category_count', 'requirement_value': 10, 'requirement_category': 'fitness'},
]

REWARDS = [
    {'name': 'Bronze Shield', 'description': 'A basic shield for your profile. Simple but proud.', 'reward_type': 'cosmetic', 'rarity': 'common', 'icon': 'shield', 'gold_cost': 50},
    {'name': 'Dark Theme', 'description': 'Unlock the Dark Obsidian theme for your interface.', 'reward_type': 'theme', 'rarity': 'common', 'icon': 'moon', 'gold_cost': 100},
    {'name': 'Flame Title', 'description': 'Display the title "Flame Bearer" on your profile.', 'reward_type': 'title', 'rarity': 'rare', 'icon': 'flame', 'gold_cost': 150},
    {'name': 'Dragon Avatar', 'description': 'Equip the mighty Dragon avatar on your character.', 'reward_type': 'avatar', 'rarity': 'rare', 'icon': 'crown', 'gold_cost': 200},
    {'name': 'Gold Frame', 'description': 'A shining gold frame for your character panel.', 'reward_type': 'cosmetic', 'rarity': 'rare', 'icon': 'star', 'gold_cost': 250},
    {'name': 'Neon Theme', 'description': 'Unlock the futuristic Neon Cyberpunk theme.', 'reward_type': 'theme', 'rarity': 'epic', 'icon': 'zap', 'gold_cost': 400},
    {'name': 'Shadow Warrior Avatar', 'description': 'Equip the legendary Shadow Warrior avatar.', 'reward_type': 'avatar', 'rarity': 'epic', 'icon': 'sword', 'gold_cost': 500},
    {'name': 'God-Emperor Title', 'description': 'Display the legendary title "God-Emperor".', 'reward_type': 'title', 'rarity': 'legendary', 'icon': 'crown', 'gold_cost': 1000},
    {'name': 'Cosmic Theme', 'description': 'Unlock the ultra-rare Cosmic Universe theme.', 'reward_type': 'theme', 'rarity': 'legendary', 'icon': 'sparkles', 'gold_cost': 1500},
]


class Command(BaseCommand):
    help = 'Seed the database with initial badges and rewards'

    def handle(self, *args, **options):
        self.stdout.write('Seeding badges...')
        badge_count = 0
        for badge_data in BADGES:
            _, created = Badge.objects.get_or_create(
                name=badge_data['name'],
                defaults=badge_data
            )
            if created:
                badge_count += 1
        self.stdout.write(self.style.SUCCESS(f'Created {badge_count} new badges (total: {Badge.objects.count()})'))

        self.stdout.write('Seeding rewards...')
        reward_count = 0
        for reward_data in REWARDS:
            _, created = Reward.objects.get_or_create(
                name=reward_data['name'],
                defaults=reward_data
            )
            if created:
                reward_count += 1
        self.stdout.write(self.style.SUCCESS(f'Created {reward_count} new rewards (total: {Reward.objects.count()})'))

        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
