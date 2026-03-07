# PowerShell script to update ALL component colors to new HUD palette
# New HUD Palette:
# #29F2DF - Cyan (Primary) - replaces #DE41F2
# #1C7FA6 - Blue (Secondary) - replaces #342373
# #0A1225 - Dark blue (Background) - replaces #130226
# #28125A - Dark purple (Surface) - replaces #47038C
# #EF3EF1 - Bright pink (Accent) - replaces #400E29

$files = Get-ChildItem -Path "packages" -Include "*.tsx","*.ts" -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "\.test\." -and
    $_.FullName -notmatch "dist"
}

$totalFiles = 0
$updatedFiles = 0

foreach ($file in $files) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace old purple palette with new HUD palette
    $content = $content -replace '#DE41F2', '#29F2DF'
    $content = $content -replace '#342373', '#1C7FA6'
    $content = $content -replace '#47038C', '#28125A'
    $content = $content -replace '#400E29', '#EF3EF1'
    $content = $content -replace '#130226', '#0A1225'
    
    # Also replace rgba versions
    $content = $content -replace 'rgba\(222,\s*65,\s*242', 'rgba(41, 242, 223'
    $content = $content -replace 'rgba\(51,\s*35,\s*115', 'rgba(28, 127, 166'
    $content = $content -replace 'rgba\(71,\s*3,\s*140', 'rgba(40, 18, 90'
    $content = $content -replace 'rgba\(64,\s*14,\s*41', 'rgba(239, 62, 241'
    $content = $content -replace 'rgba\(19,\s*2,\s*38', 'rgba(10, 18, 37'
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
        $updatedFiles++
    }
}

Write-Host ""
Write-Host "========================================="
Write-Host "Color palette update complete!"
Write-Host "Total files scanned: $totalFiles"
Write-Host "Files updated: $updatedFiles"
Write-Host "========================================="
Write-Host ""
Write-Host "New HUD Palette:"
Write-Host "  #29F2DF - Cyan (Primary)"
Write-Host "  #1C7FA6 - Blue (Secondary)"
Write-Host "  #0A1225 - Dark blue (Background)"
Write-Host "  #28125A - Dark purple (Surface)"
Write-Host "  #EF3EF1 - Bright pink (Accent)"
