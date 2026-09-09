@echo off
cd /d "%~dp0"
title Essence Life - servidor
echo Iniciando o Essence Life...
start "Essence Life - servidor" cmd /k npm run dev
timeout /t 5 /nobreak >nul
start "" http://localhost:5173
