@echo off
REM ============================================================
REM  Aula - Ingenieria Aeroespacial UNLP
REM  Levanta un servidor estatico local sobre la raiz del repo
REM  y abre la interfaz en el navegador.
REM  El servidor solo escucha en 127.0.0.1 (nada sale de la maquina).
REM ============================================================
setlocal
cd /d "%~dp0"

set PORT=8777
set PAGE=http://127.0.0.1:%PORT%/00%%20-%%20general/workspace/index.html

where python >nul 2>&1 && (set PY=python) || (
  where py >nul 2>&1 && (set PY=py) || (
    echo No encontre Python en el PATH.
    echo Instalalo desde https://www.python.org/downloads/ o abri la carpeta
    echo con "npx serve" si preferis Node.
    pause
    exit /b 1
  )
)

echo.
echo   Aula aeroespacial
echo   -----------------
echo   Servidor:  http://127.0.0.1:%PORT%/
echo   Interfaz:  %PAGE%
echo.
echo   Dejá esta ventana abierta mientras usás la interfaz.
echo   Ctrl+C para cortar el servidor.
echo.

start "" "%PAGE%"
%PY% -m http.server %PORT% --bind 127.0.0.1
endlocal
