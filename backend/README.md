# Sacred Crafts Marketplace - Backend

## Architecture Overview

The Sacred Crafts Marketplace backend is built using Django REST Framework (DRF) with a modular architecture designed for scalability and maintainability.

### Technology Stack

- **Framework**: Django 5.0.2 + Django REST Framework 3.14.0
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT (JSON Web Tokens) with django-rest-framework-simplejwt
- **CORS**: django-cors-headers for frontend integration
- **File Storage**: Local storage (development) / AWS S3 (production)
- **Background Tasks**: Celery + Redis
- **Email**: Django's email backend
- **Social Auth**: django-allauth

### Project Structure

```
backend/
├── sacred_crafts/          # Main Django project
│   ├── settings.py         # Django settings
│   ├── urls.py            # Main URL configuration
│   ├── wsgi.py            # WSGI application
│   └── asgi.py            # ASGI application
├── users/                  # User management app
│   ├── models.py          # User and Address models
│   ├── views.py           # User API views
│   ├── serializers.py     # User serializers
│   └── urls.py            # User URL patterns
├── products/              # Product catalog app
│   ├── models.py          # Product, Category, Review models
│   ├── views.py           # Product API views
│   ├── serializers.py     # Product serializers
│   └── urls.py            # Product URL patterns
├── orders/                # Order management app
│   ├── models.py          # Order, OrderItem, Cart models
│   ├── views.py           # Order API views
│   ├── serializers.py     # Order serializers
│   └── urls.py            # Order URL patterns
├── blog/                  # Blog content app
├── faq/                   # FAQ management app
├── media/                 # Uploaded files
├── static/                # Static files
└── manage.py              # Django management script
```

### Data Models

#### User Management (`users/`)
- **User**: Custom user model with email authentication
- **Address**: User addresses for shipping/billing

#### Product Catalog (`products/`)
- **Category**: Product categories with hierarchical structure
- **Product**: Main product model with pricing, inventory, and metadata
- **ProductImage**: Product images with primary image support
- **Review**: User reviews and ratings
- **Wishlist**: User wishlist functionality

#### Order Management (`orders/`)
- **Order**: Complete order information with status tracking
- **OrderItem**: Individual items in orders
- **Cart**: Shopping cart functionality

### API Endpoints

#### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token

#### Users
- `POST /api/users/register/` - User registration
- `GET/PUT /api/users/profile/` - User profile
- `GET/POST /api/users/addresses/` - User addresses
- `GET/PUT/DELETE /api/users/addresses/<id>/` - Individual address
- `POST /api/users/addresses/<id>/set-default/` - Set default address

#### Products
- `GET /api/products/` - List products
- `GET /api/products/<id>/` - Product details
- `GET /api/categories/` - List categories
- `GET /api/products/<id>/reviews/` - Product reviews
- `POST /api/products/<id>/reviews/` - Create review

#### Orders
- `GET/POST /api/orders/` - List/create orders
- `GET /api/orders/<id>/` - Order details
- `GET/POST /api/cart/` - Shopping cart
- `DELETE /api/cart/<id>/` - Remove from cart

### Key Features

1. **JWT Authentication**: Secure token-based authentication
2. **CORS Support**: Cross-origin resource sharing for frontend
3. **File Uploads**: Image uploads for products and user avatars
4. **Search & Filtering**: Advanced product search and filtering
5. **Pagination**: API pagination for large datasets
6. **Validation**: Comprehensive data validation
7. **Error Handling**: Proper error responses
8. **Documentation**: Auto-generated API documentation

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Setup**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**:
   ```bash
   python manage.py runserver
   ```

### Development Workflow

1. **API Testing**: Use Django admin or tools like Postman
2. **Database**: SQLite for development, PostgreSQL for production
3. **Static Files**: Collected with `python manage.py collectstatic`
4. **Media Files**: Served locally in development, S3 in production

### Production Considerations

1. **Security**: Use environment variables for sensitive data
2. **Database**: PostgreSQL for production
3. **File Storage**: AWS S3 for media files
4. **Caching**: Redis for session and cache storage
5. **Monitoring**: Django Debug Toolbar disabled in production
6. **HTTPS**: SSL/TLS encryption required

### API Documentation

The API follows RESTful conventions:
- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT/PATCH**: Update existing resources
- **DELETE**: Remove resources

All endpoints return JSON responses with appropriate HTTP status codes.

### Authentication Flow

1. User registers via `/api/users/register/`
2. User logs in via `/api/token/` to get access token
3. Include token in Authorization header: `Bearer <token>`
4. Use refresh token to get new access token when expired

### Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message",
  "detail": "Detailed error information"
}
```

### Performance Optimizations

1. **Database**: Proper indexing on frequently queried fields
2. **Caching**: Redis for session and cache storage
3. **Pagination**: Limit response sizes
4. **Select Related**: Optimize database queries
5. **Image Optimization**: Compress uploaded images

This backend provides a robust foundation for the Sacred Crafts Marketplace, with clear separation of concerns, comprehensive API endpoints, and production-ready features. 