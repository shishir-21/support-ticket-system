from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    # Admin panel route
    path('admin/', admin.site.urls),

    # API routes for tickets app
    path('api/', include('tickets.urls')),
]
