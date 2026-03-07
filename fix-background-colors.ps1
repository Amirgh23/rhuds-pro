# Fix background colors to use correct HUD palette
# Background should be: #0A1225 (rgba(10, 18, 37, 1))

$files = Get-ChildItem -Path "packages" -Include "*.tsx","*.ts" -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "dist" -and
    $_.FullName -notmatch "\.test\."
}

$totalFiles = 0
$updatedFiles = 0

foreach ($file in $files) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace wrong background colors with correct HUD background
    $content = $content -replace "background:\s*'#1a1a1a'", "background: '#0A1225'"
    $content = $content -replace 'background:\s*"#1a1a1a"', 'background: "#0A1225"'
    $content = $content -replace "background:\s*'#0a0a0a'", "background: '#0A1225'"
    $content = $content -replace 'background:\s*"#0a0a0a"', 'background: "#0A1225"'
    
    $content = $content -replace "backgroundColor:\s*'#1a1a1a'", "backgroundColor: '#0A1225'"
    $content = $content -replace 'backgroundColor:\s*"#1a1a1a"', 'backgroundColor: "#0A1225"'
    $content = $content -replace "backgroundColor:\s*'#0a0a0a'", "backgroundColor: '#0A1225'"
    $content = $content -replace 'backgroundColor:\s*"#0a0a0a"', 'backgroundColor: "#0A1225"'
    
    # Fix fallback colors in theme helpers
    $content = $content -replace "background:\s*'#1a1a1a',", "background: '#0A1225',"
    $content = $content -replace 'background:\s*"#1a1a1a",', 'background: "#0A1225",'
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
        $updatedFiles++
    }
}

Write-Host ""
Write-Host "========================================="
Write-Host "Background color fix complete!"
Write-Host "Total files scanned: $totalFiles"
Write-Host "Files updated: $updatedFiles"
Write-Host "========================================="
Write-Host ""
Write-Host "Correct background color: #0A1225 (rgba(10, 18, 37, 1))"
