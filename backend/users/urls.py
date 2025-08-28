from django.urls import path
from . import views
from django.http import JsonResponse

def debug_test(request):
    """Debug view to test if users app URLs are being reached."""
    return JsonResponse({'message': 'Users app is working', 'method': request.method})

app_name = 'users'

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('addresses/', views.AddressListView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address-detail'),
    path('addresses/<int:address_id>/set-default/', views.set_default_address, name='set-default-address'),
    path('change-password/', views.change_password, name='change-password'),
    path('debug-test/', debug_test, name='debug-test'),
    path('test-auth/', views.test_auth, name='test-auth'),
] 