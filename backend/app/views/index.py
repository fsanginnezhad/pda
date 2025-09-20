# region Import everything to need your project
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
# endregion


# region Index Function
# @csrf_exempt
@login_required
def index(request):
    if request.method == 'POST':
        type_ = request.POST.get('type')
        # request.session['type'] = type_
        return redirect('home', type_=type_)
    return render(request, 'app/home.html')
# endregion
