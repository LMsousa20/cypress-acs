@echo off
setlocal enabledelayedexpansion
title Master Init - Cypress-ACS Suite
color 0A

echo ===================================================
echo   MASTER INIT: CONFIGURACAO E EXECUCAO CYPRESS
echo ===================================================
echo.

:: 1. VERIFICAR NODE.JS
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Node.js nao encontrado. Instalando...
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    echo [!] Node.js instalado. Por favor, reinicie este script para atualizar o PATH.
    pause
    exit
) else (
    echo [OK] Node.js detectado.
)

:: 2. VERIFICAR GIT
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Git nao encontrado. Instalando...
    winget install Git.Git --silent --accept-package-agreements --accept-source-agreements
    echo [!] Git instalado. Por favor, reinicie este script para atualizar o PATH.
    pause
    exit
) else (
    echo [OK] Git detectado.
)

:: Adiciona caminhos ao PATH caso tenham acabado de ser instalados
set PATH=%PATH%;C:\Program Files\nodejs\;C:\Program Files\Git\bin

:: 3. VERIFICAR SE ESTA NO PROJETO OU SE PRECISA BAIXAR
if exist .git (
    echo [INFO] Projeto detectado. Verificando atualizacoes no servidor...
    git fetch origin
    
    :: Verifica se estamos atras do servidor pelo status do git
    git status -uno | find /I "behind" >nul
    if %errorlevel% equ 0 (
        echo [AVISO] O projeto local esta desatualizado.
        echo [INFO] Baixando atualizacoes do projeto...
        git pull origin main
        if %errorlevel% neq 0 (
            echo [ERRO] Falha ao atualizar o projeto. Verifique sua conexao ou conflitos.
            pause
        ) else (
            echo [OK] Projeto atualizado com sucesso!
        )
    ) else (
        echo [OK] O projeto ja esta na versao mais recente.
    )
    timeout /t 2 >nul
) else (
    echo [AVISO] O projeto Cypress-ACS nao foi encontrado nesta pasta.
    echo.
    set /p clone_opt="Deseja baixar (clonar) o projeto aqui agora? (S/N): "
    if /i "!clone_opt!"=="S" (
        echo [INFO] Baixando o projeto do GitHub...
        git clone https://github.com/LMsousa20/cypress-acs.git
        if %errorlevel% neq 0 (
            echo [ERRO] Falha ao baixar o projeto. Verifique sua internet.
            pause
            exit
        )
        echo [OK] Projeto baixado com sucesso!
        echo Entrando na pasta do projeto...
        cd cypress-acs
        timeout /t 2 >nul
    ) else (
        echo [INFO] Operacao cancelada. Fechando...
        pause
        exit
    )
)

echo.
echo ===================================================
echo   CONFIGURACAO DE AMBIENTE
echo ===================================================

:: 4. CONFIGURAR .ENV
if not exist .env (
    if exist .env.example (
        echo [INFO] Criando arquivo .env a partir do modelo...
        copy .env.example .env >nul
        echo [!] IMPORTANTE: O Bloco de Notas abrira agora. Preencha seus dados e SALVE.
        timeout /t 2 >nul
        notepad .env
        echo.
        echo [?] Pressione qualquer tecla APOS salvar e fechar o arquivo .env...
        pause >nul
    ) else (
        echo [ERRO] Arquivo .env.example nao encontrado! Nao foi possivel criar o .env.
    )
) else (
    echo [OK] Arquivo .env detectado.
    timeout /t 2 >nul
)

:: 5. INSTALAR DEPENDENCIAS
if not exist node_modules (
    echo [INFO] Instalando dependencias (npm install)... Isso pode levar alguns minutos...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias. Verifique sua conexao.
        pause
        exit
    )
    echo [OK] Dependencias instaladas com sucesso!
    timeout /t 2 >nul
) else (
    :: Opcional: Verificar se o package.json mudou e rodar npm install? 
    :: Por simplicidade, assumimos que se node_modules existe, esta ok.
    echo [OK] Dependencias ja instaladas.
    timeout /t 2 >nul
)

:MENU
cls
echo ===================================================
echo   MENU DE EXECUCAO - CYPRESS-ACS
echo ===================================================
echo   Reporsitorio: LMsousa20/cypress-acs
echo ===================================================
echo 1. Abrir Cypress (Modo Visual - Interface)
echo 2. Rodar TESTES HEADLESS (Chrome - Rapido)
echo 3. Rodar apenas RECEBIMENTOS
echo 4. Gerar RELATORIO COMPLETO (HTML)
echo 5. Limpar Historico (Reports/Screenshots)
echo 6. Listar todos os Scripts (NTL)
echo 7. Sair
echo ===================================================
set /p opt="Escolha uma opcao (1-7): "

if "%opt%"=="1" goto OPEN
if "%opt%"=="2" goto RUN_ALL
if "%opt%"=="3" goto RUN_REC
if "%opt%"=="4" goto REPORT
if "%opt%"=="5" goto CLEAN
if "%opt%"=="6" goto NTL
if "%opt%"=="7" goto EXIT
echo Opcao invalida!
pause
goto MENU

:OPEN
echo Abrindo interface do Cypress...
call npm run cypress:open
goto MENU

:RUN_ALL
echo Rodando todos os testes em modo headless...
call npm run cypress:headless
echo.
echo Execucao finalizada.
pause
goto MENU

:RUN_REC
echo Rodando testes de Recebimentos...
call npm run cypress:recebimentos
pause
goto MENU

:REPORT
echo Consolidando relatorios e gerando HTML...
call npm run report:full
if exist cypress\reports\report.html (
    echo [OK] Relatorio gerado com sucesso.
    start cypress\reports\report.html
) else (
    echo [ERRO] Relatorio nao encontrado em cypress/reports/
)
pause
goto MENU

:CLEAN
echo Limpando pastas temporarias...
if exist cypress\reports del /q cypress\reports\*.*
if exist cypress\screenshots del /q cypress\screenshots\*.*
if exist cypress\videos del /q cypress\videos\*.*
echo [OK] Pastas limpas.
pause
goto MENU

:NTL
echo Executando NTL (Use as setas e ENTER para escolher um script)...
call npx ntl
pause
goto MENU

:EXIT
echo Ate logo!
timeout /t 2 >nul
exit