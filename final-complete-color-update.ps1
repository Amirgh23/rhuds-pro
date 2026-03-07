# Final Complete Color Update - All Components

Write-Host "=== FINAL COMPLETE COLOR UPDATE ===" -ForegroundColor Cyan
Write-Host "Updating ALL remaining colors to HUD palette..." -ForegroundColor Yellow

# Complete color mapping
$colorMap = @{
    '#00f6ff' = '#DE41F2'
    '#00ffff' = '#342373'
    '#00FFFF' = '#342373'
    '#1BFD9C' = '#DE41F2'
    '#00ff00' = '#DE41F2'
    '#00FF00' = '#DE41F2'
    '#00cc00' = '#47038C'
    '#ffff00' = '#DE41F2'
    '#7b61ff' = '#47038C'
    '#FF6B9D' = '#DE41F2'
    '#FFD700' = '#DE41F2'
    '#FF4500' = '#400E29'
    '#9D00FF' = '#47038C'
    '#FF00FF' = '#DE41F2'
    '#00CED1' = '#342373'
    '#FF1493' = '#DE41F2'
    '#7FFF00' = '#47038C'
    '#FF69B4' = '#DE41F2'
    '#00BFFF' = '#342373'
    '#FF6347' = '#400E29'
    '#32CD32' = '#47038C'
    '#BA55D3' = '#47038C'
    '#FFA500' = '#DE41F2'
    '#DE6262' = '#400E29'
    '#ff0000' = '#400E29'
}

# Get ALL component files
$files = Get-ChildItem -Path "packages/components/src" -Recurse -Include "*.tsx","*.ts" -Exclude "*node_modules*"

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($oldColor in $colorMap.Keys) {
        $newColor = $colorMap[$oldColor]
        $pattern = [regex]::Escape($oldColor)
        $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        
        if ($matches.Count -gt 0) {
            $content = [regex]::Replace($content, $pattern, $newColor, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            $fileReplacements += $matches.Count
        }
    }
    
    if ($fileReplacements -gt 0) {
        try {
            Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline -ErrorAction Stop
            $totalFiles++
            $totalReplacements += $fileReplacements
            $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
            Write-Host "  ✓ $relativePath - $fileReplacements changes" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠ Skipped (locked): $($file.Name)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== RESULTS ===" -ForegroundColor Cyan
Write-Host "Files updated: $totalFiles" -ForegroundColor Green
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Green
Write-Host "`n✅ All component colors updated to HUD palette!" -ForegroundColor Magenta
