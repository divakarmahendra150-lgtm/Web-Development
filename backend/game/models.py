from django.db import models
from django.conf import settings
from django.utils import timezone


class Character(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='character')
    level = models.PositiveIntegerField(default=1)
    total_xp = models.PositiveBigIntegerField(default=0)
    gold = models.PositiveBigIntegerField(default=0)
    # Attributes
    strength = models.PositiveIntegerField(default=1)
    intellect = models.PositiveIntegerField(default=1)
    discipline = models.PositiveIntegerField(default=1)
    vitality = models.PositiveIntegerField(default=1)
    charisma = models.PositiveIntegerField(default=1)
    # Streak
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Level {self.level}"

    class Meta:
        db_table = 'characters'


class Task(models.Model):
    CATEGORY_CHOICES = [
        ('coding', 'Coding'),
        ('study', 'Study'),
        ('fitness', 'Fitness'),
        ('health', 'Health'),
        ('reading', 'Reading'),
        ('work', 'Work'),
        ('personal', 'Personal'),
        ('other', 'Other'),
    ]
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
        ('epic', 'Epic'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    due_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    xp_reward = models.PositiveIntegerField(default=0)
    gold_reward = models.PositiveIntegerField(default=0)
    attribute = models.CharField(max_length=20, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']


class TaskCompletion(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='completion')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='completions')
    xp_earned = models.PositiveIntegerField(default=0)
    gold_earned = models.PositiveIntegerField(default=0)
    attribute_gained = models.CharField(max_length=20, blank=True, default='')
    attribute_points = models.PositiveIntegerField(default=0)
    level_before = models.PositiveIntegerField(default=1)
    level_after = models.PositiveIntegerField(default=1)
    leveled_up = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} completed {self.task.title}"

    class Meta:
        db_table = 'task_completions'


class XPTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='xp_transactions')
    amount = models.IntegerField()
    source = models.CharField(max_length=100)
    task = models.ForeignKey(Task, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'xp_transactions'
        ordering = ['-created_at']


class GoldTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('earned', 'Earned'),
        ('spent', 'Spent'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gold_transactions')
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default='earned')
    source = models.CharField(max_length=100)
    task = models.ForeignKey(Task, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'gold_transactions'
        ordering = ['-created_at']


class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='award')
    rarity = models.CharField(max_length=20, default='common')
    requirement_type = models.CharField(max_length=50)
    requirement_value = models.PositiveIntegerField(default=0)
    requirement_category = models.CharField(max_length=20, blank=True, default='')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'badges'


class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='user_badges')
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_badges'
        unique_together = [('user', 'badge')]
        ordering = ['-unlocked_at']

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"


class HistoryEntry(models.Model):
    ENTRY_TYPES = [
        ('quest_complete', 'Quest Completed'),
        ('level_up', 'Level Up'),
        ('badge_unlock', 'Badge Unlocked'),
        ('reward_purchase', 'Reward Purchased'),
        ('streak', 'Streak Update'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='history')
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    xp = models.IntegerField(default=0)
    gold = models.IntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'history_entries'
        ordering = ['-created_at']
