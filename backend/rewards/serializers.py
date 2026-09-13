from rest_framework import serializers
from .models import Reward, InventoryItem


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ['id', 'name', 'description', 'reward_type', 'rarity', 'icon', 'gold_cost', 'is_active', 'created_at']


class InventoryItemSerializer(serializers.ModelSerializer):
    reward = RewardSerializer(read_only=True)

    class Meta:
        model = InventoryItem
        fields = ['id', 'reward', 'is_equipped', 'purchased_at']
