# region Import everything to need your project
from django.db import models
from ..Data.data import TYPE_ID
# endregion


# region Product Model
class Product(models.Model):
    name = models.CharField(
        'name',
        max_length=100,
        blank=True,
        null=True,
        db_comment='The name of the product'
    )
    code = models.CharField(
        'code',
        max_length=100,
        blank=True,
        null=True,
        db_comment='The unique code of the product'
    )
    amount = models.PositiveBigIntegerField(
        'amount',
        blank=True,
        null=True,
        db_comment='The quantity or amount of the product'
    )
    description = models.PositiveBigIntegerField(
        'description',
        blank=True,
        null=True,
        db_comment='Description of the product'
    )
    dateProduct = models.DateTimeField(
        blank=True,
        null=True,
        db_comment='The date of production or arrival of the product'
    )
    exporter = models.CharField(
        'exporter',
        max_length=100,
        blank=True,
        null=True,
        db_comment='Name of the exporter of the product'
    )
    remittanceArrived = models.PositiveBigIntegerField(
        'remittance_arrived',
        blank=True,
        null=True,
        db_comment='Indicates whether the remittance or payment has arrived'
    )
    typeID = models.CharField(
        'typeID',
        max_length=20,
        blank=True,
        null=True,
        choices=TYPE_ID
    )
    allow = models.BooleanField(
        'allow',
        default=False,
        blank=True,
        null=True,
        db_comment='True is allow and False is not allow'
    )
    created_at = models.DateTimeField(
        'created_at',
        auto_now_add=True,
        blank=True,
        null=True,
        db_comment='The date and time when the record was created'
    )
    updated_at = models.DateTimeField(
        'updated_at',
        auto_now=True,
        blank=True,
        null=True,
        db_comment='The date and time when the record was last updated'
    )
    is_deleted = models.BooleanField(default=0)

    class Meta:
        db_table = 'product'
        db_table_comment = 'Table containing product information'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.name
# endregion
