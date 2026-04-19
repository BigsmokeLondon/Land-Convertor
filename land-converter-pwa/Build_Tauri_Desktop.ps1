# Build_Tauri_Desktop.ps1
# Syncs source from network drive to local C:\ then builds the Tauri desktop installer (.exe)
# Refined with GUI popups for Version input and Build confirmation.

$ErrorActionPreference = "Stop"

# --- CONFIGURATION ---
$SOURCE = "Z:\Data\Camwood Ondrive\OneDrive - Camwood Limited\Arena\AI\AntiGavity\land-converter-pwa"
$LOCAL = "C:\Users\Admin\Documents\land-converter-pwa"
$LOG = Join-Path $LOCAL "build_log.txt"

# --- HELPERS ---
Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms

function Get-VersionInput {
    $title = "SiteMaster Pro - Build Version"
    $msg = "Enter build version (e.g. 1.6.0):"
    $val = [Microsoft.VisualBasic.Interaction]::InputBox($msg, $title, "1.5.0")
    if ([string]::IsNullOrWhiteSpace($val)) {
        Write-Host "[ERROR] Version input cancelled or empty." -ForegroundColor Red
        exit 1
    }
    return $val
}

function Confirm-Build {
    $msg = "Files have been synced to local drive.`n`nDo you want to proceed with the full BUILD and COMPILE?`n(This will run npm and cargo/rust)"
    $title = "Proceed with Build?"
    $result = [System.Windows.Forms.MessageBox]::Show($msg, $title, [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question)
    return $result -eq [System.Windows.Forms.DialogResult]::Yes
}

# --- PROCESS START ---
Clear-Host
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  SITEMASTER PRO - DESKTOP BUILD SCRIPT" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$VERSION = Get-VersionInput
Write-Host "Target Version: $VERSION" -ForegroundColor Green

# 1. Create local dir if needed
if (-not (Test-Path $LOCAL)) {
    Write-Host "[1/6] Creating local build directory..."
    New-Item -ItemType Directory -Path $LOCAL | Out-Null
} else {
    Write-Host "[1/6] Local build directory exists. OK."
}

# 2. Sync from Source to Local
Write-Host "[2/6] Syncing source files from network drive..." -ForegroundColor Yellow
Write-Host "      (Robocopy: Skipping node_modules, dist, target)"

# Use direct invocation for better argument handling in PowerShell
$xdDirs = @("node_modules", "dist", ".git", ".github", "src-tauri\target")
$xfFiles = @("*.log", "build_log.txt")

& robocopy "$SOURCE" "$LOCAL" /E /XD $xdDirs /XF $xfFiles /NFL /NDL /NJH /NJS /MT:8

# Robocopy exit codes < 8 are successful syncs/no changes
if ($LASTEXITCODE -ge 8) {
    Write-Host "[ERROR] Robocopy failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}
Write-Host "Sync complete." -ForegroundColor Green

# --- THE CANCEL POINT ---
if (-not (Confirm-Build)) {
    Write-Host "`n[CANCELLED] User chose to exit after sync. No build performed." -ForegroundColor Yellow
    Pause
    exit 0
}

# 3. Patching
Write-Host "[3/6] Patching files to version $VERSION..." -ForegroundColor Cyan
Set-Location $LOCAL

# package.json
(Get-Content package.json) -replace '"version":\s*".*?"', "`"version`": `"$VERSION`"" | Set-Content package.json
# tauri.conf.json
(Get-Content src-tauri\tauri.conf.json) -replace '"version":\s*".*?"', "`"version`": `"$VERSION`"" | Set-Content src-tauri\tauri.conf.json
# AboutTab.tsx
(Get-Content src\components\AboutTab.tsx) -replace "const version = '.*?'", "const version = '$VERSION'" | Set-Content src\components\AboutTab.tsx

Write-Host "      Successfully patched project to v$VERSION."

# 4. NPM Install Check
Write-Host "[4/6] Checking npm packages..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules\@tauri-apps\cli")) {
    Write-Host "      @tauri-apps/cli not found. Running full install..."
    npm install
} else {
    Write-Host "      Packages already installed. Skipping install."
}

# 5. Build Web Assets
Write-Host "[5/6] Building Web assets (Vite)..." -ForegroundColor Cyan
# Redirect stderr to stdout (2>&1) to prevent PowerShell from crashing on warnings
npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Web build failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

# 6. Build Tauri Installer
Write-Host "[6/6] Building Tauri desktop app (Rust)..." -ForegroundColor Cyan
Write-Host "      This may take 5-15 minutes on the first run."
# Redirect stderr to stdout (2>&1) to prevent PowerShell from crashing on warnings
npm run tauri:build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Tauri build failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

# 7. Archive
Write-Host "Archiving iteration $VERSION..." -ForegroundColor Cyan
$BUNDLE = Join-Path $LOCAL "src-tauri\target\release\bundle"
$RELEASES = Join-Path $LOCAL "releases\v$VERSION"

if (-not (Test-Path $RELEASES)) { New-Item -ItemType Directory -Path $RELEASES | Out-Null }

if (Test-Path "$BUNDLE\nsis") {
    Copy-Item "$BUNDLE\nsis\*.exe" $RELEASES -Force
} elseif (Test-Path "$BUNDLE\msi") {
    Copy-Item "$BUNDLE\msi\*.msi" $RELEASES -Force
}

Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  BUILD COMPLETE (Version $VERSION)" -ForegroundColor Green
Write-Host "  Installer archived to: $RELEASES"
Write-Host "=====================================================" -ForegroundColor Green

Pause
