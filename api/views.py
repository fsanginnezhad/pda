from rest_framework import viewsets

from app.models.product_warehouse import ProductWH
from app.models.product import Product
from app.models.serials import Serials
from app.models.warehouse import Warehouse

from .serializers import ProductWHSerializer
from .serializers import ProductSerializer
from .serializers import SerialsSerializer
from .serializers import WarehouseSerializer


class ProductWHViewSet(viewsets.ModelViewSet):
    queryset = ProductWH.objects.all()
    serializer_class = ProductWHSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class SerialsViewSet(viewsets.ModelViewSet):
    queryset = Serials.objects.all()
    serializer_class = SerialsSerializer


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
