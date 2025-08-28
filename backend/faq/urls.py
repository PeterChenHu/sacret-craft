from django.urls import path
from . import views

app_name = 'faq'

urlpatterns = [
    path('categories/', views.FAQCategoryListView.as_view(), name='category-list'),
    path('faqs/', views.FAQListView.as_view(), name='faq-list'),
    path('faqs/<int:pk>/', views.FAQDetailView.as_view(), name='faq-detail'),
    path('faqs/<int:faq_id>/vote/', views.FAQVoteCreateView.as_view(), name='faq-vote'),
] 