@echo off
REM ============================================
REM SCRIPT DE ATUALIZACAO AUTOMATICA - WINDOWS
REM Fitness Tracker - GitHub Pages
REM ============================================

echo ======================================
echo    ATUALIZACAO - FITNESS TRACKER
echo ======================================
echo.

REM Verificar se git esta instalado
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    echo Instale em: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Solicitar informacoes
set /p GITHUB_USER="Digite seu usuario do GitHub: "
set /p REPO_NAME="Digite o nome do repositorio: "

REM Clonar repositorio (se nao existir)
if not exist "%REPO_NAME%" (
    echo.
    echo Clonando repositorio...
    git clone "https://github.com/%GITHUB_USER%/%REPO_NAME%.git"
    cd "%REPO_NAME%"
) else (
    echo.
    echo Repositorio ja existe localmente
    cd "%REPO_NAME%"
    git pull origin main
)

REM Verificar arquivo
echo.
echo Copie o novo arquivo index.html para esta pasta
pause

if not exist "index.html" (
    echo [ERRO] Arquivo index.html nao encontrado!
    pause
    exit /b 1
)

REM Commit e Push
echo.
echo Enviando atualizacoes...
git add index.html
git commit -m "Update: %date% %time%"
git push origin main

echo.
echo ======================================
echo Atualizacao concluida com sucesso!
echo.
echo Seu site sera atualizado em 1-2 minutos
echo Acesse: https://%GITHUB_USER%.github.io/%REPO_NAME%/
echo ======================================
pause
