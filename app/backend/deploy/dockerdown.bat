@echo off
setlocal

:: Настройки
set REMOTE_USER=root
set REMOTE_HOST=176.119.147.19

:: Шаг 1: Остановка контейнеров
echo Остановка контейнеров project-web-1 и nginx_proxy на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "docker stop project-web-1 nginx_proxy"

:: Шаг 2: Удаление контейнеров
echo Удаление контейнеров project-web-1 и nginx_proxy на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "docker rm project-web-1 nginx_proxy"

:: Шаг 3: Удаление образа приложения
echo Удаление образа приложения на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "docker image prune -a -f"

:: Шаг 4: Удаление образа nginx:latest
echo Удаление образа nginx:latest на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "docker rmi nginx:latest"

echo Операция завершена!
endlocal