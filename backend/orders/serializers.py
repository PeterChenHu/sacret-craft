from rest_framework import serializers
from .models import Order, OrderItem, Cart


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ('order', 'product_name', 'product_sku', 'unit_price', 'total_price', 'created_at')

    def get_product_image(self, obj):
        primary_image = obj.product.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        return None


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('order_number', 'user', 'created_at', 'updated_at', 'paid_at', 'shipped_at', 'delivered_at')


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model."""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def validate(self, attrs):
        try:
            print(f"CartSerializer.validate called with: {attrs}")
            
            # Check if product exists and has a valid price
            product = attrs.get('product')
            if not product:
                raise serializers.ValidationError("Product is required")
            
            if not hasattr(product, 'price') or not product.price:
                raise serializers.ValidationError("Product must have a valid price")
            
            print(f"Validation passed for product: {product.name} with price: {product.price}")
            return attrs
            
        except Exception as e:
            print(f"Error in CartSerializer.validate: {e}")
            import traceback
            traceback.print_exc()
            raise

    def get_product_image(self, obj):
        primary_image = obj.product.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        return None

    def create(self, validated_data):
        try:
            print(f"CartSerializer.create called with: {validated_data}")
            print(f"Context request user: {self.context['request'].user}")
            
            validated_data['user'] = self.context['request'].user
            print(f"Updated validated_data: {validated_data}")
            
            result = super().create(validated_data)
            print(f"CartSerializer.create result: {result}")
            return result
            
        except Exception as e:
            print(f"Error in CartSerializer.create: {e}")
            import traceback
            traceback.print_exc()
            raise


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process."""
    # Billing information
    billing_first_name = serializers.CharField(max_length=100)
    billing_last_name = serializers.CharField(max_length=100)
    billing_email = serializers.EmailField()
    billing_phone = serializers.CharField(max_length=20)
    billing_address = serializers.CharField()
    billing_city = serializers.CharField(max_length=100)
    billing_state = serializers.CharField(max_length=100)
    billing_postal_code = serializers.CharField(max_length=20)
    billing_country = serializers.CharField(max_length=100, default='USA')
    
    # Shipping information
    shipping_first_name = serializers.CharField(max_length=100)
    shipping_last_name = serializers.CharField(max_length=100)
    shipping_phone = serializers.CharField(max_length=20)
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100, default='USA')
    
    # Payment and shipping
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    shipping_method = serializers.ChoiceField(choices=Order.SHIPPING_METHOD_CHOICES, default='standard')
    notes = serializers.CharField(required=False, allow_blank=True) 