# Netlify Deployment Automation Script
# This script handles the complete deployment process

Write-Host "🚀 Starting Netlify Deployment Process..." -ForegroundColor Cyan

# Step 1: Install Storybook CLI
Write-Host "`n📦 Installing Storybook CLI..." -ForegroundColor Yellow
pnpm add -D "@storybook/cli@^7.0.0"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Storybook CLI" -ForegroundColor Red
    exit 1
}

# Step 2: Clean build artifacts
Write-Host "`n🧹 Cleaning previous builds..." -ForegroundColor Yellow
Remove-Item -Path "packages/demo-app/dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "packages/storybook/storybook-static" -Recurse -Force -ErrorAction SilentlyContinue

# Step 3: Run build
Write-Host "`n🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!" -ForegroundColor Green

# Step 4: Check if Netlify CLI is installed
Write-Host "`n🔍 Checking Netlify CLI..." -ForegroundColor Yellow
$netlifyInstalled = netlify --version 2>$null

if (-not $netlifyInstalled) {
    Write-Host "📥 Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Step 5: Deploy
Write-Host "`n🌐 Deploying to Netlify..." -ForegroundColor Yellow
Write-Host "Note: You'll be prompted to login if not already authenticated" -ForegroundColor Cyan

netlify deploy --prod --dir="packages/demo-app/dist"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "Your site is now live on Netlify" -ForegroundColor Green
} else {
    Write-Host "`n❌ Deployment failed" -ForegroundColor Red
    exit 1
}
