# Rebuild and run the demo app with new colors

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Rebuilding RHUDS Pro with new HUD palette..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Clean previous builds
Write-Host "1. Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "packages/core/dist") {
    Remove-Item -Recurse -Force "packages/core/dist"
    Write-Host "   Cleaned core/dist" -ForegroundColor Green
}
if (Test-Path "packages/components/dist") {
    Remove-Item -Recurse -Force "packages/components/dist"
    Write-Host "   Cleaned components/dist" -ForegroundColor Green
}
if (Test-Path "packages/demo-app/dist") {
    Remove-Item -Recurse -Force "packages/demo-app/dist"
    Write-Host "   Cleaned demo-app/dist" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. Building packages..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Build complete! Now run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your new HUD palette colors:" -ForegroundColor Cyan
Write-Host "  Primary:    #29F2DF (Cyan)" -ForegroundColor Cyan
Write-Host "  Secondary:  #1C7FA6 (Blue)" -ForegroundColor Blue
Write-Host "  Background: #0A1225 (Dark Blue)" -ForegroundColor DarkBlue
Write-Host "  Surface:    #28125A (Purple)" -ForegroundColor Magenta
Write-Host "  Accent:     #EF3EF1 (Pink)" -ForegroundColor Magenta
