from django.urls import path
from . import views

urlpatterns = [
    path('', views.rewards_list, name='rewards-list'),
    path('<int:pk>/', views.reward_detail, name='reward-detail'),
    path('<int:pk>/purchase/', views.purchase_reward, name='reward-purchase'),
    path('inventory/', views.inventory_list, name='inventory-list'),
    path('inventory/<int:pk>/equip/', views.equip_item, name='item-equip'),
    path('inventory/<int:pk>/unequip/', views.unequip_item, name='item-unequip'),
]
