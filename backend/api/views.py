from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from django.db import transaction
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta

from app.models.product_warehouse import ProductWH
from app.models.product import Product
from app.models.serials import Serials
from app.models.warehouse import Warehouse

from .serializers import (
    ProductWHSerializer,
    ProductSerializer,
    SerialsSerializer,
    WarehouseSerializer,
    ManualSerialUpdateSerializer,
    AutoSerialUpdateSerializer,
    LoginSerializer,
    LogoutSerializer,
    CheckAuthSerializer
)

import jwt


User = get_user_model()


class ProductWHViewSet(viewsets.ModelViewSet):
    queryset = ProductWH.objects.all()
    serializer_class = ProductWHSerializer


class ProductAPIView(APIView):
    serializer_class = ProductSerializer

    def get(self, request, format=None):
        rem = request.GET.get('rem')
        type_ = request.GET.get('type_')

        if not type_:
            if not rem:
                return Response(
                    {'error': 'Serial parameter is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            products = Product.objects.filter(
                remittanceArrived=rem,
                typeID=type_,
                is_deleted=0
            )
            if not products.exists():
                return Response(
                    {'message': 'No products found with this serial number'},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Unexpected error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SerialsViewSet(viewsets.ModelViewSet):
    queryset = Serials.objects.all()
    serializer_class = SerialsSerializer


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class ManualSerialUpdateView(APIView):
    def post(self, request):
        serializer = ManualSerialUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]
        serial = serializer.validated_data["serial"]
        user = request.user
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"success": False, "error": "محصول یافت نشد."},
                status=404
            )
        serial_count = Serials.objects.filter(productID=product).count()
        if serial_count < product.amount:
            new_serial = Serials(
                serialProduct=serial,
                productID=product,
                user_issuer=user
            )
            new_serial.save()
            product.description = Serials.objects.filter(
                productID=product
            ).count()
            product.save()
            return Response(
                {
                    "success": True,
                    "message": "محصول با موفقیت ثبت شد.",
                    "description": product.description,
                    "color": "green"
                }
            )
        else:
            return Response(
                {
                    "success": False,
                    "error": "نمیتوانید بیشتر از موجودی اسکن کنید.",
                    "description": product.description,
                    "color": "red"
                }
            )


class AutoSerialUpdateView(APIView):
    def post(self, request):
        serializer = AutoSerialUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]
        product_code = serializer.validated_data["product_code"]
        count_of_scan = serializer.validated_data["count_of_scan"]
        user = request.user
        with transaction.atomic():
            product = get_object_or_404(Product, id=product_id)
            serial_count = Serials.objects.select_for_update().filter(
                productID=product).count()
            if serial_count + count_of_scan > product.amount:
                return Response({
                    "success": False,
                    "message": "تعداد سریال های جدید بیشتر از موجودی محصول است.", # noqa
                    "description": serial_count,
                    "color": "red"
                }, status=400)
            new_serials = [
                Serials(
                    serialProduct=product_code,
                    productID=product,
                    user_issuer=user
                )
                for _ in range(count_of_scan)
            ]
            Serials.objects.bulk_create(new_serials)
            new_count = serial_count + count_of_scan
            product.description = new_count
            product.save(update_fields=["description"])
        return Response(
            {
                "success": True,
                "message": "محصول با موفقیت به روزرسانی شد.",
                "description": product.description,
                "color": "green"
            }
        )


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            refresh_token = data.get('refresh')
            access_token = data.get('access')
            response.data.pop('refresh', None)
            response.data.pop('access', None)
            # res.set_cookie(
            #     key="access_token",
            #     value=access_token,
            #     httponly=True,
            #     secure=False,  # در موقع پابلیش باید True باشد
            #     samesite="Lax",
            #     max_age=300,
            # )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,  # در موقع پابلیش باید True باشد
                # samesite="Lax",
                samesite="",
                max_age=7*24*60*60,  # 7 روز
                path='/',
            )
            response.data['access'] = access_token
            return response


class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({
                "detail": "No refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            refresh = RefreshToken(RefreshToken)
            access_token = str(refresh.access_token)
        except Exception as e: # noqa
            return Response({
                "detail": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        res = Response({
            "message": "token refreshed"},
            status=status.HTTP_200_OK
        )
        res.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # در موقع پابلیش باید True باشد
            # samesite="Lax",
            samesite="",
            max_age=300,
        )
        return res


class CheckAuthView(APIView):
    def get(self, request):
        serializer = CheckAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')
        user = None
        if access_token:
            try:
                payload = jwt.decode(
                    access_token,
                    settings.SECRET_KEY,
                    algorithms=["HS256"]
                )
                user = User.objects.get(id=payload['user_id'])
                return Response(
                    {"message": "Authenticated", "user": user.username}
                )
            except jwt.ExpiredSignatureError:
                pass
            except jwt.InvalidTokenError:
                pass
        if refresh_token:
            try:
                payload = jwt.decode(
                    refresh_token,
                    settings.SECRET_KEY,
                    algorithms=["HS256"]
                )
                user = User.objects.get(id=payload['user_id'])
                new_access_payload = {
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(minutes=5),
                    'iat': datetime.utcnow(),
                }
                new_access_token = jwt.encode(
                    new_access_payload,
                    settings.SECRET_KEY,
                    algorithm='HS256'
                )
                res = Response(
                    {
                        "message": "Authenticated (refreshed)",
                        "user": user.username
                    }
                )
                res.set_cookie(
                    key="access_token",
                    value=new_access_token,
                    httponly=True,
                    secure=False,
                    # samesite='Lax',
                    samesite="",
                    max_age=5 * 60,
                )
                return res
            except jwt.ExpiredSignatureError:
                return Response(
                    {"message": "Refresh token expired"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            except jwt.InvalidTokenError:
                return Response(
                    {"message": "Invalid refresh token"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(
            {"message": "Not authenticated"},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # ایجاد توکن JWT (مثال ساده)
        access_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=5),
            'iat': datetime.utcnow(),
        }
        access_token = jwt.encode(
            access_payload,
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        refresh_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
        }
        refresh_token = jwt.encode(
            refresh_payload,
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        response = Response(
            {"message": "Login successful"},
            status=status.HTTP_200_OK
        )

        # ست کردن کوکی‌ها
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,  # روی HTTPS بگذار True
            # samesite='Lax',
            samesite="",
            max_age=5 * 60,
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            # samesite='Lax',
            samesite="",
            max_age=24 * 3600,
        )

        return response


class LogoutAPIView(APIView):
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = Response(
            {"message": "Logged out successfully"},
            status=status.HTTP_200_OK
        )
        res.delete_cookie(
            'access_token',
            # samesite='Lax',
            samesite="",
            path='/'
        )
        res.delete_cookie(
            'refresh_token',
            # samesite='Lax',
            samesite="",
            path='/'
        )
        return res
