from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, PasswordResetRequestView, PasswordResetConfirmAPIView,ProfileView,LogoutView
from .views import MyTokenObtainPairView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('register/', RegisterView.as_view()),  
    # path('login/', TokenObtainPairView.as_view()),
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view()),
    path('password-reset-confirm/', PasswordResetConfirmAPIView.as_view()),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
