FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir --default-timeout=120 --retries 5 -r requirements.txt

COPY app /app/app

EXPOSE 9000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9000"]
