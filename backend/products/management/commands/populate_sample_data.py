from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product, ProductImage
from blog.models import BlogCategory, BlogPost
from faq.models import FAQCategory, FAQ
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create sample categories
        categories_data = [
            {'name': 'Candles', 'description': 'Sacred candles for meditation and prayer'},
            {'name': 'Incense', 'description': 'Aromatic incense for spiritual cleansing'},
            {'name': 'Crystals', 'description': 'Healing crystals and gemstones'},
            {'name': 'Prayer Beads', 'description': 'Mala beads and rosaries'},
            {'name': 'Oils', 'description': 'Essential oils for anointing and healing'},
        ]
        
        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': cat_data['name'].lower().replace(' ', '-'),
                    'description': cat_data['description']
                }
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Create sample products
        products_data = [
            {
                'name': 'Sacred White Candle',
                'description': 'Pure white candle for meditation and prayer rituals',
                'price': Decimal('12.99'),
                'category': categories[0],
                'stock_quantity': 50,
                'sku': 'CANDLE-001'
            },
            {
                'name': 'Sage Incense Sticks',
                'description': 'Purifying sage incense for spiritual cleansing',
                'price': Decimal('8.99'),
                'category': categories[1],
                'stock_quantity': 100,
                'sku': 'INCENSE-001'
            },
            {
                'name': 'Amethyst Crystal',
                'description': 'Healing amethyst crystal for spiritual protection',
                'price': Decimal('24.99'),
                'category': categories[2],
                'stock_quantity': 25,
                'sku': 'CRYSTAL-001'
            },
            {
                'name': '108 Mala Beads',
                'description': 'Traditional 108 bead mala for meditation',
                'price': Decimal('19.99'),
                'category': categories[3],
                'stock_quantity': 30,
                'sku': 'MALA-001'
            },
            {
                'name': 'Lavender Essential Oil',
                'description': 'Pure lavender oil for relaxation and healing',
                'price': Decimal('15.99'),
                'category': categories[4],
                'stock_quantity': 40,
                'sku': 'OIL-001'
            },
        ]
        
        for prod_data in products_data:
            product, created = Product.objects.get_or_create(
                sku=prod_data['sku'],
                defaults={
                    'name': prod_data['name'],
                    'slug': prod_data['name'].lower().replace(' ', '-').replace('(', '').replace(')', ''),
                    'description': prod_data['description'],
                    'short_description': prod_data['description'][:100] + '...',
                    'price': prod_data['price'],
                    'category': prod_data['category'],
                    'stock_quantity': prod_data['stock_quantity'],
                    'status': 'published',
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Created product: {product.name}')
        
        # Create sample blog categories
        blog_categories_data = [
            {'name': 'Spirituality', 'description': 'Articles about spiritual practices'},
            {'name': 'Meditation', 'description': 'Meditation techniques and guides'},
            {'name': 'Healing', 'description': 'Healing practices and remedies'},
        ]
        
        blog_categories = []
        for cat_data in blog_categories_data:
            category, created = BlogCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': cat_data['name'].lower().replace(' ', '-'),
                    'description': cat_data['description']
                }
            )
            blog_categories.append(category)
            if created:
                self.stdout.write(f'Created blog category: {category.name}')
        
        # Create sample blog posts
        blog_posts_data = [
            {
                'title': 'The Power of Sacred Candles',
                'excerpt': 'Discover how sacred candles can enhance your spiritual practice',
                'content': 'Sacred candles have been used for centuries in spiritual practices...',
                'category': blog_categories[0],
                'status': 'published'
            },
            {
                'title': 'Meditation Techniques for Beginners',
                'excerpt': 'Learn simple meditation techniques to start your spiritual journey',
                'content': 'Meditation is a powerful tool for spiritual growth...',
                'category': blog_categories[1],
                'status': 'published'
            },
        ]
        
        # Get or create a user for blog posts
        user, created = User.objects.get_or_create(
            email='admin@sacredcrafts.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        for post_data in blog_posts_data:
            post, created = BlogPost.objects.get_or_create(
                title=post_data['title'],
                defaults={
                    'slug': post_data['title'].lower().replace(' ', '-'),
                    'excerpt': post_data['excerpt'],
                    'content': post_data['content'],
                    'author': user,
                    'status': post_data['status']
                }
            )
            if created:
                self.stdout.write(f'Created blog post: {post.title}')
        
        # Create sample FAQ categories
        faq_categories_data = [
            {'name': 'General', 'description': 'General questions about our products'},
            {'name': 'Shipping', 'description': 'Questions about shipping and delivery'},
            {'name': 'Returns', 'description': 'Return and refund policies'},
        ]
        
        faq_categories = []
        for cat_data in faq_categories_data:
            category, created = FAQCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': cat_data['name'].lower().replace(' ', '-'),
                    'description': cat_data['description']
                }
            )
            faq_categories.append(category)
            if created:
                self.stdout.write(f'Created FAQ category: {category.name}')
        
        # Create sample FAQs
        faqs_data = [
            {
                'question': 'Are your products blessed?',
                'answer': 'Yes, all our products are blessed by spiritual practitioners before shipping.',
                'category': faq_categories[0]
            },
            {
                'question': 'How long does shipping take?',
                'answer': 'Standard shipping takes 3-5 business days. Express shipping is available for faster delivery.',
                'category': faq_categories[1]
            },
            {
                'question': 'What is your return policy?',
                'answer': 'We accept returns within 30 days of purchase for unused items in original packaging.',
                'category': faq_categories[2]
            },
        ]
        
        for faq_data in faqs_data:
            faq, created = FAQ.objects.get_or_create(
                question=faq_data['question'],
                defaults={
                    'answer': faq_data['answer'],
                    'category': faq_data['category'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Created FAQ: {faq.question}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        ) 