from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, Cart


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'product_sku', 'unit_price', 'total_price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'payment_status', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'shipping_method', 'created_at')
    search_fields = ('order_number', 'user__email', 'billing_first_name', 'billing_last_name')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'paid_at', 'shipped_at', 'delivered_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'payment_status', 'payment_method', 'shipping_method')
        }),
        ('Billing Information', {
            'fields': (
                'billing_first_name', 'billing_last_name', 'billing_email', 'billing_phone',
                'billing_address', 'billing_city', 'billing_state', 'billing_postal_code', 'billing_country'
            )
        }),
        ('Shipping Information', {
            'fields': (
                'shipping_first_name', 'shipping_last_name', 'shipping_phone',
                'shipping_address', 'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country'
            )
        }),
        ('Pricing', {
            'fields': ('subtotal', 'tax_amount', 'shipping_cost', 'discount_amount', 'total_amount')
        }),
        ('Tracking', {
            'fields': ('tracking_number', 'tracking_url', 'estimated_delivery', 'actual_delivery')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at', 'shipped_at', 'delivered_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'quantity', 'unit_price', 'total_price')
    list_filter = ('created_at',)
    search_fields = ('order__order_number', 'product_name', 'product_sku')
    readonly_fields = ('order', 'product', 'product_name', 'product_sku', 'unit_price', 'total_price', 'created_at')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('order', 'product')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'total_price_display', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'product__name')
    readonly_fields = ('created_at', 'updated_at')

    def total_price_display(self, obj):
        return f"${obj.total_price}"
    total_price_display.short_description = 'Total Price'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'product') 