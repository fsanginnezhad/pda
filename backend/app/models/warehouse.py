from django.db import models
from ..Data.data import COUNT_OF_NUMBER



class Warehouse(models.Model):
    dateOfProd = models.DateTimeField(
        'date_of_prod',
        auto_now_add=True,
        db_comment='Date and time when the order was placed'
    )
    CodeProd = models.CharField(
        'code_prod',
        max_length=100,
        blank=True,
        null=True,
        db_comment='The unique code of the product'
    )
    NameProd = models.CharField(
        'name_prod',
        max_length=100,
        blank=True,
        null=True,
        db_comment='The product associated with this order'
    )
    difference = models.IntegerField(
        'difference',
        blank=True,
        null=True,
        db_comment='The unique code of the product'
    )
    countOfNumber = models.CharField(
        'countOfNumber',
        max_length=10,
        blank=True,
        null=True,
        choices=COUNT_OF_NUMBER
    )
    user_issuer = models.CharField(
        'user_issuer',
        max_length=100,
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

    def __str__(self) -> str:
        return self.NameProd
