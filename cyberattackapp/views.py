import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from .commands import GetAttacksCommand, GenerateAttacksCommand
from .serializers import CyberAttackSerializer


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class CyberAttackView(APIView):
    """
    A View class responsible for GET requests related to Cyber Attacks.
    """
    def get(self, request):
        query = dict(request.query_params)
        for key, value in query.copy().items():
            for item in value:
                if len(item) == 0:
                    value.remove(item)
            if len(value) == 0:
                del query[key]
        cyber_attacks = GetAttacksCommand(**query).execute()
        serializer = CyberAttackSerializer(cyber_attacks, many=True)
        return JSONResponse(json.dumps(serializer.data))


class CyberMapView(View):
    """
    A View class responsible for rendering the Cyber Attack Map.
    """
    def get(self, request):
        GenerateAttacksCommand().execute()
        return render(request, "cyberattackapp/index.html")

