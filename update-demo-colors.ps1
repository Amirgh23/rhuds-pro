# Script to update all demo files to use only 3 specific colors
# Colors: rgba(41, 242, 223, 1), rgba(239, 62, 241, 1), rgba(28, 127, 166, 1)

$PRIMARY_CYAN = "rgba(41, 242, 223, 1)"
$PRIMARY_MAGENTA = "rgba(239, 62, 241, 1)"
$PRIMARY_BLUE = "rgba(28, 127, 166, 1)"

# Find all demo files
$demoFiles = @(
    "packages/frames/src/__tests__/FramesDemo.tsx",
    "packages/frames/src/__tests__/ArwesFramesDemo.tsx",
    "packages/components/src/__tests__/HudButtonDemo.tsx",
    "packages/components/src/__tests__/GlitchButtonDemo.tsx",
    "packages/components/src/__tests__/FormDemo.tsx",
    "packages/components/src/__tests__/FeedbackDemo.tsx",
    "packages/components/src/__tests__/DataDisplayDemo.tsx",
    "packages/components/src/__tests__/ComponentsDemo.tsx",
    "packages/components/src/__tests__/AdvancedDemo.tsx",
    "packages/components/src/__tests__/UtilityDemo.tsx",
    "packages/components/src/__tests__/NavigationDemo.tsx",
    "packages/core/src/audio/__tests__/AudioDemo.tsx",
    "packages/core/src/animation/__tests__/AnimatorDemo.tsx",
    "packages/core/src/animation/__tests__/AdvancedDemo.tsx",
    "packages/backgrounds/src/__tests__/BackgroundsDemo.tsx",
    "packages/frames/demo.html",
    "packages/components/src/Form/glitch-login-demo.html",
    "packages/components/src/Layout/glitch-frame-demo.html",
    "packages/components/src/DataDisplay/pipboy-test.html",
    "packages/components/src/Loader/test-heartrate.html"
)

$filesUpdated = 0
$totalReplacements = 0

foreach ($file in $demoFiles) {
    if (Test-Path $file) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        $content = Get-Content $file -Raw
        $originalContent = $content
        $fileReplacements = 0
        
        # Replace cyan/turquoise colors
        $content = $content -replace 'rgba\(0,\s*255,\s*255,\s*[\d.]+\)', $PRIMARY_CYAN
        $content = $content -replace 'rgba\(0,\s*240,\s*255,\s*[\d.]+\)', $PRIMARY_CYAN
        $content = $content -replace 'rgba\(64,\s*224,\s*208,\s*[\d.]+\)', $PRIMARY_CYAN
        $content = $content -replace '#00ffff', $PRIMARY_CYAN
        $content = $content -replace '#00f0ff', $PRIMARY_CYAN
        
        # Replace magenta/pink colors
        $content = $content -replace 'rgba\(255,\s*0,\s*255,\s*[\d.]+\)', $PRIMARY_MAGENTA
        $content = $content -replace 'rgba\(255,\s*20,\s*147,\s*[\d.]+\)', $PRIMARY_MAGENTA
        $content = $content -replace 'rgba\(255,\s*105,\s*180,\s*[\d.]+\)', $PRIMARY_MAGENTA
        $content = $content -replace '#ff00ff', $PRIMARY_MAGENTA
        $content = $content -replace '#ff1493', $PRIMARY_MAGENTA
        
        # Replace blue colors
        $content = $content -replace 'rgba\(0,\s*0,\s*255,\s*[\d.]+\)', $PRIMARY_BLUE
        $content = $content -replace 'rgba\(30,\s*144,\s*255,\s*[\d.]+\)', $PRIMARY_BLUE
        $content = $content -replace 'rgba\(0,\s*191,\s*255,\s*[\d.]+\)', $PRIMARY_BLUE
        $content = $content -replace '#0000ff', $PRIMARY_BLUE
        $content = $content -replace '#1e90ff', $PRIMARY_BLUE
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            $filesUpdated++
            Write-Host "  Updated successfully" -ForegroundColor Green
        } else {
            Write-Host "  No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Files updated: $filesUpdated" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
