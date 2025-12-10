# --------------------------------------------------------
# Use Python 3.11 Slim (Debian 12 based)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (Updated for Debian 12)
# We use libgl1 and libglib2.0-0 instead of the old mesa-glx package
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (to cache dependencies)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Start command (Listen on all interfaces)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# --------------------------------------------------------
