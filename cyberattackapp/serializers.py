from rest_framework import serializers
from .models import CyberAttack


class CyberAttackSerializer(serializers.ModelSerializer):
    """
    Serializing class for the CyberAttack model.
    """
    class Meta:
        model = CyberAttack
        fields = '__all__'
