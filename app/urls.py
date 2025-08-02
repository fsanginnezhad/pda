from django.urls import path
from .views.home import home
from .views.index import index
from .views.product import product, update_product, update_product_auto
from .views.login_user import login_user
from .views.logout_user import logout_user
from .views.warehouse import warehouse
from .views.reportserial import ReportSerial
from .views.serial import serial
from .views.submit_barcode import (
    submit_barcode,
    submit_barcode_auto,
    product_lookup,
    get_product_details,
    submit_order
)


urlpatterns = [
    path('', index, name='index'),
    path('home/<str:type_>/', home, name='home'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    # path('signup/', views.signup, name='signup'),

    path('product/<str:type_>/<str:rem>/', product, name='product'),
    path('barcode/', submit_barcode, name='submit_barcode'),
    path(
        'submit_barcode_auto/',
        submit_barcode_auto,
        name='submit_barcode_auto'
    ),
    path('warehouse/', warehouse, name='warehouse'),
    path('reportserial/', ReportSerial, name='reportserial'),
    path('serial/', serial, name='serial'),

    path('product-lookup/', product_lookup, name='product_lookup'),
    path(
        'get-product-details/', get_product_details,
        name='get_product_details'
    ),
    path('submit-order/', submit_order, name='submit_order'),
    path('update-product/', update_product, name='update_product'),
    path(
        'update-product-auto/',
        update_product_auto,
        name='update_product_auto'
    ),
]
