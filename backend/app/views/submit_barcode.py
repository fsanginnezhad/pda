from django.contrib import messages
from django.shortcuts import render
from ..models.warehouse import Warehouse
from ..models.product_warehouse import ProductWH
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import json
from django.views.decorators.csrf import csrf_protect, csrf_exempt



def product_lookup(request):
    return render(request, 'product.html')


def get_product_details(request):
    if request.method == 'GET':
        product_code = request.GET.get('product_code')
        counted = request.session.get('number')
        if counted == 'manual1':
            counted = '1'
        elif counted == 'manual2':
            counted = '2'
        elif counted == 'manual3':
            counted = '3'
        try:
            product = ProductWH.objects.get(code=product_code)
            wh = Warehouse.objects.filter(CodeProd=product_code, countOfNumber=counted).count() # noqa
            data = {
                'name': product.name,
                'code': product.code,
                'scan': wh
            }
        except ProductWH.DoesNotExist:
            data = {'error': 'محصول پیدا نشد'}
        except ValueError:
            data = {'error': 'محصول پیدا نشد'}
        return JsonResponse(data)


def submit_order(request):
    if request.method == 'POST':
        counted = request.session.get('number')
        product_code = request.POST.get('product_code')
        quantity = request.POST.get('quantity')
        nameProd = ProductWH.objects.filter(
            code=product_code).values('name')
        if not nameProd:
            messages.error(request, 'کد مورد نظر یافت نشد')
        else:
            counted_result = ''
            if counted == 'manual1' or counted == 'auto1':
                counted_result = '1'
            elif counted == 'manual2' or counted == 'auto2':
                counted_result = '2'
            elif counted == 'manual3' or counted == 'auto3':
                counted_result = '3'
            for _ in range(int(quantity)):
                warehouse = Warehouse(
                    CodeProd=product_code,
                    NameProd=nameProd[0]['name'],
                    countOfNumber=counted_result,
                    user_issuer=request.user
                )
                warehouse.save()
                messages.success(request, 'با موفقیت ثبت گردید')
        return JsonResponse({'success': True})


@csrf_exempt
@login_required
def submit_barcode(request):
    if request.method == 'POST':
        counted1 = request.POST.get('number')
        if counted1:
            request.session['number'] = counted1
        counted = request.session.get('number')
        data = {
            'counted': counted
        }
        # messages.error(request, 'لطفا سریال را وارد کنید.')
        return render(request, 'app/input_barcode.html', data)
    return render(request, 'app/warehouse.html')


@csrf_protect
def submit_barcode_auto(request):
    if request.method == 'POST':
        user = request.user
        counted1 = request.POST.get('number')
        if counted1:
            request.session['number'] = counted1
        counted = request.session.get('number')
        datas = json.loads(request.body)
        codeProduct = datas.get('serial')
        nameProd = ProductWH.objects.filter(
            code=codeProduct).values('name')
        msg = ''
        if not nameProd:
            if codeProduct:
                msg = 'کد مورد نظر یافت نشد'
            return JsonResponse({
                'success': True,
                'message': msg,
                'color': 'red'
            })
        else:
            counted_result = ''
            if counted == 'manual1' or counted == 'auto1':
                counted_result = '1'
            elif counted == 'manual2' or counted == 'auto2':
                counted_result = '2'
            elif counted == 'manual3' or counted == 'auto3':
                counted_result = '3'
            warehouse = Warehouse(
                CodeProd=codeProduct,
                NameProd=nameProd[0]['name'],
                countOfNumber=counted_result,
                user_issuer=user
            )
            warehouse.save()
            msg = 'با موفقیت ثبت گردید'
        return JsonResponse({
            'success': True,
            'message': msg,
            'color': 'green'
        })
