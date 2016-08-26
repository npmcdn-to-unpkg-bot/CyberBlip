from rest_framework import serializers
from .models import CyberAttack, Target


class TargetSerializer(serializers.ModelSerializer):
    """
    Serializing class for the Target model.
    """
    class Meta:
        model = Target
        fields = '__all__'


class CyberAttackSerializer(serializers.ModelSerializer):
    """
    Serializing class for the CyberAttack model.
    """
    target = TargetSerializer()

    class Meta:
        model = CyberAttack
        fields = '__all__'

