from django.conf.urls import url
from .views import CyberMapView, CyberAttackView

urlpatterns = [
    url(r'^$', CyberMapView.as_view(), name='cyber_map_view'),
    url(r'cyberattacks', CyberAttackView.as_view(), name='cyber_attack_view')
]
