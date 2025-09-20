from ..models.warehouse import Warehouse
from ..utils import convert_to_shamsi, convert_to_miladi
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@login_required
def warehouse(request):
    if request.method == 'POST':
        start_date = request.POST.get('fromDate')
        end_date = request.POST.get('toDate')
        if start_date and end_date:
            start_date = convert_to_miladi(start_date)
            end_date = convert_to_miladi(end_date, end_of_day=True)
            all_products = Warehouse.objects.filter(created_at__range=[start_date, end_date])
            products = []
            seen_codes = set()
            for item in all_products:
                if item.CodeProd not in seen_codes:
                    count1 = Warehouse.objects.filter(created_at__range=[start_date, end_date], CodeProd=item.CodeProd, countOfNumber='1').count()
                    count2 = Warehouse.objects.filter(created_at__range=[start_date, end_date], CodeProd=item.CodeProd, countOfNumber='2').count()
                    count3 = Warehouse.objects.filter(created_at__range=[start_date, end_date], CodeProd=item.CodeProd, countOfNumber='3').count()
                    products.append({
                        'dateprod': convert_to_shamsi(item.dateOfProd),
                        'codeKala': item.CodeProd,
                        'nameKala': item.NameProd,
                        'count1': count1,
                        'count2': count2,
                        'count3': count3,
                        'differ2_1': count2 - count1,
                        'differ3_2': count3 - count2,
                        'user': item.user_issuer,
                    })
                    seen_codes.add(item.CodeProd)
            data = {
                'products': products
            }
            return render(request, 'app/anbargardani.html', data)
    return render(request, 'app/anbargardani.html')
