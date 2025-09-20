from django.db import models
from .product import Product


class Serials(models.Model):
    serialProduct = models.CharField(
        'serial_product',
        max_length=100,
        blank=True,
        null=True,
        db_comment='The serial of the product'
    )
    productID = models.ForeignKey(
        Product,
        verbose_name='product_id',
        related_name='prods',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        db_comment='The product associated with this order'
    )
    user_issuer = models.CharField(
        'user_issuer',
        max_length=10,
        blank=True,
        null=True,
        db_comment='The product associated with this order'
    )
    created_at = models.DateTimeField(
        'serial_created',
        auto_now_add=True,
        db_comment='Date and time when the order was placed'
    )
    updated_at = models.DateTimeField(
        'serial_updated',
        auto_now=True,
        db_comment='The date and time when the record was last updated'
    )
    is_deleted = models.BooleanField(default=0)
