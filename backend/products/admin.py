from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django.utils import translation
from .models import Category, Product, ProductImage, Review, Wishlist
from sacred_crafts.admin import admin_site


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'is_primary', 'order')
    
    def get_verbose_name(self, request):
        """Get verbose name based on current language."""
        current_lang = translation.get_language()
        if current_lang == 'zh-hans':
            return '产品图片'
        return 'Product Images'
    
    def get_verbose_name_plural(self, request):
        """Get verbose name plural based on current language."""
        current_lang = translation.get_language()
        if current_lang == 'zh-hans':
            return '产品图片'
        return 'Product Images'
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            formset.form.base_fields['image'].label = '图片'
            formset.form.base_fields['alt_text'].label = '替代文本'
            formset.form.base_fields['is_primary'].label = '是否主图'
            formset.form.base_fields['order'].label = '排序'
        else:
            formset.form.base_fields['image'].label = 'Image'
            formset.form.base_fields['alt_text'].label = 'Alt Text'
            formset.form.base_fields['is_primary'].label = 'Is Primary'
            formset.form.base_fields['order'].label = 'Order'
        
        return formset


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ('user', 'rating', 'title', 'comment', 'created_at')
    can_delete = False
    
    def get_verbose_name(self, request):
        """Get verbose name based on current language."""
        current_lang = translation.get_language()
        if current_lang == 'zh-hans':
            return '评论'
        return 'Reviews'
    
    def get_verbose_name_plural(self, request):
        """Get verbose name plural based on current language."""
        current_lang = translation.get_language()
        if current_lang == 'zh-hans':
            return '评论'
        return 'Reviews'
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            formset.form.base_fields['user'].label = '用户'
            formset.form.base_fields['rating'].label = '评分'
            formset.form.base_fields['title'].label = '标题'
            formset.form.base_fields['comment'].label = '评论'
            formset.form.base_fields['is_approved'].label = '是否批准'
        else:
            formset.form.base_fields['user'].label = 'User'
            formset.form.base_fields['rating'].label = 'Rating'
            formset.form.base_fields['title'].label = 'Title'
            formset.form.base_fields['comment'].label = 'Comment'
            formset.form.base_fields['is_approved'].label = 'Is Approved'
        
        return formset


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description', 'image', 'is_active')
        }),
    )
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            form.base_fields['name'].label = '分类名称'
            form.base_fields['slug'].label = '标识符'
            form.base_fields['description'].label = '分类描述'
            form.base_fields['image'].label = '分类图片'
            form.base_fields['is_active'].label = '是否激活'
        else:
            form.base_fields['name'].label = 'Category Name'
            form.base_fields['slug'].label = 'Slug'
            form.base_fields['description'].label = 'Description'
            form.base_fields['image'].label = 'Image'
            form.base_fields['is_active'].label = 'Is Active'
        
        return form


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity', 'status', 'featured', 'is_active', 'created_at')
    list_filter = ('status', 'featured', 'category', 'is_active', 'is_blessed', 'created_at')
    search_fields = ('name', 'description', 'sku')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ProductImageInline, ReviewInline]
    
    def get_fieldsets(self, request):
        """Get fieldsets based on current language."""
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            return (
                ('基本信息', {
                    'fields': ('name', 'slug', 'category', 'status', 'featured')
                }),
                ('定价信息', {
                    'fields': ('price', 'original_price', 'stock_quantity', 'sku')
                }),
                ('产品描述', {
                    'fields': ('description', 'short_description')
                }),
                ('物理详情', {
                    'fields': ('weight', 'dimensions', 'materials')
                }),
                ('设置', {
                    'fields': ('is_blessed', 'is_active')
                }),
                ('时间戳', {
                    'fields': ('created_at', 'updated_at'),
                    'classes': ('collapse',)
                }),
            )
        else:
            return (
                ('Basic Information', {
                    'fields': ('name', 'slug', 'category', 'status', 'featured')
                }),
                ('Pricing', {
                    'fields': ('price', 'original_price', 'stock_quantity', 'sku')
                }),
                ('Description', {
                    'fields': ('description', 'short_description')
                }),
                ('Physical Details', {
                    'fields': ('weight', 'dimensions', 'materials')
                }),
                ('Settings', {
                    'fields': ('is_blessed', 'is_active')
                }),
                ('Timestamps', {
                    'fields': ('created_at', 'updated_at'),
                    'classes': ('collapse',)
                }),
            )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            form.base_fields['name'].label = '产品名称'
            form.base_fields['slug'].label = '标识符'
            form.base_fields['description'].label = '产品描述'
            form.base_fields['short_description'].label = '简短描述'
            form.base_fields['price'].label = '价格'
            form.base_fields['original_price'].label = '原价'
            form.base_fields['category'].label = '分类'
            form.base_fields['status'].label = '状态'
            form.base_fields['featured'].label = '特色'
            form.base_fields['stock_quantity'].label = '库存数量'
            form.base_fields['sku'].label = 'SKU'
            form.base_fields['weight'].label = '重量'
            form.base_fields['dimensions'].label = '尺寸'
            form.base_fields['materials'].label = '材料'
            form.base_fields['is_blessed'].label = '是否已祝福'
            form.base_fields['is_active'].label = '是否激活'
        else:
            form.base_fields['name'].label = 'Product Name'
            form.base_fields['slug'].label = 'Slug'
            form.base_fields['description'].label = 'Description'
            form.base_fields['short_description'].label = 'Short Description'
            form.base_fields['price'].label = 'Price'
            form.base_fields['original_price'].label = 'Original Price'
            form.base_fields['category'].label = 'Category'
            form.base_fields['status'].label = 'Status'
            form.base_fields['featured'].label = 'Featured'
            form.base_fields['stock_quantity'].label = 'Stock Quantity'
            form.base_fields['sku'].label = 'SKU'
            form.base_fields['weight'].label = 'Weight'
            form.base_fields['dimensions'].label = 'Dimensions'
            form.base_fields['materials'].label = 'Materials'
            form.base_fields['is_blessed'].label = 'Is Blessed'
            form.base_fields['is_active'].label = 'Is Active'
        
        return form


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'is_primary', 'order', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('product__name', 'alt_text')
    ordering = ('product', 'order')
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            form.base_fields['product'].label = '产品'
            form.base_fields['image'].label = '图片'
            form.base_fields['alt_text'].label = '替代文本'
            form.base_fields['is_primary'].label = '是否主图'
            form.base_fields['order'].label = '排序'
        else:
            form.base_fields['product'].label = 'Product'
            form.base_fields['image'].label = 'Image'
            form.base_fields['alt_text'].label = 'Alt Text'
            form.base_fields['is_primary'].label = 'Is Primary'
            form.base_fields['order'].label = 'Order'
        
        return form

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px;" />', obj.image.url)
        return "No image"
    
    def get_image_preview_description(self, request):
        """Get image preview description based on current language."""
        current_lang = translation.get_language()
        if current_lang == 'zh-hans':
            return '图片预览'
        return 'Image Preview'
    
    image_preview.short_description = property(get_image_preview_description)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'title', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at')
    search_fields = ('product__name', 'user__email', 'title', 'comment')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            form.base_fields['product'].label = '产品'
            form.base_fields['user'].label = '用户'
            form.base_fields['rating'].label = '评分'
            form.base_fields['title'].label = '标题'
            form.base_fields['comment'].label = '评论'
            form.base_fields['is_approved'].label = '是否批准'
        else:
            form.base_fields['product'].label = 'Product'
            form.base_fields['user'].label = 'User'
            form.base_fields['rating'].label = 'Rating'
            form.base_fields['title'].label = 'Title'
            form.base_fields['comment'].label = 'Comment'
            form.base_fields['is_approved'].label = 'Is Approved'
        
        return form

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product', 'user')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'product__name')
    ordering = ('-created_at',)
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        current_lang = translation.get_language()
        
        if current_lang == 'zh-hans':
            form.base_fields['user'].label = '用户'
            form.base_fields['product'].label = '产品'
        else:
            form.base_fields['user'].label = 'User'
            form.base_fields['product'].label = 'Product'
        
        return form

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'product')


# Register models with the custom admin site
admin_site.register(Category, CategoryAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(ProductImage, ProductImageAdmin)
admin_site.register(Review, ReviewAdmin)
admin_site.register(Wishlist, WishlistAdmin) 