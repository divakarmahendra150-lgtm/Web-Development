from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Character, Task, Badge, UserBadge, HistoryEntry, XPTransaction, GoldTransaction
from .serializers import (
    CharacterSerializer, TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer,
    BadgeSerializer, UserBadgeSerializer, HistoryEntrySerializer,
    XPTransactionSerializer, GoldTransactionSerializer, TaskCompletionSerializer
)
from .services import complete_task, xp_for_level, xp_to_next_level, calculate_level


# ─── CHARACTER ────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_character(request):
    character, created = Character.objects.get_or_create(user=request.user)
    return Response(CharacterSerializer(character).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    character, _ = Character.objects.get_or_create(user=request.user)
    badges = UserBadge.objects.filter(user=request.user).select_related('badge')
    total_quests = Task.objects.filter(user=request.user, status='completed').count()
    active_quests = Task.objects.filter(user=request.user, status='active').count()

    return Response({
        'character': CharacterSerializer(character).data,
        'total_completed_quests': total_quests,
        'active_quests': active_quests,
        'badge_count': badges.count(),
        'badges': UserBadgeSerializer(badges[:5], many=True).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progression(request):
    character, _ = Character.objects.get_or_create(user=request.user)
    level = character.level
    xp_current_level = xp_for_level(level)
    xp_next_level = xp_for_level(level + 1)
    xp_in_level = character.total_xp - xp_current_level
    xp_needed = xp_to_next_level(level)

    # Build level milestones
    milestones = []
    for l in range(1, level + 6):
        milestones.append({
            'level': l,
            'xp_required': xp_for_level(l),
            'reached': character.total_xp >= xp_for_level(l),
        })

    return Response({
        'level': level,
        'total_xp': character.total_xp,
        'xp_for_current_level': xp_current_level,
        'xp_for_next_level': xp_next_level,
        'xp_in_level': xp_in_level,
        'xp_needed': xp_needed,
        'xp_progress_percent': round((xp_in_level / xp_needed) * 100, 1) if xp_needed > 0 else 100,
        'milestones': milestones,
    })


# ─── TASKS ────────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def tasks_list(request):
    if request.method == 'GET':
        qs = Task.objects.filter(user=request.user)
        # Filters
        category = request.query_params.get('category')
        difficulty = request.query_params.get('difficulty')
        status_filter = request.query_params.get('status')
        if category:
            qs = qs.filter(category=category)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return Response(TaskSerializer(qs, many=True).data)

    elif request.method == 'POST':
        serializer = TaskCreateSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save(user=request.user)
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)

    if request.method == 'GET':
        return Response(TaskSerializer(task).data)

    elif request.method == 'PATCH':
        if task.status == 'completed':
            return Response({'error': 'Cannot edit a completed quest.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = TaskUpdateSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_task_view(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    try:
        result = complete_task(task, request.user)
        return Response(result, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except PermissionError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({'error': 'An error occurred while completing the quest.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── STREAK ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_streak(request):
    character, _ = Character.objects.get_or_create(user=request.user)
    return Response({
        'current_streak': character.current_streak,
        'longest_streak': character.longest_streak,
        'last_activity_date': character.last_activity_date,
    })


# ─── BADGES ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_badges(request):
    all_badges = Badge.objects.all()
    user_badge_ids = set(UserBadge.objects.filter(user=request.user).values_list('badge_id', flat=True))
    user_badges = UserBadge.objects.filter(user=request.user).select_related('badge')

    result = []
    for badge in all_badges:
        b = BadgeSerializer(badge).data
        b['unlocked'] = badge.id in user_badge_ids
        if badge.id in user_badge_ids:
            ub = next((ub for ub in user_badges if ub.badge_id == badge.id), None)
            b['unlocked_at'] = ub.unlocked_at.isoformat() if ub else None
        result.append(b)

    return Response(result)


# ─── HISTORY ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    qs = HistoryEntry.objects.filter(user=request.user)
    limit = int(request.query_params.get('limit', 50))
    return Response(HistoryEntrySerializer(qs[:limit], many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_xp_history(request):
    qs = XPTransaction.objects.filter(user=request.user)
    limit = int(request.query_params.get('limit', 20))
    return Response(XPTransactionSerializer(qs[:limit], many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_gold_history(request):
    qs = GoldTransaction.objects.filter(user=request.user)
    limit = int(request.query_params.get('limit', 20))
    return Response(GoldTransactionSerializer(qs[:limit], many=True).data)
