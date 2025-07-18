FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Python deps
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Project
COPY . .

# Static dir for collectstatic
RUN mkdir -p /app/static

EXPOSE 8082

# Wait for PostgreSQL (on db:5432) then start Gunicorn
CMD ["sh", "-c", "/wait-for-it.sh db:5432 -- gunicorn shenations.wsgi:application --bind 0.0.0.0:${PORT:-8082}"]
