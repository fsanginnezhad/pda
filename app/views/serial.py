from ..models.product import Product
from django.shortcuts import render
from ..Data.data import TYPE_ID
from ..utils import convert_to_miladi, convert_to_shamsi, get_tehran_hour_minute
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@login_required
def serial(request):
    if request.method == 'POST':
        start_date = request.POST.get('fromDate')
        end_date = request.POST.get('toDate')
        if start_date and end_date:
            start_date = convert_to_miladi(start_date)
            end_date = convert_to_miladi(end_date, end_of_day=True)
            datas = Product.objects.filter(dateProduct__range=[start_date, end_date])
            products = []
            for prod in datas:
                user, clock, date_serial = '', '', ''
                des = prod.prods.all().count()
                dateP = convert_to_shamsi(prod.dateProduct)
                if prod.updated_at:
                    serials = prod.prods.all().values('serialProduct', 'productID', 'user_issuer', 'updated_at')
                    for serial_product in serials:
                        clock = get_tehran_hour_minute(prod.updated_at)
                        date_serial = convert_to_shamsi(prod.updated_at)
                        user = serial_product['user_issuer']
                products.append(
                    {
                        'type_id': [id[1] for id in TYPE_ID if id[0] == prod.typeID][0],
                        'code': prod.code,
                        'name': prod.name,
                        'date': dateP,
                        'export': prod.exporter,
                        'user': user,
                        'amount': prod.amount,
                        'des': des,
                        'differ': (prod.amount - des),
                        'remArr': prod.remittanceArrived,
                        'date_serial': date_serial,
                        'clock': clock
                    }
                )
            data = {
                'products': products
            }
            return render(request, 'app/serial.html', data)
    return render(request, 'app/serial.html')
