@echo off
setlocal

:: Настройки
set REMOTE_USER=root
set REMOTE_HOST=176.119.147.19
set REMOTE_PROJECT_PATH=/home/project
set LOCAL_PROJECT_PATH=C:/Users/vladi/Desktop/prod/project

:: Шаг 1: Удаление старой папки проекта на удалённой машине
echo Удаление старой папки проекта на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "rm -rf %REMOTE_PROJECT_PATH%"

if %ERRORLEVEL% neq 0 (
    echo Ошибка при удалении папки на сервере.
    exit /b 1
)

:: Шаг 2: Создание новой папки проекта на удалённой машине
echo Создание новой папки проекта на удалённой машине...
ssh %REMOTE_USER%@%REMOTE_HOST% "mkdir -p %REMOTE_PROJECT_PATH%"

if %ERRORLEVEL% neq 0 (
    echo Ошибка при создании папки на сервере.
    exit /b 1
)

:: Шаг 3: Копирование скрытых файлов вручную
echo Копирование скрытых файлов проекта на удалённый сервер...
scp %LOCAL_PROJECT_PATH%\.env %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PROJECT_PATH%
scp %LOCAL_PROJECT_PATH%\.gitignore %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PROJECT_PATH%

if %ERRORLEVEL% neq 0 (
    echo Ошибка при копировании скрытых файлов.
    exit /b 1
)

:: Шаг 4: Копирование содержимого проекта с локальной машины на удалённый сервер через SCP
echo Копирование содержимого папки проекта на удалённый сервер...
scp -r %LOCAL_PROJECT_PATH%\* %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PROJECT_PATH%

if %ERRORLEVEL% neq 0 (
    echo Ошибка при копировании проекта.
    exit /b 1
)

echo Проект успешно обновлён!
endlocal