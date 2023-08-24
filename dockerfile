# Use the official Python image as a parent image
FROM python:3.8-alpine

# Set environment variables (optional)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# Create and set the working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache build-base postgresql-dev

# Copy the requirements file into the container
COPY requirements.txt /app/

RUN apk add --no-cache py3-yaml

RUN apk add --no-cache libffi-dev
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your project files into the container
COPY . /app/

# Expose a port if your application listens on one (replace 8000 with your port)
EXPOSE 8000

# Define the command to run your application (adjust as needed)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
