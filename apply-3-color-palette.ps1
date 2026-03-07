# Apply 3-color palette to all demo files
# Colors: rgba(41, 242, 223, 1) - Cyan, rgba(239, 62, 241, 1) - Magenta, rgba(28, 127, 166, 1) - Blue

$CYAN = "rgba(41, 242, 223, 1)"
$MAGENTA = "rgba(239, 62, 241, 1)"
$BLUE = "rgba(28, 127, 166, 1)"

# Hex versions
$CYAN_HEX = "#29F2DF"
$MAGENTA_HEX = "#EF3EF1"
$BLUE_HEX = "#1C7FA6"

Write-Host "Applying 3-color palette to all demo files..." -ForegroundColor Cyan
Write-Host "Colors: $CYAN_HEX (Cyan), $MAGENTA_HEX (Magenta), $BLUE_HEX (Blue)" -ForegroundColor Yellow
Write-Host ""

$files = Get-ChildItem -Recurse -Include "*.tsx","*.html" -Path "packages" | Where-Object {
    $_.FullName -match "(__tests__|demo\.html|test-.*\.html|.*-demo\.html)"
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileChanges = 0
    
    # Replace cyan-like colors with CYAN
    $patterns = @(
        @{ Pattern = '#0ff\b'; Replacement = $CYAN_HEX; Name = '#0ff' }
        @{ Pattern = '#00ffff\b'; Replacement = $CYAN_HEX; Name = '#00ffff' }
        @{ Pattern = '#00f6ff\b'; Replacement = $CYAN_HEX; Name = '#00f6ff' }
        @{ Pattern = '#00f0ff\b'; Replacement = $CYAN_HEX; Name = '#00f0ff' }
        @{ Pattern = 'rgba\(0,\s*246,\s*255'; Replacement = 'rgba(41, 242, 223'; Name = 'rgba(0,246,255' }
        @{ Pattern = 'rgba\(0,\s*255,\s*255'; Replacement = 'rgba(41, 242, 223'; Name = 'rgba(0,255,255' }
        
        # Replace magenta/pink colors with MAGENTA
        @{ Pattern = '#f0f\b'; Replacement = $MAGENTA_HEX; Name = '#f0f' }
        @{ Pattern = '#ff00ff\b'; Replacement = $MAGENTA_HEX; Name = '#ff00ff' }
        @{ Pattern = '#ff1493\b'; Replacement = $MAGENTA_HEX; Name = '#ff1493' }
        @{ Pattern = 'rgba\(255,\s*0,\s*255'; Replacement = 'rgba(239, 62, 241'; Name = 'rgba(255,0,255' }
        
        # Replace yellow/orange colors with MAGENTA
        @{ Pattern = '#ff0\b'; Replacement = $MAGENTA_HEX; Name = '#ff0' }
        @{ Pattern = '#ffff00\b'; Replacement = $MAGENTA_HEX; Name = '#ffff00' }
        @{ Pattern = '#fa0\b'; Replacement = $MAGENTA_HEX; Name = '#fa0' }
        
        # Replace green colors with BLUE
        @{ Pattern = '#0f0\b'; Replacement = $BLUE_HEX; Name = '#0f0' }
        @{ Pattern = '#00ff00\b'; Replacement = $BLUE_HEX; Name = '#00ff00' }
        @{ Pattern = '#1BFD9C\b'; Replacement = $BLUE_HEX; Name = '#1BFD9C' }
        @{ Pattern = '#DE6262\b'; Replacement = $MAGENTA_HEX; Name = '#DE6262' }
        
        # Replace other blue shades with BLUE
        @{ Pattern = '#0af\b'; Replacement = $BLUE_HEX; Name = '#0af' }
        @{ Pattern = '#00aaff\b'; Replacement = $BLUE_HEX; Name = '#00aaff' }
        @{ Pattern = 'rgba\(0,\s*0,\s*255'; Replacement = 'rgba(28, 127, 166'; Name = 'rgba(0,0,255' }
    )
    
    foreach ($p in $patterns) {
        $matches = [regex]::Matches($content, $p.Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($matches.Count -gt 0) {
            $content = [regex]::Replace($content, $p.Pattern, $p.Replacement, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            $fileChanges += $matches.Count
            Write-Host "  $($file.Name): Replaced $($matches.Count)x $($p.Name)" -ForegroundColor Gray
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFiles++
        $totalReplacements += $fileChanges
        $fileName = $file.Name
        Write-Host "[OK] Updated: $fileName - $fileChanges changes" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor White
Write-Host "  Files updated: $totalFiles" -ForegroundColor Green
Write-Host "  Total replacements: $totalReplacements" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Color Palette Applied:" -ForegroundColor White
Write-Host "  Cyan: $CYAN_HEX" -ForegroundColor Cyan
Write-Host "  Magenta: $MAGENTA_HEX" -ForegroundColor Magenta
Write-Host "  Blue: $BLUE_HEX" -ForegroundColor Blue
