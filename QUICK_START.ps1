#!/usr/bin/env pwsh

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RHUDS - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

npm install

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Demo App..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The demo app will open at: http://localhost:5173" -ForegroundColor Green
Write-Host ""

Set-Location packages/demo-app
npm run dev

Read-Host "Press Enter to exit"
