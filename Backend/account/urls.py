# account/urls.py

from django.urls import path
from .views import LoginView, MeView, RegisterView, UserDetailView, UserListView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<uuid:user_id>/', UserDetailView.as_view(), name='user-detail'),
]