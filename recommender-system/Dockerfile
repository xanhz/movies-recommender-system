FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir --upgrade -r requirements.txt
ENV MAX_WORKERS 1
ENV GRACEFUL_TIMEOUT 20
