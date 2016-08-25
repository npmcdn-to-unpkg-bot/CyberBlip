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
    http_method_names = ['get']

    def get_queryset(self):
        queryset = GetAttacksCommand(**self.request.query_params).execute()
        return queryset


class CyberMapView(View):
    """
    A View class responsible for rendering the Cyber Attack Map.
    """
    def get(self, request):
        # TODO: Replace GenerateAttacksCommand() with AttackUpdateCommand() loop (needs to be in its own thread)
        GenerateAttacksCommand().execute()
        return render(request, "cyberattackapp/index.html")

