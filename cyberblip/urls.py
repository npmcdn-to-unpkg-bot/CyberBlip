
from django.conf.urls import include, url
from django.contrib import admin
from .SecretsView import SecretsView


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('cyberattackapp.urls')),
    url(r'^cyberattackapp', include('cyberattackapp.urls')),
    url(r'^configuration', SecretsView.as_view())
]
