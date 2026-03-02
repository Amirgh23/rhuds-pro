#!/usr/bin/env pwsh
# RHUDS Pro Monorepo Setup Script

Write-Host "🚀 RHUDS Pro Monorepo Setup" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js >= 18.0.0" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Check pnpm
Write-Host "Checking pnpm..." -ForegroundColor Yellow
$pnpmVersion = pnpm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  pnpm is not installed. Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm@8
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install pnpm" -ForegroundColor Red
        exit 1
    }
    $pnpmVersion = pnpm --version
}
Write-Host "✅ pnpm version: $pnpmVersion" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Build packages
Write-Host ""
Write-Host "Building packages..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Build failed, but setup can continue" -ForegroundColor Yellow
} else {
    Write-Host "✅ Packages built successfully" -ForegroundColor Green
}

# Success message
Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  pnpm dev          - Run all packages in development mode" -ForegroundColor White
Write-Host "  pnpm build        - Build all packages" -ForegroundColor White
Write-Host "  pnpm test         - Run all tests" -ForegroundColor White
Write-Host "  pnpm lint         - Lint all packages" -ForegroundColor White
Write-Host "  pnpm demo         - Run demo application" -ForegroundColor White
Write-Host "  pnpm storybook    - Run Storybook" -ForegroundColor White
Write-Host ""
Write-Host "See MONOREPO_SETUP.md for more information" -ForegroundColor Cyan
