from django.contrib.auth.decorators import login_required
# from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render, redirect
from ..utils import convert_to_shamsi
from ..models import Product, Serials
from django.http import JsonResponse
from django.contrib import messages
from ..Data.data import TYPE_ID
import json


def update_product_auto(request):
    if request.method == 'POST':
        msg, des, color = '', '', ''
        data = json.loads(request.body)
        user = request.user
        product_id = data.get('product_id')
        code = data.get('product_code')
        countOfscan = data.get('countOfscan')
        product = Product.objects.get(id=product_id)
        serial_count = Serials.objects.filter(productID=product_id).count()
        product_amount = product.amount
        if int(serial_count) < int(product_amount):
            ser = []
            for _ in range(int(countOfscan)):
                new_serial = Serials(
                    serialProduct=code,
                    productID=product,
                    user_issuer=user
                )
                ser.append(new_serial)
                new_serial.save()
            product.description = len(ser)
            product.save()
            msg = 'محصول با موفقیت به روزرسانی شد'
            des = product.description
            color = 'green'
        else:
            msg = 'نمیتوانید بیشتر از موجودی اسکن کنید.'
            des = product.description
            color = 'red'
        return JsonResponse({
            'success': True,
            'message': msg,
            'description': des,
            'color': color
        })


def update_product(request):
    if request.method == 'POST':
        msg, des, color = '', '', ''
        data = json.loads(request.body)
        user = request.user
        product_id = data.get('product_id')
        serial = data.get('serial')
        product = Product.objects.get(id=product_id)
        serial_count = Serials.objects.filter(productID=product_id).count()
        product_amount = product.amount
        if int(serial_count) < int(product_amount):
            new_serial = Serials(
                serialProduct=serial,
                productID=product,
                user_issuer=user
            )
            new_serial.save()
            product.description = Serials.objects.filter(productID=product_id).count()
            product.save()
            msg = 'محصول با موفقیت به روزرسانی شد'
            des = product.description
            color = 'green'
        else:
            msg = 'نمیتوانید بیشتر از موجودی اسکن کنید.'
            des = product.description
            color = 'red'
        return JsonResponse({
            'success': True,
            'message': msg,
            'description': des,
            'color': color
        })


@login_required
def product(request, type_, rem):
    try:
        # rem = request.session.get('RemittanceNumber')
        # type_ = request.session.get('type')
        prods = Product.objects.filter(remittanceArrived=rem, typeID=type_, is_deleted=0) # noqa
        if prods.exists():
            products = []
            user = request.user
            for i in prods:
                serials_products = Serials.objects.filter(productID=i.id).count()
                products.append({
                    'id': i.id,
                    'name': i.name,
                    'code': i.code,
                    'amount': i.amount,
                    'description': serials_products,
                    'remArr': i.remittanceArrived,
                    'allow': i.allow,
                })
            data = {
                'products': products,
                'date_product': convert_to_shamsi(prods.first().dateProduct),
                'type_id': [id[1] for id in TYPE_ID if id[0] == prods.first().typeID][0], # noqa
                'export': prods.first().exporter,
                'user': user,
            }
            return render(request, 'app/product.html', data)
        else:
            if rem:
                messages.error(request, f'کالا با شماره {rem} وجود ندارد.')
            return redirect('index', type_)
    except Exception as e:
        messages.error(request, f'خطا: {str(e)}')
        return redirect('index', type_)
