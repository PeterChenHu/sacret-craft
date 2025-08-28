from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('cart/', views.CartListView.as_view(), name='cart-list'),
    path('cart/<int:pk>/', views.CartDetailView.as_view(), name='cart-detail'),
    path('cart/summary/', views.cart_summary, name='cart-summary'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('checkout/', views.checkout, name='checkout'),
] 