from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self) -> str:
        return self.username


class UploadedFiles(models.Model):
    file = models.FileField(upload_to="uploads/", max_length=1000)
