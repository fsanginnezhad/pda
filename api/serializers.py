from app.models.product_warehouse import ProductWH
from app.models.product import Product
from app.models.serials import Serials
from app.models.warehouse import Warehouse


from rest_framework import serializers


class ProductWHSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWH
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class SerialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serials
        fields = '__all__'


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'
