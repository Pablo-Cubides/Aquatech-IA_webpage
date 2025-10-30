# Prisma Helper Script
# Este script establece las variables de entorno correctamente y ejecuta comandos de Prisma

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

# IMPORTANT: Load .env file first!
# The credentials should be in your .env file, NOT in this script
# This script now loads from .env file

# Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        Set-Item -Path "env:$key" -Value $value
    }
}

# Ejecutar comando de Prisma
Write-Host "Ejecutando: pnpm prisma $Command" -ForegroundColor Green
Invoke-Expression "pnpm prisma $Command"
