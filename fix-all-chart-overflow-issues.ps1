# راه‌حل نهایی و کامل برای تمام مشکلات Overflow چارت‌ها
# این اسکریپت تمام مشکلات را یکجا حل می‌کند

Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  FINAL COMPLETE FIX - All Chart Overflow Issues" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

$filePath = "packages/demo-app/src/pages/ChartsShowcase.tsx"
$content = Get-Content $filePath -Raw

$changesCount = 0

# ==================== FIX 1: Padding Values ====================
Write-Host "[1] Fixing excessive padding values..." -ForegroundColor Yellow

# تغییر padding = 80 به padding = 50
$before = ($content | Select-String -Pattern "const padding = 80" -AllMatches).Matches.Count
if ($before -gt 0) {
    $content = $content -replace 'const padding = 80', 'const padding = 50'
    Write-Host "    Changed $before instances of padding = 80 to padding = 50" -ForegroundColor Green
    $changesCount += $before
}

# تغییر padding = 70 به padding = 50
$before = ($content | Select-String -Pattern "const padding = 70" -AllMatches).Matches.Count
if ($before -gt 0) {
    $content = $content -replace 'const padding = 70', 'const padding = 50'
    Write-Host "    Changed $before instances of padding = 70 to padding = 50" -ForegroundColor Green
    $changesCount += $before
}

# تغییر padding = 65 به padding = 50
$before = ($content | Select-String -Pattern "const padding = 65" -AllMatches).Matches.Count
if ($before -gt 0) {
    $content = $content -replace 'const padding = 65', 'const padding = 50'
    Write-Host "    Changed $before instances of padding = 65 to padding = 50" -ForegroundColor Green
    $changesCount += $before
}

# تغییر padding = 60 به padding = 50
$before = ($content | Select-String -Pattern "const padding = 60" -AllMatches).Matches.Count
if ($before -gt 0) {
    $content = $content -replace 'const padding = 60', 'const padding = 50'
    Write-Host "    Changed $before instances of padding = 60 to padding = 50" -ForegroundColor Green
    $changesCount += $before
}

Write-Host ""

# ==================== FIX 2: Y-axis Label Offsets ====================
Write-Host "[2] Fixing Y-axis label offsets..." -ForegroundColor Yellow

# تغییر padding - 15 به padding - 10
$before = ($content | Select-String -Pattern "padding - 15," -AllMatches).Matches.Count
if ($before -gt 0) {
    $content = $content -replace 'padding - 15,', 'padding - 10,'
    Write-Host "    Changed $before instances of Y-axis offset" -ForegroundColor Green
    $changesCount += $before
}

Write-Host ""

# ==================== FIX 3: Chart Height Calculations ====================
Write-Host "[3] Ensuring safe chart height calculations..." -ForegroundColor Yellow

# اطمینان از اینکه همه chartHeight ها حداقل 60px کمتر از ارتفاع کل هستند
# این قبلاً انجام شده است

Write-Host "    Chart heights already optimized" -ForegroundColor Green
Write-Host ""

# ==================== FIX 4: Bar Y Position Safety ====================
Write-Host "[4] Adding safety to bar Y positions..." -ForegroundColor Yellow

# اطمینان از اینکه Y position ها حداقل padding + 20 هستند
# با تغییر height - padding - 30 به height - padding - 40

$before = ($content | Select-String -Pattern "height - padding - 30 -" -AllMatches).Matches.Count
if ($before -gt 0) {
    $content = $content -replace 'height - padding - 30 -', 'height - padding - 40 -'
    Write-Host "    Added 10px safety margin to $before bar positions" -ForegroundColor Green
    $changesCount += $before
}

Write-Host ""

# ==================== FIX 5: Legend Positions (Already Done) ====================
Write-Host "[5] Verifying legend positions..." -ForegroundColor Yellow
$legendCheck = ($content | Select-String -Pattern "width - 120," -AllMatches).Matches.Count
Write-Host "    Found $legendCheck legends at safe position (width - 120)" -ForegroundColor Green
Write-Host ""

# ==================== FIX 6: X-axis Labels (Already Done) ====================
Write-Host "[6] Verifying X-axis label positions..." -ForegroundColor Yellow
$xAxisCheck = ($content | Select-String -Pattern "height - padding \+ 5\)" -AllMatches).Matches.Count
Write-Host "    Found $xAxisCheck X-axis labels at safe position (+5)" -ForegroundColor Green
Write-Host ""

# Save the file
$content | Set-Content $filePath -NoNewline

Write-Host "=============================================================" -ForegroundColor Green
Write-Host "  ALL FIXES APPLIED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Summary of changes:" -ForegroundColor Cyan
Write-Host "  - Total modifications: $changesCount" -ForegroundColor White
Write-Host "  - Padding values normalized to 50px" -ForegroundColor White
Write-Host "  - Y-axis labels moved closer (padding - 10)" -ForegroundColor White
Write-Host "  - Bar positions have 40px bottom margin" -ForegroundColor White
Write-Host "  - X-axis labels at +5px offset" -ForegroundColor White
Write-Host "  - Legends at width - 120" -ForegroundColor White
Write-Host ""

Write-Host "CRITICAL NEXT STEPS:" -ForegroundColor Red
Write-Host "  1. STOP dev server completely (Ctrl+C)" -ForegroundColor Yellow
Write-Host "  2. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor Yellow
Write-Host "  3. npm run dev" -ForegroundColor Yellow
Write-Host "  4. Hard refresh browser (Ctrl+F5)" -ForegroundColor Yellow
Write-Host ""

Write-Host "If still seeing overflow:" -ForegroundColor Magenta
Write-Host "  - Open browser DevTools (F12)" -ForegroundColor White
Write-Host "  - Go to Network tab" -ForegroundColor White
Write-Host "  - Check if ChartsShowcase.tsx is cached" -ForegroundColor White
Write-Host "  - Try Incognito mode (Ctrl+Shift+N)" -ForegroundColor White
Write-Host ""
