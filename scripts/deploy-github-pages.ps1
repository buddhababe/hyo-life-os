param(
  [string]$Owner = "buddhababe",
  [string]$Repo = "hyo-life-os",
  [switch]$Private
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

Set-Location $root

$repoFullName = "$Owner/$Repo"

Write-Host "Hyo Life OS GitHub Pages deploy"
Write-Host "Root: $root"
Write-Host "Repo: $repoFullName"

& powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "verify.ps1")

gh auth status | Out-Null

if (-not (Test-Path -LiteralPath ".git")) {
  git init -b main
}

git status --short

$existing = $true
try {
  gh repo view $repoFullName | Out-Null
} catch {
  $existing = $false
}

if (-not $existing) {
  $visibility = if ($Private) { "--private" } else { "--public" }
  gh repo create $repoFullName $visibility --source "." --remote origin --push
} else {
  $remote = git remote get-url origin 2>$null
  if (-not $remote) {
    git remote add origin "https://github.com/$repoFullName.git"
  }
  git push -u origin main
}

Write-Host ""
Write-Host "Push complete."
Write-Host "GitHub Actions Pages workflow should start automatically."
Write-Host "Repo: https://github.com/$repoFullName"
Write-Host "Expected Pages URL: https://$Owner.github.io/$Repo/"
