from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from .views import CyberMapView, CyberAttackView

router = DefaultRouter()
router.register(r'cyberattacks', CyberAttackView, base_name='cyber_attack_view')

urlpatterns = [
    url(r'^$', CyberMapView.as_view(), name='cyber_map_view')
]

urlpatterns += router.urls
