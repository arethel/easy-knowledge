from rest_framework import serializers
from .models import Conversation

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'title', 'model', 'system_prompt', 'messages', 'timestamp']
        read_only_fields = ['user']