# Script to replace old colors with new HUD palette

Write-Host "Updating color palette..." -ForegroundColor Cyan

# Color mapping (old -> new)
$colorMap = @{
    '#00f6ff' = '#DE41F2'
    '#00ffff' = '#342373'
    '#1BFD9C' = '#DE41F2'
    '#00ff00' = '#DE41F2'
    '#00cc00' = '#47038C'
    '#ffff00' = '#DE41F2'
    'rgba\(0, 246, 255' = 'rgba(222, 65, 242'
    'rgba\(0, 255, 255' = 'rgba(52, 35, 115'
    'rgba\(27, 253, 156' = 'rgba(222, 65, 242'
    'rgba\(0, 255, 0' = 'rgba(222, 65, 242'
}

# Target files
$targetFiles = @(
    "packages/demo-app/src/pages/ShowcasePage.tsx",
    "packages/demo-app/src/pages/PlaygroundPage.tsx",
    "packages/demo-app/src/pages/DocsPage.tsx",
    "packages/demo-app/src/components/ComponentPlayground.tsx"
)

$totalReplacements = 0

foreach ($file in $targetFiles) {
    if (Test-Path $file) {
        Write-Host "`nProcessing: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        $fileReplacements = 0
        
        foreach ($oldColor in $colorMap.Keys) {
            $newColor = $colorMap[$oldColor]
            $matches = [regex]::Matches($content, $oldColor, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            
            if ($matches.Count -gt 0) {
                $content = $content -replace $oldColor, $newColor
                $fileReplacements += $matches.Count
                Write-Host "  Replaced $($matches.Count)x: $oldColor -> $newColor" -ForegroundColor Green
            }
        }
        
        if ($fileReplacements -gt 0) {
            Set-Content $file -Value $content -Encoding UTF8 -NoNewline
            $totalReplacements += $fileReplacements
            Write-Host "  Saved: $fileReplacements replacements" -ForegroundColor Cyan
        } else {
            Write-Host "  No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nCompleted! Total replacements: $totalReplacements" -ForegroundColor Green
Write-Host "New HUD color palette applied!" -ForegroundColor Magenta
