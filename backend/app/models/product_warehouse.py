# region Import everything to need your project
from django.db import models
# endregion


# region Serial Model
class ProductWH(models.Model):
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
        db_table = 'productWH'
        db_table_comment = 'Table containing product information'
        verbose_name = 'ProductWH'
        verbose_name_plural = 'ProductsWH'

    def __str__(self):
        return self.name
# endregion
