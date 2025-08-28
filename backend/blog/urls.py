from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('posts/', views.BlogPostListView.as_view(), name='post-list'),
    path('posts/<slug:slug>/', views.BlogPostDetailView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/comments/', views.BlogCommentCreateView.as_view(), name='comment-create'),
    path('categories/', views.BlogCategoryListView.as_view(), name='category-list'),
    path('tags/', views.BlogTagListView.as_view(), name='tag-list'),
] 