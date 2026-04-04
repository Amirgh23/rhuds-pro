# Verification Script for Charts Overflow Fix
# This script verifies that all overflow fixes have been properly applied

Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  Charts Overflow Fix - Verification Script" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

$filePath = "packages/demo-app/src/pages/ChartsShowcase.tsx"
$content = Get-Content $filePath -Raw

Write-Host "Checking ChartsShowcase.tsx..." -ForegroundColor Yellow
Write-Host ""

# Check 1: X-axis labels should use +10 offset
Write-Host "[1] Checking X-axis label offsets..." -ForegroundColor White
$oldOffset = ($content | Select-String -Pattern "height - padding \+ 15\)" -AllMatches).Matches.Count
$newOffset = ($content | Select-String -Pattern "height - padding \+ 10\)" -AllMatches).Matches.Count

if ($oldOffset -eq 0 -and $newOffset -gt 0) {
    Write-Host "    PASS: All X-axis labels use correct offset (+10)" -ForegroundColor Green
    Write-Host "       Found $newOffset instances of correct offset" -ForegroundColor Gray
} else {
    Write-Host "    FAIL: Found $oldOffset instances of old offset (+15)" -ForegroundColor Red
    Write-Host "       Expected: 0, Found: $oldOffset" -ForegroundColor Gray
}
Write-Host ""

# Check 2: Legend positions should use width - 140
Write-Host "[2] Checking legend positions..." -ForegroundColor White
$oldLegend = ($content | Select-String -Pattern "width - 160," -AllMatches).Matches.Count
$newLegend = ($content | Select-String -Pattern "width - 140," -AllMatches).Matches.Count

if ($oldLegend -eq 0 -and $newLegend -gt 0) {
    Write-Host "    PASS: All legends use correct position (width - 140)" -ForegroundColor Green
    Write-Host "       Found $newLegend instances of correct position" -ForegroundColor Gray
} else {
    Write-Host "    FAIL: Found $oldLegend instances of old position (width - 160)" -ForegroundColor Red
    Write-Host "       Expected: 0, Found: $oldLegend" -ForegroundColor Gray
}
Write-Host ""

# Check 3: No excessive padding values
Write-Host "[3] Checking for excessive padding values..." -ForegroundColor White
$excessivePadding = ($content | Select-String -Pattern "const padding = (80|70|65)" -AllMatches).Matches.Count

if ($excessivePadding -eq 0) {
    Write-Host "    PASS: No excessive padding values found" -ForegroundColor Green
} else {
    Write-Host "    FAIL: Found $excessivePadding instances of excessive padding" -ForegroundColor Red
}
Write-Host ""

# Check 4: CSS overflow handling
Write-Host "[4] Checking CSS overflow handling..." -ForegroundColor White
$cssPath = "packages/demo-app/src/pages/ChartsShowcase.css"
$cssContent = Get-Content $cssPath -Raw

$hasOverflowHidden = $cssContent -match "overflow:\s*hidden"
$hasMaxWidth = $cssContent -match "max-width:\s*100%"
$hasMaxHeight = $cssContent -match "max-height:\s*100%"

if ($hasOverflowHidden -and $hasMaxWidth -and $hasMaxHeight) {
    Write-Host "    PASS: CSS overflow handling is properly configured" -ForegroundColor Green
    Write-Host "       - overflow: hidden OK" -ForegroundColor Gray
    Write-Host "       - max-width: 100% OK" -ForegroundColor Gray
    Write-Host "       - max-height: 100% OK" -ForegroundColor Gray
} else {
    Write-Host "    FAIL: CSS overflow handling is incomplete" -ForegroundColor Red
    if (-not $hasOverflowHidden) { Write-Host "       - Missing: overflow: hidden" -ForegroundColor Gray }
    if (-not $hasMaxWidth) { Write-Host "       - Missing: max-width: 100%" -ForegroundColor Gray }
    if (-not $hasMaxHeight) { Write-Host "       - Missing: max-height: 100%" -ForegroundColor Gray }
}
Write-Host ""

# Summary
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  Verification Summary" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

$allPassed = ($oldOffset -eq 0) -and ($newOffset -gt 0) -and ($oldLegend -eq 0) -and ($newLegend -gt 0) -and ($excessivePadding -eq 0) -and $hasOverflowHidden -and $hasMaxWidth -and $hasMaxHeight

if ($allPassed) {
    Write-Host "ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The overflow fixes have been successfully applied." -ForegroundColor White
    Write-Host "All charts should now display properly within their boundaries." -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
    Write-Host "  2. Hard refresh the page (Ctrl+F5)" -ForegroundColor White
    Write-Host "  3. Or restart the dev server" -ForegroundColor White
} else {
    Write-Host "SOME CHECKS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the failed checks above and reapply the fixes." -ForegroundColor White
}

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
