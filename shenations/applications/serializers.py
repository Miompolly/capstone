from rest_framework import serializers
from .models import Opportunity, Application

class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']
        

from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user', 'date_applied', 'updated_at']
