import json
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View


class SecretsView(View):

    def get(self, request):
        return HttpResponse(json.dumps(settings.SECRETS), status=200)
