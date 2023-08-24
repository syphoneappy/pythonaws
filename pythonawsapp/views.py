from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, UploadFilesSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError



@permission_classes([AllowAny])
class FileUploaderView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        file_serializer = UploadFilesSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def create_admin(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"success": "Your account is created."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST", "GET"])
def login_user(request):
    if request.method == "POST":
        data = request.data
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(
                {
                    "success": "Login successful",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Invalid Credentials",
                },
                status=401,
            )
    else:
        return Response(
            {"message": "Invalid request method"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def valided_token(request):
    return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def generate_download_link(request):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    response = s3.list_objects_v2(Bucket=bucket_name)

    download_links = []
    for obj in response.get("Contents", []):
        file_name = obj["Key"]
        download_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": file_name},
            ExpiresIn=3600,
        )
        download_links.append({"file_name": file_name, "download_url": download_url})
    return Response({"download_links": download_links})


import time


@api_view(["GET"])
@permission_classes([AllowAny])
def texttract_text_search(request):
    try:
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        s3_prefix = "uploads/"
        search_term = request.GET.get("search_term")
        text_result = []
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        objects = s3.list_objects_v2(Bucket=bucket_name, Prefix=s3_prefix)

        texttract = boto3.client(
            "textract",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        for obj in objects.get("Contents", []):
            file_name = obj["Key"]
            print(file_name)
            if file_name.endswith(".pdf"):
                print(file_name)
                response = texttract.start_document_text_detection(
                    DocumentLocation={
                        "S3Object": {
                            "Bucket": bucket_name,
                            "Name": file_name,
                        }
                    }
                )
                job_id = response["JobId"]
                print(f"Started document analysis for {file_name}, JobId: {job_id}")

                while True:
                    response = texttract.get_document_text_detection(JobId=job_id)
                    status = response["JobStatus"]
                    if status == "SUCCEEDED":
                        results = response["Blocks"]
                        text = ""
                        found_pages = []

                        for item in results:
                            if item["BlockType"] == "LINE":
                                text += item["Text"] + " "
                                if search_term.lower() in item["Text"].lower():
                                    found_pages.append(item["Page"])

                        if found_pages:
                            text_result.append(
                                {
                                    "DocumentName": file_name,
                                    "Text": text.strip(),
                                    "PagesWithText": found_pages,
                                }
                            )
                        break
                    elif status == "FAILED":
                        print(f"Analysis for {file_name} failed.")
                        break
                    time.sleep(5)

        return Response(text_result)
    except NoCredentialsError:
        return Response(
            {"error": "AWS credentials not found"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
