# syntax=docker/dockerfile:1
FROM python:3.12
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /src
COPY requirements.txt /src/
RUN apt update
RUN apt install -y npm
RUN pip install --no-deps -r requirements.txt
COPY . /src/
