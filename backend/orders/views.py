from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem, Cart
from .serializers import OrderSerializer, CartSerializer, CheckoutSerializer


class CartListView(generics.ListCreateAPIView):
    """View for user cart."""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user).select_related('product')

    def create(self, request, *args, **kwargs):
        try:
            print(f"Cart create request data: {request.data}")
            print(f"User: {request.user}")
            print(f"User ID: {request.user.id}")
            print(f"User is authenticated: {request.user.is_authenticated}")
            
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print(f"Error in CartListView.create: {e}")
            import traceback
            traceback.print_exc()
            raise

    def perform_create(self, serializer):
        try:
            print(f"perform_create called with data: {serializer.validated_data}")
            
            # Check if item already exists in cart
            product = serializer.validated_data['product']
            quantity = serializer.validated_data.get('quantity', 1)
            
            print(f"Product: {product}, Quantity: {quantity}")
            
            cart_item, created = Cart.objects.get_or_create(
                user=self.request.user,
                product=product,
                defaults={'quantity': quantity}
            )
            
            print(f"Cart item created: {created}, Cart item: {cart_item}")
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
                print(f"Updated cart item quantity to: {cart_item.quantity}")
            
            # Store the cart item in the serializer context so it can be returned
            serializer.instance = cart_item
            print(f"Set serializer.instance to: {cart_item}")
            
        except Exception as e:
            print(f"Error in perform_create: {e}")
            import traceback
            traceback.print_exc()
            raise


class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for individual cart item."""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


class OrderListView(generics.ListAPIView):
    """View for user orders."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    """View for order details."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    """Process checkout and create order."""
    serializer = CheckoutSerializer(data=request.data)
    if serializer.is_valid():
        with transaction.atomic():
            # Get user's cart
            cart_items = Cart.objects.filter(user=request.user).select_related('product')
            
            if not cart_items.exists():
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate totals
            subtotal = sum(item.total_price for item in cart_items)
            tax_amount = subtotal * Decimal('0.08')  # 8% tax
            shipping_cost = Decimal('12.99')  # Fixed shipping cost
            total_amount = subtotal + tax_amount + shipping_cost
            
            # Create order
            order_data = serializer.validated_data
            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                tax_amount=tax_amount,
                shipping_cost=shipping_cost,
                total_amount=total_amount,
                **order_data
            )
            
            # Create order items
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_sku=cart_item.product.sku,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.product.price,
                    total_price=cart_item.total_price
                )
            
            # Clear cart
            cart_items.delete()
            
            return Response({
                'message': 'Order created successfully',
                'order_number': order.order_number,
                'total_amount': order.total_amount
            }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """Clear user's cart."""
    Cart.objects.filter(user=request.user).delete()
    return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cart_summary(request):
    """Get cart summary."""
    cart_items = Cart.objects.filter(user=request.user).select_related('product')
    
    subtotal = sum(item.total_price for item in cart_items)
    tax_amount = subtotal * Decimal('0.08')
    shipping_cost = Decimal('12.99') if subtotal < Decimal('100.00') else Decimal('0.00')
    total_amount = subtotal + tax_amount + shipping_cost
    
    return Response({
        'item_count': cart_items.count(),
        'subtotal': subtotal,
        'tax_amount': tax_amount,
        'shipping_cost': shipping_cost,
        'total_amount': total_amount
    }) 