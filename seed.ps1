$response = Invoke-WebRequest -Uri 'http://localhost:5001/api/seed-data' -Method POST -ContentType 'application/json' -UseBasicParsing
Write-Host $response.Content
