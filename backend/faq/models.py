from django.db import models
from django.utils.translation import gettext_lazy as _


class FAQCategory(models.Model):
    """FAQ category model."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('FAQ category')
        verbose_name_plural = _('FAQ categories')
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class FAQ(models.Model):
    """FAQ model."""
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.ForeignKey(FAQCategory, on_delete=models.CASCADE, related_name='faqs')
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    helpful_votes = models.PositiveIntegerField(default=0)
    unhelpful_votes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQs')
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.question

    @property
    def helpful_percentage(self):
        total_votes = self.helpful_votes + self.unhelpful_votes
        if total_votes > 0:
            return (self.helpful_votes / total_votes) * 100
        return 0


class FAQVote(models.Model):
    """FAQ vote model."""
    VOTE_CHOICES = [
        ('helpful', 'Helpful'),
        ('unhelpful', 'Unhelpful'),
    ]

    faq = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='faq_votes')
    vote_type = models.CharField(max_length=10, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('FAQ vote')
        verbose_name_plural = _('FAQ votes')
        unique_together = ['faq', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.faq.question[:50]}" 