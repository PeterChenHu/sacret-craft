from rest_framework import serializers
from .models import BlogPost, BlogCategory, BlogTag, BlogComment


class BlogCategorySerializer(serializers.ModelSerializer):
    """Serializer for BlogCategory model."""
    class Meta:
        model = BlogCategory
        fields = '__all__'


class BlogTagSerializer(serializers.ModelSerializer):
    """Serializer for BlogTag model."""
    class Meta:
        model = BlogTag
        fields = '__all__'


class BlogCommentSerializer(serializers.ModelSerializer):
    """Serializer for BlogComment model."""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = BlogComment
        fields = '__all__'
        read_only_fields = ('user', 'is_approved', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for BlogPost model."""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    comments = BlogCommentSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ('views', 'created_at', 'updated_at', 'published_at')

    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class BlogPostDetailSerializer(BlogPostSerializer):
    """Detailed serializer for BlogPost model."""
    class Meta(BlogPostSerializer.Meta):
        fields = '__all__' 