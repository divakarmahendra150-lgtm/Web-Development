from django.urls import path
from . import views

urlpatterns = [
    # Character
    path('character/', views.get_character, name='character'),
    path('stats/', views.get_stats, name='stats'),
    path('progression/', views.get_progression, name='progression'),
    # Tasks
    path('tasks/', views.tasks_list, name='tasks-list'),
    path('tasks/<int:pk>/', views.task_detail, name='task-detail'),
    path('tasks/<int:pk>/complete/', views.complete_task_view, name='task-complete'),
    # Streak
    path('streak/', views.get_streak, name='streak'),
    # Badges
    path('badges/', views.get_badges, name='badges'),
    # History
    path('history/', views.get_history, name='history'),
    path('xp-history/', views.get_xp_history, name='xp-history'),
    path('gold-history/', views.get_gold_history, name='gold-history'),
]
