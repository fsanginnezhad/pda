from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    ProductWHViewSet,
    ProductViewSet,
    SerialsViewSet,
    WarehouseViewSet
)


router = DefaultRouter()
router.register(r'productwh', ProductWHViewSet)
router.register(r'product', ProductViewSet)
router.register(r'serials', SerialsViewSet)
router.register(r'warehouse', WarehouseViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
