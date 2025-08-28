from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, BlogCategory, BlogTag, BlogComment
from .serializers import (
    BlogPostSerializer, BlogPostDetailSerializer, BlogCategorySerializer,
    BlogTagSerializer, BlogCommentSerializer
)


class BlogPostListView(generics.ListAPIView):
    """View for listing blog posts."""
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'featured', 'author']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at', 'published_at', 'views', 'title']

    def get_queryset(self):
        return BlogPost.objects.filter(
            status='published'
        ).select_related('author').prefetch_related('comments')


class BlogPostDetailView(generics.RetrieveAPIView):
    """View for blog post details."""
    queryset = BlogPost.objects.filter(status='published')
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(
            status='published'
        ).select_related('author').prefetch_related('comments')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)


class BlogCategoryListView(generics.ListAPIView):
    """View for listing blog categories."""
    queryset = BlogCategory.objects.filter(is_active=True)
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]


class BlogTagListView(generics.ListAPIView):
    """View for listing blog tags."""
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [permissions.AllowAny]


class BlogCommentCreateView(generics.CreateAPIView):
    """View for creating blog comments."""
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post = BlogPost.objects.get(slug=self.kwargs['slug'])
        serializer.save(post=post) 