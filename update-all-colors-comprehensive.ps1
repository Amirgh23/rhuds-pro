# Comprehensive color replacement script for HUD palette

Write-Host "Starting comprehensive color palette update..." -ForegroundColor Cyan

# Complete color mapping - ALL colors to HUD palette
$colorMap = @{
    # Primary colors already done
    '#00f6ff' = '#DE41F2'
    '#00ffff' = '#342373'
    '#1BFD9C' = '#DE41F2'
    '#00ff00' = '#DE41F2'
    '#00cc00' = '#47038C'
    '#ffff00' = '#DE41F2'
    
    # Additional bright colors to HUD palette
    '#FF6B9D' = '#DE41F2'  # Pink -> Primary
    '#FFD700' = '#DE41F2'  # Gold -> Primary
    '#FF4500' = '#400E29'  # OrangeRed -> Error
    '#9D00FF' = '#47038C'  # Purple -> Secondary
    '#FF00FF' = '#DE41F2'  # Magenta -> Primary
    '#00CED1' = '#342373'  # DarkTurquoise -> Surface
    '#FF1493' = '#DE41F2'  # DeepPink -> Primary
    '#7FFF00' = '#47038C'  # Chartreuse -> Secondary
    '#FF69B4' = '#DE41F2'  # HotPink -> Primary
    '#00BFFF' = '#342373'  # DeepSkyBlue -> Surface
    '#FF6347' = '#400E29'  # Tomato -> Error
    '#32CD32' = '#47038C'  # LimeGreen -> Secondary
    '#BA55D3' = '#47038C'  # MediumOrchid -> Secondary
    '#FFA500' = '#DE41F2'  # Orange -> Primary
    '#DE6262' = '#400E29'  # Red -> Error
    '#7b61ff' = '#47038C'  # Purple -> Secondary
    
    # RGBA patterns
    'rgba\(0, 246, 255' = 'rgba(222, 65, 242'
    'rgba\(0, 255, 255' = 'rgba(52, 35, 115'
    'rgba\(27, 253, 156' = 'rgba(222, 65, 242'
    'rgba\(0, 255, 0' = 'rgba(222, 65, 242'
}

# Target all TypeScript/TSX files in demo and components
$targetFiles = Get-ChildItem -Path "packages" -Recurse -Include "*.tsx","*.ts" | 
    Where-Object { 
        $_.FullName -like "*demo-app*" -or 
        $_.FullName -like "*__tests__*" -or
        $_.FullName -like "*ComponentsDemo*" -or
        $_.FullName -like "*FramesDemo*"
    }

$totalReplacements = 0
$filesModified = 0

foreach ($file in $targetFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($oldColor in $colorMap.Keys) {
        $newColor = $colorMap[$oldColor]
        $matches = [regex]::Matches($content, $oldColor, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        
        if ($matches.Count -gt 0) {
            $content = $content -replace $oldColor, $newColor
            $fileReplacements += $matches.Count
        }
    }
    
    if ($fileReplacements -gt 0) {
        try {
            Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $filesModified++
            $totalReplacements += $fileReplacements
            Write-Host "  Updated: $($file.Name) - $fileReplacements replacements" -ForegroundColor Green
        } catch {
            Write-Host "  Skipped (in use): $($file.Name)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nCompleted!" -ForegroundColor Green
Write-Host "Files modified: $filesModified" -ForegroundColor Cyan
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Cyan
Write-Host "All colors now use HUD palette!" -ForegroundColor Magenta
