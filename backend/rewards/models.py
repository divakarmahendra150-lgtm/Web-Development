from django.db import models
from django.conf import settings


class Reward(models.Model):
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]
    REWARD_TYPES = [
        ('theme', 'Theme'),
        ('badge', 'Badge'),
        ('avatar', 'Avatar'),
        ('title', 'Title'),
        ('cosmetic', 'Cosmetic'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES, default='cosmetic')
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='common')
    icon = models.CharField(max_length=50, default='gift')
    gold_cost = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.gold_cost} Gold)"

    class Meta:
        db_table = 'rewards'
        ordering = ['gold_cost']


class InventoryItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inventory')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE, related_name='inventory_items')
    is_equipped = models.BooleanField(default=False)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'inventory_items'
        unique_together = [('user', 'reward')]
        ordering = ['-purchased_at']

    def __str__(self):
        return f"{self.user.username} owns {self.reward.name}"
