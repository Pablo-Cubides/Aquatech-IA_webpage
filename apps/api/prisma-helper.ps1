# Prisma Helper Script
# Este script establece las variables de entorno correctamente y ejecuta comandos de Prisma

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

# Establecer variables de entorno
$env:DATABASE_URL = "postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL = "postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Ejecutar comando de Prisma
Write-Host "Ejecutando: pnpm prisma $Command" -ForegroundColor Green
Invoke-Expression "pnpm prisma $Command"
