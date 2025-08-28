from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Review, Wishlist
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    ReviewSerializer, WishlistSerializer
)


class CategoryListView(generics.ListAPIView):
    """View for listing categories."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    """View for listing products."""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'featured', 'is_blessed']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['price', 'created_at', 'name']

    def get_queryset(self):
        return Product.objects.filter(
            status='published',
            is_active=True
        ).select_related('category').prefetch_related('images', 'reviews')


class ProductDetailView(generics.RetrieveAPIView):
    """View for product details."""
    queryset = Product.objects.filter(status='published', is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

    def get_queryset(self):
        return Product.objects.filter(
            status='published',
            is_active=True
        ).select_related('category').prefetch_related('images', 'reviews')


class ReviewCreateView(generics.CreateAPIView):
    """View for creating product reviews."""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product = Product.objects.get(id=self.kwargs['id'])
        serializer.save(product=product)


class WishlistListView(generics.ListCreateAPIView):
    """View for user wishlist."""
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')


class WishlistDetailView(generics.DestroyAPIView):
    """View for removing items from wishlist."""
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_wishlist(request, product_id):
    """Add a product to wishlist."""
    try:
        product = Product.objects.get(id=product_id, status='published', is_active=True)
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product
        )
        if created:
            return Response({'message': 'Product added to wishlist'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Product already in wishlist'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_wishlist(request, product_id):
    """Remove a product from wishlist."""
    try:
        wishlist_item = Wishlist.objects.get(user=request.user, product_id=product_id)
        wishlist_item.delete()
        return Response({'message': 'Product removed from wishlist'}, status=status.HTTP_200_OK)
    except Wishlist.DoesNotExist:
        return Response({'error': 'Product not in wishlist'}, status=status.HTTP_404_NOT_FOUND) 