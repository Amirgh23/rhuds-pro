# Apply New HUD Color Palette
# Cyan/Teal based palette with better readability

Write-Host "Applying NEW HUD Color Palette..." -ForegroundColor Cyan

# New color mapping - OLD to NEW
$colorMap = @{
    # Previous purple palette to new cyan/teal palette
    '#DE41F2' = '#29F2DF'  # Primary: Purple -> Cyan
    '#47038C' = '#1C7FA6'  # Secondary: Purple -> Blue
    '#130226' = '#0A1225'  # Background: Dark purple -> Dark blue
    '#342373' = '#28125A'  # Surface: Purple -> Dark purple
    '#400E29' = '#EF3EF1'  # Error/Accent: Dark red -> Bright pink
    
    # RGBA versions
    'rgba\(222, 65, 242' = 'rgba(41, 242, 223'
    'rgba\(71, 3, 140' = 'rgba(28, 127, 166'
    'rgba\(19, 2, 38' = 'rgba(10, 18, 37'
    'rgba\(52, 35, 115' = 'rgba(40, 18, 90'
    'rgba\(64, 14, 41' = 'rgba(239, 62, 241'
}

# Target all relevant files
$paths = @(
    "packages/core/src/theme/*.ts",
    "packages/demo-app/src/**/*.{tsx,ts,css}",
    "packages/components/src/**/*.tsx",
    "packages/frames/src/**/*.tsx",
    "packages/backgrounds/src/**/*.tsx"
)

$totalFiles = 0
$totalReplacements = 0

foreach ($pattern in $paths) {
    $files = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue
    
    foreach ($file in $files) {
        if ($file.FullName -like "*node_modules*") { continue }
        
        $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if (-not $content) { continue }
        
        $changed = $false
        $fileReplacements = 0
        
        foreach ($oldColor in $colorMap.Keys) {
            $newColor = $colorMap[$oldColor]
            $matches = [regex]::Matches($content, $oldColor, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            
            if ($matches.Count -gt 0) {
                $content = $content -replace $oldColor, $newColor
                $fileReplacements += $matches.Count
                $changed = $true
            }
        }
        
        if ($changed) {
            try {
                Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
                $totalFiles++
                $totalReplacements += $fileReplacements
                Write-Host "  Updated: $($file.Name) - $fileReplacements changes" -ForegroundColor Green
            } catch {
                Write-Host "  Skipped: $($file.Name)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "`n=== RESULTS ===" -ForegroundColor Cyan
Write-Host "Files updated: $totalFiles" -ForegroundColor Green
Write-Host "Total color replacements: $totalReplacements" -ForegroundColor Green
Write-Host "`nNew HUD Palette Applied:" -ForegroundColor Magenta
Write-Host "  Primary: #29F2DF (Cyan)" -ForegroundColor Cyan
Write-Host "  Secondary: #1C7FA6 (Blue)" -ForegroundColor Blue
Write-Host "  Background: #0A1225 (Dark Blue)" -ForegroundColor DarkBlue
Write-Host "  Surface: #28125A (Dark Purple)" -ForegroundColor DarkMagenta
Write-Host "  Accent: #EF3EF1 (Bright Pink)" -ForegroundColor Magenta
