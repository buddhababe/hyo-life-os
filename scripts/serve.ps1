param(
  [int]$Port = 5183
)

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Serving Hyo Life OS at http://127.0.0.1:$Port/"
py -3 -m http.server $Port --bind 127.0.0.1 --directory .
