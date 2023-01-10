# syntax=docker/dockerfile:1

FROM python:3.9.13

WORKDIR /app

ADD . /app

RUN pip install -r requirements.txt

# COPY . .

EXPOSE 5000

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "5000"]