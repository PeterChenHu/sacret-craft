from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import FAQCategory, FAQ, FAQVote
from .serializers import FAQCategorySerializer, FAQSerializer, FAQVoteSerializer


class FAQCategoryListView(generics.ListAPIView):
    """View for listing FAQ categories."""
    queryset = FAQCategory.objects.filter(is_active=True)
    serializer_class = FAQCategorySerializer
    permission_classes = [permissions.AllowAny]


class FAQListView(generics.ListAPIView):
    """View for listing FAQs."""
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_featured']
    search_fields = ['question', 'answer']
    ordering_fields = ['order', 'created_at', 'views', 'helpful_votes']

    def get_queryset(self):
        return FAQ.objects.filter(is_active=True).select_related('category')


class FAQDetailView(generics.RetrieveAPIView):
    """View for FAQ details."""
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return FAQ.objects.filter(is_active=True).select_related('category')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)


class FAQVoteCreateView(generics.CreateAPIView):
    """View for creating FAQ votes."""
    serializer_class = FAQVoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        faq = FAQ.objects.get(id=self.kwargs['faq_id'])
        serializer.save(faq=faq)
        
        # Update FAQ vote counts
        vote_type = serializer.validated_data['vote_type']
        if vote_type == 'helpful':
            faq.helpful_votes += 1
        else:
            faq.unhelpful_votes += 1
        faq.save() 