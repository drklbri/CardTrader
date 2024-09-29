@echo off
setlocal

:: Шаг 1: Запуск dockerdown.bat
echo Запуск dockerdown.bat...
call dockerdown.bat

if %ERRORLEVEL% neq 0 (
    echo Ошибка при выполнении dockerdown.bat.
)

:: Шаг 2: Запуск projectupd.bat
echo Запуск projectupd.bat...
call projectupd.bat

if %ERRORLEVEL% neq 0 (
    echo Ошибка при выполнении projectupd.bat.
)

:: Шаг 3: Запуск dockerup.bat
echo Запуск dockerup.bat...
call dockerup.bat

if %ERRORLEVEL% neq 0 (
    echo Ошибка при выполнении dockerup.bat.
)

echo Все скрипты успешно выполнены!
endlocal
