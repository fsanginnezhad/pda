# region Import everything to need your project
from django.contrib.auth import logout
from django.shortcuts import redirect
# endregion


# region Logout Function
def logout_user(request):
    logout(request)
    return redirect('login')
# endregion
