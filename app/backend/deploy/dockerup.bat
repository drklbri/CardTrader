@echo off
setlocal

:: Настройки
set REMOTE_USER=root
set REMOTE_HOST=176.119.147.19
set REMOTE_PROJECT_PATH=/home/project

:: Шаг 1: Запуск Docker Compose на удалённой машине
echo Запуск Docker Compose на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "cd %REMOTE_PROJECT_PATH% && docker compose up -d"

if %ERRORLEVEL% neq 0 (
    echo Ошибка при запуске Docker Compose.
    exit /b 1
)

echo Docker Compose успешно запущен!
endlocal
