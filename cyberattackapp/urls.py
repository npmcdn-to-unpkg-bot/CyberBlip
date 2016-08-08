from django.conf.urls import url
from .views import CyberAttackView


urlpatterns = [
    url(r'^$', CyberAttackView.as_view(), name='cyber_attack_view')
]
