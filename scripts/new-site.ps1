# new-site.ps1 - Bootstrap a new site by copying this repo's tracked files
#
# Usage:
#   .\scripts\new-site.ps1 -Name "client-name"
#
# Note: this exports git HEAD (via `git archive`), not your working tree -
# commit any changes you want carried over before running this.

param(
    [Parameter(Mandatory = $true)]
    [string]$Name
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$targetDir = Join-Path (Split-Path -Parent $repoRoot) $Name

$titleCaseName = (Get-Culture).TextInfo.ToTitleCase($Name.Replace("-", " ").Replace("_", " "))
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Write-Host ""
Write-Host "Creating new site: $Name" -ForegroundColor Cyan
Write-Host "Source: $repoRoot (git HEAD)"
Write-Host "Target: $targetDir"
Write-Host ""

if (Test-Path $targetDir) {
    Write-Host "Directory already exists: $targetDir" -ForegroundColor Red
    Write-Host "Delete it first or choose a different name."
    exit 1
}

New-Item -ItemType Directory -Path $targetDir | Out-Null

Write-Host "Exporting tracked files from git HEAD..." -ForegroundColor Yellow
Push-Location $repoRoot
try {
    git archive HEAD | tar -x -C $targetDir
} finally {
    Pop-Location
}

# Package-specific / this-repo-specific files that shouldn't carry over
$filesToRemove = @("CHANGELOG.md", "package-lock.json")
foreach ($rel in $filesToRemove) {
    $fp = Join-Path $targetDir $rel
    if (Test-Path $fp) { Remove-Item -Path $fp -Force }
}

Write-Host "Applying site placeholders..." -ForegroundColor Yellow

$filesToUpdate = @(
    "package.json",
    ".env.example",
    "docker-compose.yml",
    ".gitignore",
    "src\payload.config.ts",
    "src\lib\backup\utils.ts",
    "src\app\(site)\page.tsx",
    "src\_site-specific\components\admin\DashboardHero.tsx",
    "src\app\(payload)\components\admin\AtomicAdminIcon.tsx"
)

foreach ($rel in $filesToUpdate) {
    $fp = Join-Path $targetDir $rel
    if (Test-Path $fp) {
        $content = Get-Content -Path $fp -Raw
        $content = $content -replace "atomic-cms", $Name
        $content = $content -replace "Atomic CMS", $titleCaseName
        [System.IO.File]::WriteAllText($fp, $content, $utf8NoBom)
    }
}

Write-Host ""
Write-Host "Done! New site created at: $targetDir" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd `"$targetDir`""
Write-Host "  2. git init && git add -A && git commit -m `"Initial commit`""
Write-Host "  3. Push to a new GitHub repo (build-and-push.yml deploys from it)"
Write-Host "  4. npm install --legacy-peer-deps"
Write-Host "  5. Copy .env.example to .env and fill in your values"
Write-Host "  6. npm run generate:types"
Write-Host "  7. npm run generate:importmap"
Write-Host "  8. npm run dev"
Write-Host ""
Write-Host "Customize before going live:" -ForegroundColor Cyan
Write-Host "  - src/app/(payload)/components/admin/AtomicAdminIcon.tsx and AtomicAdminLogo.tsx (admin branding)"
Write-Host "  - src/_site-specific/ (site-specific collections, blocks, dashboard)"
Write-Host "  - tailwind.config.ts, src/styles (site design)"
Write-Host ""
Write-Host "See DEPLOY.md for the full deployment flow." -ForegroundColor Cyan
Write-Host ""
