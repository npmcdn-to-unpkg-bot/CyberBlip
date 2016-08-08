from django.shortcuts import render
from django.views.generic import View


class CyberAttackView(View):
    """
    A View class responsible for GET and POST requests related to Cyber Attacks.
    """
    def get(self, request):
        return render(request, "cyberattackapp/index.html")
