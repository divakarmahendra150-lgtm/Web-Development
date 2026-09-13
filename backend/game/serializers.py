from rest_framework import serializers
from .models import Character, Task, TaskCompletion, Badge, UserBadge, HistoryEntry, XPTransaction, GoldTransaction
from .services import xp_for_level, xp_to_next_level


class CharacterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    avatar = serializers.CharField(source='user.avatar', read_only=True)
    title = serializers.CharField(source='user.title', read_only=True)
    xp_in_level = serializers.SerializerMethodField()
    xp_needed = serializers.SerializerMethodField()
    xp_progress_percent = serializers.SerializerMethodField()
    xp_for_current_level = serializers.SerializerMethodField()
    xp_for_next_level = serializers.SerializerMethodField()

    class Meta:
        model = Character
        fields = [
            'id', 'username', 'email', 'avatar', 'title',
            'level', 'total_xp', 'gold',
            'strength', 'intellect', 'discipline', 'vitality', 'charisma',
            'current_streak', 'longest_streak', 'last_activity_date',
            'xp_in_level', 'xp_needed', 'xp_progress_percent',
            'xp_for_current_level', 'xp_for_next_level',
            'created_at', 'updated_at',
        ]

    def get_xp_for_current_level(self, obj):
        return xp_for_level(obj.level)

    def get_xp_for_next_level(self, obj):
        return xp_for_level(obj.level + 1)

    def get_xp_in_level(self, obj):
        return obj.total_xp - xp_for_level(obj.level)

    def get_xp_needed(self, obj):
        return xp_to_next_level(obj.level)

    def get_xp_progress_percent(self, obj):
        needed = xp_to_next_level(obj.level)
        in_level = obj.total_xp - xp_for_level(obj.level)
        if needed <= 0:
            return 100.0
        return round((in_level / needed) * 100, 1)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'difficulty',
            'status', 'due_date', 'completed_at', 'xp_reward', 'gold_reward',
            'attribute', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'completed_at', 'xp_reward', 'gold_reward', 'attribute', 'created_at', 'updated_at']


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'difficulty', 'due_date']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Quest title cannot be empty.')
        return value.strip()


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'difficulty', 'due_date']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Quest title cannot be empty.')
        return value.strip()


class TaskCompletionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)
    task_category = serializers.CharField(source='task.category', read_only=True)
    task_difficulty = serializers.CharField(source='task.difficulty', read_only=True)

    class Meta:
        model = TaskCompletion
        fields = [
            'id', 'task_id', 'task_title', 'task_category', 'task_difficulty',
            'xp_earned', 'gold_earned', 'attribute_gained', 'attribute_points',
            'level_before', 'level_after', 'leveled_up', 'completed_at',
        ]


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'rarity', 'requirement_type', 'requirement_value']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'unlocked_at']


class HistoryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryEntry
        fields = ['id', 'entry_type', 'title', 'description', 'xp', 'gold', 'metadata', 'created_at']


class XPTransactionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = XPTransaction
        fields = ['id', 'amount', 'source', 'task_id', 'task_title', 'created_at']


class GoldTransactionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = GoldTransaction
        fields = ['id', 'amount', 'transaction_type', 'source', 'task_id', 'task_title', 'created_at']
