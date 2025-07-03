# backend/Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port (8000 default for Django)
EXPOSE 8000

# Run Django (use Gunicorn in prod)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
