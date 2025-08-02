from ..models.product import Product
from django.shortcuts import render
from ..Data.data import TYPE_ID
from ..utils import convert_to_miladi, convert_to_shamsi, get_tehran_hour_minute
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@login_required
def ReportSerial(request):
    if request.method == 'POST':
        start_date = request.POST.get('fromDate')
        end_date = request.POST.get('toDate')
        if start_date and end_date:
            start_date = convert_to_miladi(start_date)
            end_date = convert_to_miladi(end_date, end_of_day=True)
            prods = Product.objects.filter(dateProduct__range=[start_date, end_date])
            products = []
            for prod in prods:
                data = {}
                date, clo, serial_prod, user = '', '', '', ''
                des = prod.prods.all().count()
                date_prod = convert_to_shamsi(prod.dateProduct)
                if prod.updated_at:
                    serialss = prod.prods.all().values(
                        'serialProduct', 'productID', 'user_issuer', 'updated_at'
                    )
                    for serial_product in serialss:
                        for prod in prods:
                            if serial_product['productID'] == prod.id:
                                clo = get_tehran_hour_minute(prod.updated_at)
                                date = convert_to_shamsi(prod.updated_at)
                                serial_prod = serial_product['serialProduct']
                                user = serial_product['user_issuer']
                                data['remArr'] = prod.remittanceArrived
                                data['type_id'] = [id[1] for id in TYPE_ID if id[0] == prod.typeID][0]
                                data['dateProduct'] = date_prod
                                data['code'] = prod.code
                                data['name'] = prod.name
                                data['export'] = prod.exporter
                                data['user'] = user
                                data['amount'] = prod.amount
                                data['date'] = date
                                data['clock'] = clo
                                data['des'] = des
                                data['differ'] = (prod.amount - des)
                                data['serial'] = serial_prod
                                products.append(data)
                else:
                    data['remArr'] = prod.remittanceArrived
                    data['type_id'] = [id[1] for id in TYPE_ID if id[0] == prod.typeID][0]
                    data['dateProduct'] = date_prod
                    data['code'] = prod.code
                    data['name'] = prod.name
                    data['export'] = prod.exporter
                    data['user'] = user
                    data['amount'] = prod.amount
                    data['date'] = date
                    data['clock'] = clo
                    data['des'] = des
                    data['differ'] = (prod.amount - des)
                    data['serial'] = serial_prod
                    products.append(data)
            data = {
                'products': products,
            }
            return render(request, 'app/reportserial.html', data)
    return render(request, 'app/reportserial.html')
