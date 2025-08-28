from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_verified')
    list_filter = ('is_staff', 'is_active', 'is_verified', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'first_name', 'last_name', 'phone', 'avatar', 'date_of_birth')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'address_type', 'city', 'state', 'is_default')
    list_filter = ('address_type', 'is_default', 'country', 'state')
    search_fields = ('user__email', 'first_name', 'last_name', 'city', 'state')
    ordering = ('user', '-is_default')
    
    fieldsets = (
        (None, {'fields': ('user', 'address_type')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'company', 'phone')}),
        (_('Address'), {'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country')}),
        (_('Settings'), {'fields': ('is_default',)}),
    ) 