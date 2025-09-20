from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    ProductWHViewSet,
    ProductAPIView,
    SerialsViewSet,
    WarehouseViewSet,
    ManualSerialUpdateView,
    AutoSerialUpdateView,
    CheckAuthView,
    LoginAPIView,
    LogoutAPIView
)


router = DefaultRouter()
router.register(r'productwh', ProductWHViewSet)
# router.register(r'products', ProductAPIView.as_view(), basename='product')
router.register(r'serials', SerialsViewSet)
router.register(r'warehouse', WarehouseViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path(
        "login/",
        LoginAPIView.as_view(),
        name="login"
    ),
    path('product/', ProductAPIView.as_view(), name='product'),
    path(
        'update-product/',
        ManualSerialUpdateView.as_view(),
        name='update-product'
    ),
    path(
        'update-product-auto/',
        AutoSerialUpdateView.as_view(),
        name='update-product-auto'
    ),
    path(
        "check-auth/",
        CheckAuthView.as_view(),
        name="check-auth"
    ),
    path(
        "logout/",
        LogoutAPIView.as_view(),
        name='logout'
    )
]
