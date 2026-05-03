@echo off
REM Запуск бекенду та фронтенду в Windows

echo Запуск бекенду...
start cmd /k "cd backend && npm run dev"

echo Запуск фронтенду...
start cmd /k "npm run dev"

echo Обидва сервери мають запуститися в новых вікнах
pause
