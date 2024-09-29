#!/bin/sh

# Получаем IP-адрес хост-машины
HOST_IP=$(ip route | awk 'NR==1 {print $3}')

# Задаем домен с использованием IP хоста
export SITE_DOMAIN="${HOST_IP}:8000"

# Логируем для отладки
echo "Using SITE_DOMAIN: $SITE_DOMAIN"

# Выполняем команду, переданную в контейнер
exec "$@"
