from django.db import models


class Category(models.Model):
    """Product category model."""
    name = models.CharField('分类名称 / Category Name', max_length=100, unique=True)
    slug = models.SlugField('标识符 / Slug', max_length=100, unique=True)
    description = models.TextField('分类描述 / Description', blank=True)
    image = models.ImageField('分类图片 / Image', upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField('是否激活 / Is Active', default=True)
    created_at = models.DateTimeField('创建时间 / Created At', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间 / Updated At', auto_now=True)

    class Meta:
        verbose_name = '分类 / Category'
        verbose_name_plural = '分类 / Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """Product model."""
    STATUS_CHOICES = [
        ('draft', '草稿 / Draft'),
        ('published', '已发布 / Published'),
        ('archived', '已归档 / Archived'),
    ]

    FEATURED_CHOICES = [
        ('regular', '普通 / Regular'),
        ('featured', '特色 / Featured'),
        ('bestseller', '畅销 / Bestseller'),
        ('new', '新品 / New'),
    ]

    name = models.CharField('产品名称 / Product Name', max_length=200)
    slug = models.SlugField('标识符 / Slug', max_length=200, unique=True)
    description = models.TextField('产品描述 / Description')
    short_description = models.CharField('简短描述 / Short Description', max_length=300, blank=True)
    price = models.DecimalField('价格 / Price', max_digits=10, decimal_places=2)
    original_price = models.DecimalField('原价 / Original Price', max_digits=10, decimal_places=2, blank=True, null=True)
    category = models.ForeignKey(Category, verbose_name='分类 / Category', on_delete=models.CASCADE, related_name='products')
    status = models.CharField('状态 / Status', max_length=20, choices=STATUS_CHOICES, default='draft')
    featured = models.CharField('特色 / Featured', max_length=20, choices=FEATURED_CHOICES, default='regular')
    stock_quantity = models.PositiveIntegerField('库存数量 / Stock Quantity', default=0)
    sku = models.CharField('SKU', max_length=50, unique=True)
    weight = models.DecimalField('重量 / Weight', max_digits=8, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField('尺寸 / Dimensions', max_length=100, blank=True)
    materials = models.CharField('材料 / Materials', max_length=200, blank=True)
    is_blessed = models.BooleanField('是否已祝福 / Is Blessed', default=True)
    is_active = models.BooleanField('是否激活 / Is Active', default=True)
    created_at = models.DateTimeField('创建时间 / Created At', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间 / Updated At', auto_now=True)

    class Meta:
        verbose_name = '产品 / Product'
        verbose_name_plural = '产品 / Products'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def is_on_sale(self):
        return self.original_price and self.original_price > self.price

    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return int(((self.original_price - self.price) / self.original_price) * 100)
        return 0

    @property
    def in_stock(self):
        return self.stock_quantity > 0


class ProductImage(models.Model):
    """Product image model."""
    product = models.ForeignKey(Product, verbose_name='产品 / Product', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField('图片 / Image', upload_to='products/')
    alt_text = models.CharField('替代文本 / Alt Text', max_length=200, blank=True)
    is_primary = models.BooleanField('是否主图 / Is Primary', default=False)
    order = models.PositiveIntegerField('排序 / Order', default=0)
    created_at = models.DateTimeField('创建时间 / Created At', auto_now_add=True)

    class Meta:
        verbose_name = '产品图片 / Product Image'
        verbose_name_plural = '产品图片 / Product Images'
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            # Set all other images of this product to non-primary
            ProductImage.objects.filter(product=self.product).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class Review(models.Model):
    """Product review model."""
    RATING_CHOICES = [
        (1, '1星 / 1 Star'),
        (2, '2星 / 2 Stars'),
        (3, '3星 / 3 Stars'),
        (4, '4星 / 4 Stars'),
        (5, '5星 / 5 Stars'),
    ]

    product = models.ForeignKey(Product, verbose_name='产品 / Product', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('users.User', verbose_name='用户 / User', on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField('评分 / Rating', choices=RATING_CHOICES)
    title = models.CharField('标题 / Title', max_length=200)
    comment = models.TextField('评论 / Comment')
    is_approved = models.BooleanField('是否批准 / Is Approved', default=False)
    created_at = models.DateTimeField('创建时间 / Created At', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间 / Updated At', auto_now=True)

    class Meta:
        verbose_name = '评论 / Review'
        verbose_name_plural = '评论 / Reviews'
        ordering = ['-created_at']
        unique_together = ['product', 'user']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class Wishlist(models.Model):
    """Wishlist model."""
    user = models.ForeignKey('users.User', verbose_name='用户 / User', on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, verbose_name='产品 / Product', on_delete=models.CASCADE, related_name='wishlist_users')
    created_at = models.DateTimeField('创建时间 / Created At', auto_now_add=True)

    class Meta:
        verbose_name = '愿望清单项目 / Wishlist Item'
        verbose_name_plural = '愿望清单项目 / Wishlist Items'
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}" 