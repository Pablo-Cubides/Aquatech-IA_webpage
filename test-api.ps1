# Test visor-prompts API
Write-Host "Testing /api/visor-prompts"  -ForegroundColor Cyan

$maxRetries = 3
$retry = 0

while ($retry -lt $maxRetries) {
    try {
        Write-Host "Attempt $($retry + 1)/$maxRetries..." 
        $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/visor-prompts" -TimeoutSec 10 -UseBasicParsing
        
        if ($resp.StatusCode -eq 200) {
            Write-Host "OK Status 200" -ForegroundColor Green
            $data = $resp.Content | ConvertFrom-Json
            Write-Host "Cases found: $($data.Count)" -ForegroundColor Green
            
            if ($data.Count -gt 0) {
                Write-Host "Cases:" -ForegroundColor Yellow
                $data | ForEach-Object { 
                    Write-Host " - [$($_.id)] $($_.title)" -ForegroundColor Cyan
                }
                Write-Host "API working!" -ForegroundColor Green
                exit 0
            }
        }
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $retry++
        if ($retry -lt $maxRetries) {
            Start-Sleep -Seconds 3
        }
    }
}

Write-Host "Could not connect to API" -ForegroundColor Red
exit 1

