from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import Reward, InventoryItem
from .serializers import RewardSerializer, InventoryItemSerializer
from game.models import Character, GoldTransaction, HistoryEntry


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def rewards_list(request):
    rewards = Reward.objects.filter(is_active=True)
    owned_ids = set(InventoryItem.objects.filter(user=request.user).values_list('reward_id', flat=True))
    data = []
    for reward in rewards:
        r = RewardSerializer(reward).data
        r['owned'] = reward.id in owned_ids
        data.append(r)
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reward_detail(request, pk):
    reward = get_object_or_404(Reward, pk=pk, is_active=True)
    owned = InventoryItem.objects.filter(user=request.user, reward=reward).exists()
    data = RewardSerializer(reward).data
    data['owned'] = owned
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_reward(request, pk):
    reward = get_object_or_404(Reward, pk=pk, is_active=True)

    # Check if already owned
    if InventoryItem.objects.filter(user=request.user, reward=reward).exists():
        return Response({'error': 'You already own this reward.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check sufficient gold
    character, _ = Character.objects.get_or_create(user=request.user)
    if character.gold < reward.gold_cost:
        return Response({
            'error': f'Insufficient Gold. You need {reward.gold_cost} Gold but have {character.gold}.'
        }, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        character.gold -= reward.gold_cost
        character.save()

        item = InventoryItem.objects.create(user=request.user, reward=reward)

        GoldTransaction.objects.create(
            user=request.user,
            amount=-reward.gold_cost,
            transaction_type='spent',
            source=f'Purchased: {reward.name}',
        )

        HistoryEntry.objects.create(
            user=request.user,
            entry_type='reward_purchase',
            title=f'Purchased: {reward.name}',
            description=f'Spent {reward.gold_cost} Gold',
            gold=-reward.gold_cost,
            metadata={'reward_id': reward.id, 'reward_name': reward.name, 'gold_spent': reward.gold_cost}
        )

    return Response({
        'message': f'Successfully purchased {reward.name}!',
        'item': InventoryItemSerializer(item).data,
        'gold_remaining': character.gold,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_list(request):
    items = InventoryItem.objects.filter(user=request.user).select_related('reward')
    return Response(InventoryItemSerializer(items, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def equip_item(request, pk):
    item = get_object_or_404(InventoryItem, pk=pk, user=request.user)
    # Unequip other items of same type
    InventoryItem.objects.filter(
        user=request.user,
        reward__reward_type=item.reward.reward_type,
        is_equipped=True
    ).update(is_equipped=False)
    item.is_equipped = True
    item.save()
    return Response(InventoryItemSerializer(item).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unequip_item(request, pk):
    item = get_object_or_404(InventoryItem, pk=pk, user=request.user)
    item.is_equipped = False
    item.save()
    return Response(InventoryItemSerializer(item).data)
