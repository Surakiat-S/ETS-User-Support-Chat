@echo off
echo Starting ETS Prototype Demo...
start "Backend API" cmd /k "cd src\BackendAPI && dotnet run"
start "Admin Web" cmd /k "cd src\AdminWeb && npm run dev"
start "Client App" cmd /k "cd src\ClientApp && dotnet run"