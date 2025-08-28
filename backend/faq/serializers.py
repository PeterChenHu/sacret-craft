from rest_framework import serializers
from .models import FAQCategory, FAQ, FAQVote


class FAQCategorySerializer(serializers.ModelSerializer):
    """Serializer for FAQCategory model."""
    class Meta:
        model = FAQCategory
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQ model."""
    category = FAQCategorySerializer(read_only=True)
    helpful_percentage = serializers.ReadOnlyField()

    class Meta:
        model = FAQ
        fields = '__all__'
        read_only_fields = ('views', 'helpful_votes', 'unhelpful_votes', 'created_at', 'updated_at')


class FAQVoteSerializer(serializers.ModelSerializer):
    """Serializer for FAQVote model."""
    class Meta:
        model = FAQVote
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data) 