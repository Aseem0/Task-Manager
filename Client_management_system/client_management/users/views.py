from django.contrib.auth import get_user_model, logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .permissions import IsAdminOrManager
from .serializers import (
    UserSerializer,
    PasswordResetSerializer,
    SetNewPasswordSerializer
)
from .permissions import IsAdminOrManager

User = get_user_model()

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = user.role
        if user.is_superuser:
            role = 'admin'
        
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
            "avatar": user.avatar.url if user.avatar else None,
        })

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            role = user.role
            if user.is_superuser:
                role = 'admin'
                
            return Response({
                "message": "Profile updated successfully",
                "user": {
                    "id": user.id,
                    "username": serializer.data.get('username', user.username),
                    "email": serializer.data.get('email', user.email),
                    "role": role,
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)

class RegisterView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def post(self, request):
        data = request.data.copy()  

        if request.user.role == 'manager' and not request.user.is_superuser:
            data['role'] = 'employee'

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User created successfully", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = f"http://127.0.0.1:3000/reset-password?uid={uid}&token={token}"

            send_mail(
                "Password Reset",
                f"Reset your password: {reset_link}",
                None,
                [email],
            )
        return Response({"message": "If email exists, reset link sent"})


class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(serializer.validated_data['uid']).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid UID"}, status=400)

        if not default_token_generator.check_token(user, serializer.validated_data['token']):
            return Response({"error": "Invalid or expired token"}, status=400)

        user.set_password(serializer.validated_data['password'])
        user.save()

        return Response({"message": "Password reset successful"})
    


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class EmployeeListView(APIView):
    """
    API endpoint to list all employees.
    Only accessible by authenticated managers and admins.
    """
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        # Get all users (optionally filter by role if needed)
        users = User.objects.all().order_by('-date_joined')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class EmployeeDetailView(APIView):
    """
    API endpoint to retrieve, update, or delete a specific employee.
    Only accessible by authenticated managers and admins.
    """
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully", "user": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Prevent deleting yourself
        if user.id == request.user.id:
            return Response({"detail": "You cannot delete your own account"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

