FROM nginx:1.24

COPY src/ /usr/share/nginx/html/

RUN mkdir -p /var/www/certbot