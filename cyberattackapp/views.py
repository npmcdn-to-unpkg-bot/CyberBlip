from django.shortcuts import render
from django.views.generic import View
from rest_framework.viewsets import ModelViewSet
from .commands import GetAttacksCommand, GenerateAttacksCommand
from .serializers import CyberAttackSerializer


class CyberAttackView(ModelViewSet):
    """
    A View class responsible for GET requests related to Cyber Attacks.
    """
    queryset = GetAttacksCommand().execute()
    serializer_class = CyberAttackSerializer


class CyberMapView(View):
    """
    A View class responsible for rendering the Cyber Attack Map.
    """
    def get(self, request):
        GenerateAttacksCommand().execute()
        return render(request, "cyberattackapp/index.html")
