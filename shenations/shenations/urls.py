from django.contrib import admin
from django.urls import include, path
from django.shortcuts import redirect

def redirect_to_frontend(request):
    return redirect('https://capstone-kohl-chi.vercel.app/')  # Your frontend URL

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/applications/', include('applications.urls')),
    path('', redirect_to_frontend),  # Redirect root URL to frontend
]
