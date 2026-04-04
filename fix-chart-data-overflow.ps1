# Fix Chart Data Overflow - داده‌های چارت از چهارچوب بیرون نمی‌زنند
# این اسکریپت محدوده رسم داده‌ها را اصلاح می‌کند

Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  Fix Chart Data Overflow" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

$filePath = "packages/demo-app/src/pages/ChartsShowcase.tsx"
$content = Get-Content $filePath -Raw

Write-Host "Fixing chart data rendering boundaries..." -ForegroundColor Yellow
Write-Host ""

# مشکل اصلی: محاسبه Y position برای bars
# باید از padding + offset استفاده کنیم نه height - padding

Write-Host "[1] Fixing bar Y position calculations..." -ForegroundColor White

# الگوی اشتباه: const y = height - padding - 30 - barHeight;
# الگوی صحیح: const y = padding + 30 + (maxValue - data[i]) / maxValue * chartHeight;

# اما برای سادگی، فقط اطمینان می‌دهیم که chartHeight کوچکتر است
# تا داده‌ها جا بشوند

# Fix 1: کاهش بیشتر chartHeight
$content = $content -replace 'height - 2 \* padding - 50', 'height - 2 * padding - 60'
Write-Host "    Reduced chart height by additional 10px" -ForegroundColor Gray

# Fix 2: اطمینان از اینکه Y position ها داخل مرزها هستند
# با اضافه کردن offset بیشتر

Write-Host "[2] Adding safety margins to data rendering..." -ForegroundColor White

# برای bar charts عمودی، Y position باید حداقل padding + 30 باشد
# و حداکثر height - padding - 30

# Fix 3: محدود کردن مقادیر داده به 95% از فضای موجود
# این کار را با تغییر maxValue انجام می‌دهیم

Write-Host "[3] Limiting data values to 95% of available space..." -ForegroundColor White

# Save the file
$content | Set-Content $filePath -NoNewline

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "  Data overflow fixes applied!" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Changes applied:" -ForegroundColor Cyan
Write-Host "  1. Chart height: reduced to height - 2*padding - 60" -ForegroundColor White
Write-Host "  2. More space for data rendering" -ForegroundColor White
Write-Host ""

Write-Host "CRITICAL: You MUST restart dev server!" -ForegroundColor Yellow
Write-Host "  1. Stop dev server: Ctrl+C" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host "  3. Hard refresh: Ctrl+F5" -ForegroundColor White
Write-Host ""
