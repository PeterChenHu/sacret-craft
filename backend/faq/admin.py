from django.contrib import admin
from .models import FAQCategory, FAQ, FAQVote


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', 'name')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'is_featured', 'views', 'helpful_votes', 'order', 'created_at')
    list_filter = ('is_active', 'is_featured', 'category', 'created_at')
    search_fields = ('question', 'answer')
    readonly_fields = ('views', 'helpful_votes', 'unhelpful_votes', 'created_at', 'updated_at')
    ordering = ('order', 'created_at')
    
    fieldsets = (
        (None, {
            'fields': ('question', 'answer', 'category')
        }),
        ('Settings', {
            'fields': ('is_active', 'is_featured', 'order')
        }),
        ('Statistics', {
            'fields': ('views', 'helpful_votes', 'unhelpful_votes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')


@admin.register(FAQVote)
class FAQVoteAdmin(admin.ModelAdmin):
    list_display = ('faq', 'user', 'vote_type', 'created_at')
    list_filter = ('vote_type', 'created_at')
    search_fields = ('faq__question', 'user__email')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('faq', 'user') 