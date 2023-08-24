from django.contrib import admin
from django.urls import path, include
from . import views
from .views import FileUploaderView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    
    path("register/", views.create_admin),
    path("login/", obtain_auth_token, name="login_user"),
    path("validate/", views.valided_token),
    path("uploadPdf/", FileUploaderView.as_view(), name="file-upload"),
    path(
        "generate-download-links/",
        views.generate_download_link,
        name="generate-download-links",
    ),
    path("search-pdf/", views.texttract_text_search),
]
