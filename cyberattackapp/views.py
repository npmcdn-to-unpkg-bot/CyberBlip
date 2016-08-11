import json
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from .commands import GetAttacksCommand


class CyberAttackView(View):
    """
    A View class responsible for GET and POST requests related to Cyber Attacks.
    """
    def get(self, request):
        if request.is_ajax():
            recent_attacks = GetAttacksCommand().execute()
            return HttpResponse(json.dumps(recent_attacks), status=200)
        else:
            return render(request, "cyberattackapp/index.html")
