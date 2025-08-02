from django.contrib import admin
from .models.product_warehouse import ProductWH
from .models.product import Product
from .models.serials import Serials
from .models.warehouse import Warehouse


admin.site.register(ProductWH)
admin.site.register(Product)
admin.site.register(Serials)
admin.site.register(Warehouse)
