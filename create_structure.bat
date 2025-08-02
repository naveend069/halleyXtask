@echo off

REM Frontend folders
mkdir halleyx-frontend
cd halleyx-frontend
mkdir app components public styles
cd app
mkdir admin register login dashboard products orders chat
cd admin
mkdir login dashboard
cd ..\..\..

REM Backend folders
mkdir halleyx-backend
cd halleyx-backend
mkdir src prisma
cd src
mkdir auth user product order customer
cd ..\..

echo Folder structure created!
pause