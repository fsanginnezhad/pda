from django import forms
from .models import Product, Serials


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            'dateProduct',
            'typeID',
            'remittanceArrived',
            'name',
            'code',
            'amount',
            'exporter',
            'allow',
            'description',
        ]


class SerialsForm(forms.ModelForm):
    class Meta:
        model = Serials
        fields = [
            'productID',
            'serialProduct',
        ]

