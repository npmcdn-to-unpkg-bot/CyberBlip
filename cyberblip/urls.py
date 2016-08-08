
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('cyberattackapp.urls')),
    url(r'^cyberattackapp', include('cyberattackapp.urls')),
]
