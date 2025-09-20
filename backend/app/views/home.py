# region Import everything to need your project
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
# endregion


# region Index Function
# @csrf_exempt
@login_required
def home(request, type_):
    if request.method == 'POST':
        rem = request.POST.get('RemittanceNumber')
        # request.session['RemittanceNumber'] = rem
        return redirect('product', type_, rem)
    return render(request, 'app/index.html')
# endregion
