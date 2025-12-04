@echo off
echo Iniciando Alyloca...
cd /d "C:\Users\eduar\Documents\AutoGo_Project -Cp"
call venv\Scripts\activate

REM ---- Abre o navegador automaticamente ----
start "" http://localhost:8000/

REM ---- Inicia o servidor FastAPI ----
uvicorn main:app --reload
pause
