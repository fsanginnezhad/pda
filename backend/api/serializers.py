from app.models.product_warehouse import ProductWH
from app.models.product import Product
from app.models.serials import Serials
from app.models.warehouse import Warehouse

from django.contrib.auth import authenticate

from rest_framework import serializers


class ProductWHSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWH
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    serial_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_serial_count(self, obj):
        return Serials.objects.filter(productID=obj.id).count()


class SerialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serials
        fields = '__all__'


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'


class ManualSerialUpdateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    serial = serializers.CharField()


class AutoSerialUpdateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_code = serializers.CharField()
    count_of_scan = serializers.IntegerField()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        data['user'] = user
        return data


class LogoutSerializer(serializers.Serializer):
    pass


class CheckAuthSerializer(serializers.Serializer):
    pass
