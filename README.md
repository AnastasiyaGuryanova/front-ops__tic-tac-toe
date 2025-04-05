# Развертывание приложения "Крестики-нолики"

Это простое фронтенд-приложение, развернутое с использованием практик FrontOps: контейнеризация, настройка HTTPS и автоматическое обновление сертификатов. Приложение представляет собой статическую веб-страницу, обслуживаемую через Nginx, контейнеризированную с помощью Docker Compose и защищённую SSL-сертификатом от Let's Encrypt.

## Структура проекта

tic-tac-toe/
├── docker-compose.yml # Конфигурация Docker Compose для сервисов
├── Dockerfile # Dockerfile для сборки образа Nginx
├── nginx/
│ ├── default.conf # Конфигурация Nginx с поддержкой HTTP и HTTPS
│ └── default-http-only.conf # Временная конфигурация для начальной настройки HTTP
├── src/
│ ├── index.html # Основная HTML-страница
│ ├── script.js # Логика на JavaScript (если используется)
│ └── styles.css # Стили CSS
├── certbot/
│ ├── data/ # Хранит сертификаты и данные Let's Encrypt
│ └── www/ # Директория для ACME-челленджей

## Описание FrontOps-подхода

Этот проект демонстрирует современные практики FrontOps для развертывания фронтенд-приложений:

- **Контейнеризация:**
  Использование Docker и Docker Compose для изоляции и управления зависимостями.

- **Безопасность:**
  Настройка HTTPS с использованием бесплатных SSL-сертификатов от Let's Encrypt.

- **Автоматизация:**
  Автоматическое обновление сертификатов через Certbot.

## 🚀 Установка и запуск

1. Склонируйте репозиторий:

   ```bash
   git clone git@github.com:AnastasiyaGuryanova/front-ops__tic-tac-toe.git

    cd tic-tac-toe

   ```

2. Первый этап: Получение сертификатов
   Для первоначального получения SSL-сертификатов используется временная конфигурация с Nginx только на порту 80.

- Создайте директории для Certbot

  ```bash
  	mkdir -p certbot/data certbot/www

  ```

- Обновите docker-compose.yml для первого этапа

  ```bash
  	services:
  		nginx:
  			build: .
  			ports:
  				- "80:80"
  			volumes:
  				- ./nginx/default-http-only.conf:/etc/nginx/conf.d/default.conf
  				- ./src:/usr/share/nginx/html
  				- ./certbot/data:/etc/letsencrypt
  				- ./certbot/www:/var/www/certbot

  		certbot-init:
  			image: certbot/certbot
  			volumes:
  				- ./certbot/www:/var/www/certbot
  				- ./certbot/data:/etc/letsencrypt
  			command: certonly --webroot --webroot-path=/var/www/certbot -d your-domain --email your-email --agree-tos --non-interactive
  			depends_on:
  				- nginx

  ```

- Запустите первый этап

  ```bash
  	docker compose up --build

  ```

- После успешного получения сертификатов (появится сообщение Successfully received certificate), остановите контейнеры:

  ```bash
  	docker compose down

  ```

3. Второй этап: Запуск с HTTPS
   После получения сертификатов настройте приложение для работы с HTTPS и автообновлением.

- Обновите docker-compose.yml

  ```bash
  	services:
  		nginx:
  			build: .
  			ports:
  				- "80:80"
  				- "443:443"
  			command: /bin/sh -c 'while :; do sleep 12h & wait $${!}; nginx -s reload; done & nginx -g "daemon off;"'
  			volumes:
  				- ./nginx/default.conf:/etc/nginx/conf.d/default.conf
  				- ./src:/usr/share/nginx/html
  				- ./certbot/data:/etc/letsencrypt
  				- ./certbot/www:/var/www/certbot

  		certbot-renew:
  			image: certbot/certbot
  			volumes:
  				- ./certbot/data:/etc/letsencrypt
  				- ./certbot/www:/var/www/certbot
  			entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --webroot --webroot-path=/var/www/certbot; sleep 12h & wait $${!}; done'"
  			depends_on:
  				- nginx

  ```

- Запустите приложение

  ```bash
  	docker compose up --build -d

  ```
