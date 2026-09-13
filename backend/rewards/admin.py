from django.contrib import admin
from .models import Reward, InventoryItem


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('name', 'reward_type', 'rarity', 'gold_cost', 'is_active')
    list_filter = ('reward_type', 'rarity', 'is_active')


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'reward', 'is_equipped', 'purchased_at')
