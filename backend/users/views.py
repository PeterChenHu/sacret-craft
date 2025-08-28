from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Address
from .serializers import UserSerializer, UserRegistrationSerializer, AddressSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that uses email instead of username."""
    username_field = 'email'
    
    def validate(self, attrs):
        # The frontend sends 'email' field, so we need to map it to 'username' for Django auth
        if 'email' in attrs:
            attrs['username'] = attrs.pop('email')
        
        # Get the username and password
        username = attrs.get('username')
        password = attrs.get('password')
        
        if not username or not password:
            raise serializers.ValidationError('Must include "email" and "password".')
        
        # Authenticate the user
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('No active account found with the given credentials.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        # Generate tokens
        refresh = self.get_token(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token view that uses email instead of username."""
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(generics.CreateAPIView):
    """View for user registration."""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for user profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AddressListView(generics.ListCreateAPIView):
    """View for user addresses."""
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for individual address."""
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_default_address(request, address_id):
    """Set an address as default."""
    try:
        address = Address.objects.get(id=address_id, user=request.user)
        address.is_default = True
        address.save()
        return Response({'message': 'Address set as default'}, status=status.HTTP_200_OK)
    except Address.DoesNotExist:
        return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password."""
    print(f"DEBUG: change_password called with method: {request.method}")
    print(f"DEBUG: request.content_type: {request.content_type}")
    print(f"DEBUG: request.body: {request.body}")
    print(f"DEBUG: request.data: {request.data}")
    print(f"DEBUG: request.user: {request.user}")
    print(f"DEBUG: request.headers: {dict(request.headers)}")
    
    try:
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        print(f"DEBUG: old_password: {old_password}")
        print(f"DEBUG: new_password: {new_password}")
        
        if not old_password or not new_password:
            print("DEBUG: Missing password fields")
            return Response({
                'error': 'Both old_password and new_password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify old password
        if not request.user.check_password(old_password):
            print("DEBUG: Old password verification failed")
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password
        try:
            validate_password(new_password, request.user)
            print("DEBUG: New password validation passed")
        except ValidationError as e:
            print(f"DEBUG: New password validation failed: {e}")
            return Response({
                'error': 'New password does not meet requirements',
                'details': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        request.user.set_password(new_password)
        request.user.save()
        print("DEBUG: Password changed successfully")
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"DEBUG: Exception occurred: {e}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': 'Failed to change password',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


@api_view(['POST', 'GET'])
@permission_classes([permissions.IsAuthenticated])
def test_auth(request):
    """Test endpoint to verify authentication works."""
    return Response({
        'message': 'Authentication working',
        'user': str(request.user),
        'method': request.method,
        'data': request.data
    }, status=status.HTTP_200_OK) 