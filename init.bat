
@echo off
setlocal EnableDelayedExpansion

chcp 65001 >nul

title Master Init - Cypress-ACS Suite
color 0A

echo ===================================================
echo   MASTER INIT: CONFIGURACAO E EXECUCAO CYPRESS
echo ===================================================
echo.

:: ===================================================
:: 1. VERIFICAR NODE.JS
:: ===================================================
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Node.js nao encontrado. Instalando...

    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements

    echo.
    echo [IMPORTANTE] Reinicie este script apos a instalacao do Node.js.
    pause
    exit /b
) else (
    echo [OK] Node.js detectado.
)

:: ===================================================
:: 2. VERIFICAR GIT
:: ===================================================
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Git nao encontrado. Instalando...

    winget install Git.Git --silent --accept-package-agreements --accept-source-agreements

    echo.
    echo [IMPORTANTE] Reinicie este script apos a instalacao do Git.
    pause
    exit /b
) else (
    echo [OK] Git detectado.
)

:: Atualiza PATH temporariamente
set "PATH=%PATH%;C:\Program Files\nodejs\;C:\Program Files\Git\bin"

:: ===================================================
:: 3. CLONAR OU ATUALIZAR PROJETO
:: ===================================================
if exist ".git" (
    echo.
    echo [INFO] Projeto Git detectado.
    echo [INFO] Verificando atualizacoes...

    git fetch origin

    git status -uno | findstr /I "behind"

    if !errorlevel! equ 0 (
        echo.
        echo [INFO] Atualizando projeto...

        git pull origin main

        if !errorlevel! neq 0 (
            echo [ERRO] Falha ao atualizar o projeto.
            pause
        ) else (
            echo [OK] Projeto atualizado com sucesso.
        )
    ) else (
        echo [OK] Projeto ja esta atualizado.
    )

) else (
    echo.
    echo [AVISO] Projeto nao encontrado nesta pasta.
    echo.

    set /p clone_opt="Deseja clonar o projeto agora? (S/N): "

    if /I "!clone_opt!"=="S" (

        echo.
        echo [INFO] Clonando projeto...

        git clone https://github.com/LMsousa20/cypress-acs.git

        if !errorlevel! neq 0 (
            echo [ERRO] Falha ao clonar o projeto.
            pause
            exit /b
        )

        cd cypress-acs

        echo [OK] Projeto clonado com sucesso.

    ) else (
        echo Operacao cancelada.
        pause
        exit /b
    )
)

:: ===================================================
:: 4. CONFIGURAR .ENV
:: ===================================================
echo.
echo ===================================================
echo   CONFIGURACAO DE AMBIENTE
echo ===================================================
echo.

if not exist ".env" (

    if exist ".env.example" (

        echo [INFO] Criando arquivo .env...

        copy ".env.example" ".env" >nul

        echo.
        echo [IMPORTANTE] Configure o arquivo .env.

        timeout /t 2 >nul

        start notepad ".env"

        echo.
        echo Pressione qualquer tecla apos salvar o .env...
        pause >nul

    ) else (
        echo [ERRO] Arquivo .env.example nao encontrado.
    )

) else (
    echo [OK] Arquivo .env detectado.
)

:: ===================================================
:: 5. INSTALAR DEPENDENCIAS
:: ===================================================
echo.
echo [INFO] Verificando dependencias...

if not exist "node_modules" (

    echo [INFO] Instalando dependencias...
    echo Isso pode demorar alguns minutos.
    echo.

    call npm install

    if !errorlevel! neq 0 (
        echo.
        echo [ERRO] Falha ao instalar dependencias.
        pause
        exit /b
    )

    echo.
    echo [OK] Dependencias instaladas com sucesso.

) else (
    echo [OK] node_modules ja existe.
)

:: ===================================================
:: MENU
:: ===================================================
:MENU
cls

echo ===================================================
echo   MENU DE EXECUCAO - CYPRESS-ACS
echo ===================================================
echo.
echo 1. Abrir Cypress (Modo Visual)
echo 2. Rodar Testes Headless
echo 3. Rodar Recebimentos
echo 4. Gerar Relatorio HTML
echo 5. Limpar Historico
echo 6. Abrir NTL
echo 7. Sair

echo.
echo ===================================================
set /p opt="Escolha uma opcao (1-7): "

if "%opt%"=="1" goto OPEN
if "%opt%"=="2" goto RUN_ALL
if "%opt%"=="3" goto RUN_REC
if "%opt%"=="4" goto REPORT
if "%opt%"=="5" goto CLEAN
if "%opt%"=="6" goto NTL
if "%opt%"=="7" goto EXIT

echo.
echo Opcao invalida.
pause
goto MENU

:: ===================================================
:: ABRIR CYPRESS
:: ===================================================
:OPEN
cls

echo Abrindo Cypress...
call npm run cypress:open

pause
goto MENU

:: ===================================================
:: RODAR TODOS TESTES
:: ===================================================
:RUN_ALL
cls

echo Executando testes headless...
call npm run cypress:headless

echo.
echo Execucao finalizada.
pause
goto MENU

:: ===================================================
:: RODAR RECEBIMENTOS
:: ===================================================
:RUN_REC
cls

echo Executando recebimentos...
call npm run cypress:recebimentos

pause
goto MENU

:: ===================================================
:: GERAR RELATORIO
:: ===================================================
:REPORT
cls

echo Gerando relatorio...
call npm run report:full

if exist "cypress\reports\report.html" (
    echo.
    echo [OK] Relatorio gerado.
    start "" "cypress\reports\report.html"
) else (
    echo.
    echo [ERRO] Relatorio nao encontrado.
)

pause
goto MENU

:: ===================================================
:: LIMPEZA
:: ===================================================
:CLEAN
cls

echo Limpando arquivos temporarios...

if exist "cypress\reports" del /q "cypress\reports\*.*"
if exist "cypress\screenshots" del /q "cypress\screenshots\*.*"
if exist "cypress\videos" del /q "cypress\videos\*.*"

echo.
echo [OK] Limpeza concluida.

pause
goto MENU

:: ===================================================
:: NTL
:: ===================================================
:NTL
cls

echo Abrindo NTL...
call npx ntl

pause
goto MENU

:: ===================================================
:: SAIR
:: ===================================================
:EXIT

echo.
echo Ate logo!

timeout /t 2 >nul
exit /b