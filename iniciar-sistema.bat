@echo off

echo INICIO %date% %time% >> debug.txt

cd /d "C:\Users\FRANCO JULIAN DIAZ\sistema.tickets\sistema-tickets"

echo carpeta OK >> debug.txt

start "" "C:\Program Files\nodejs\node.exe" app.js

echo FIN >> debug.txt