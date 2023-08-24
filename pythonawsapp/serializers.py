from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth.models import User
from .models import CustomUser, UploadedFiles


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UploadFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFiles
        fields = "__all__"
