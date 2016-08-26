from rest_framework import serializers
from .models import CyberAttack, Target


class CyberAttackSerializer(serializers.ModelSerializer):
    """
    Serializing class for the CyberAttack model.
    """
    class Meta:
        model = CyberAttack
        fields = '__all__'


class TargetSerializer(serializers.ModelSerializer):
    """
    Serializing class for the Target model.
    """
    class Meta:
        model = Target
        fields = '__all__'
