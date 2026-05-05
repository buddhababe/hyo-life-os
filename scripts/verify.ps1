$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$required = @(
  "index.html",
  "AGENTS.md",
  "manifest.json",
  "sw.js",
  "docs/HANDOFF.md",
  "docs/DECISIONS.md",
  "assets/icon.svg",
  "css/style.css",
  "js/data.js",
  "js/storage.js",
  "js/evolution.js",
  "js/crypto.js",
  "js/auth.js",
  "js/app.js",
  "scripts/deploy-github-pages.ps1",
  ".nojekyll",
  ".github/workflows/pages.yml"
)

Write-Host "Hyo Life OS verification"
Write-Host "Root: $root"

foreach ($file in $required) {
  $path = Join-Path $root $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required file: $file"
  }
}

$manifest = Get-Content -Encoding UTF8 (Join-Path $root "manifest.json") | ConvertFrom-Json
if ($manifest.name -notlike "Hyo Life OS*") {
  throw "Manifest name does not identify Hyo Life OS."
}

$sw = Get-Content -Encoding UTF8 (Join-Path $root "sw.js") -Raw
foreach ($asset in @("./js/auth.js", "./js/crypto.js", "./manifest.json")) {
  if ($sw -notlike "*$asset*") {
    throw "Service worker does not cache $asset"
  }
}

$index = Get-Content -Encoding UTF8 (Join-Path $root "index.html") -Raw
foreach ($marker in @("view-radar", "view-vision", "view-strategy", "view-today", "view-evolve", "settingsStatus", "deployChecklist", "goalEditor", "resourceList")) {
  if ($index -notlike "*$marker*") {
    throw "Life OS surface marker missing: $marker"
  }
}

function Join-Codepoints($codes) {
  -join ($codes | ForEach-Object { [char]$_ })
}

$sensitiveTerms = @(
  (Join-Codepoints @(0xAE30, 0xCD08, 0xC0DD, 0xD65C, 0xC218, 0xAE09, 0xC790)),
  (Join-Codepoints @(0xAE30, 0xCD08, 0xC218, 0xAE09, 0xC790)),
  (Join-Codepoints @(0xAE30, 0xCD08, 0xC218, 0xAE09)),
  (Join-Codepoints @(0xAE30, 0xCD08, 0xC0DD, 0xD65C)),
  (Join-Codepoints @(0xC0DD, 0xACC4, 0xAE09, 0xC5EC)),
  (Join-Codepoints @(0xC758, 0xB8CC, 0xAE09, 0xC5EC)),
  (Join-Codepoints @(0xCCAD, 0xB144, 0xC790, 0xD65C)),
  (Join-Codepoints @(0xAC15, 0xB0A8, 0xAD6C)),
  (Join-Codepoints @(0xC218, 0xAE09, 0xC790)),
  (Join-Codepoints @(0xC790, 0xD65C)),
  (Join-Codepoints @(0xACF5, 0xACF5, 0xC9C0, 0xC6D0))
)

$matches = Get-ChildItem -LiteralPath $root -Recurse -File |
  Where-Object { $_.FullName -notlike "*\.git\*" } |
  Select-String -Encoding UTF8 -SimpleMatch -Pattern $sensitiveTerms -ErrorAction SilentlyContinue

if ($matches) {
  $matches | ForEach-Object { Write-Host "$($_.Path):$($_.LineNumber): $($_.Line)" }
  throw "Sensitive public-support terms found in deployable files."
}

Write-Host "OK: required files present"
Write-Host "OK: manifest parses"
Write-Host "OK: service worker caches security modules"
Write-Host "OK: settings surface present"
Write-Host "OK: no sensitive public-support terms found"
