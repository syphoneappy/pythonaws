# Generated by Django 4.2.4 on 2023-08-23 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pythonawsapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFiles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='uploads/')),
            ],
        ),
    ]
