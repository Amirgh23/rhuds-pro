# Script to fix theme.currentMode.tokens references in all component files

$files = @(
    "packages/components/src/Specialized/DatePicker.tsx",
    "packages/components/src/Specialized/ColorPicker.tsx",
    "packages/components/src/Specialized/FileUpload.tsx",
    "packages/components/src/Form/Input.tsx",
    "packages/components/src/Form/Select.tsx",
    "packages/components/src/Form/Checkbox.tsx",
    "packages/components/src/Form/RadioGroup.tsx",
    "packages/components/src/Form/Switch.tsx",
    "packages/components/src/Layout/Container.tsx",
    "packages/components/src/Layout/Grid.tsx",
    "packages/components/src/Layout/Stack.tsx",
    "packages/components/src/Navigation/Navbar.tsx",
    "packages/components/src/Navigation/Sidebar.tsx",
    "packages/components/src/Navigation/Breadcrumb.tsx",
    "packages/components/src/Navigation/Menu.tsx",
    "packages/components/src/Navigation/Pagination.tsx",
    "packages/components/src/DataDisplay/Table.tsx",
    "packages/components/src/DataDisplay/DataGrid.tsx",
    "packages/components/src/DataDisplay/Tree.tsx",
    "packages/components/src/Advanced/Accordion.tsx",
    "packages/components/src/Advanced/Stepper.tsx",
    "packages/components/src/Advanced/Carousel.tsx",
    "packages/components/src/Advanced/CodeEditor.tsx",
    "packages/components/src/Advanced/RichTextEditor.tsx",
    "packages/components/src/Visualization/Chart.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Read content
        $content = Get-Content $file -Raw
        
        # Add import if not exists
        if ($content -notmatch "import.*getThemeTokens.*from.*utils/themeHelpers") {
            $content = $content -replace "(import.*from '@rhuds/core';)", "`$1`nimport { getThemeTokens, DEFAULT_COLORS } from '../utils/themeHelpers';"
        }
        
        # Replace theme.currentMode.tokens.colors.X with getThemeTokens(theme).colors?.X || DEFAULT_COLORS.X
        $content = $content -replace "theme\.currentMode\.tokens\.colors\.(\w+)", "getThemeTokens(theme).colors?.`$1 || DEFAULT_COLORS.`$1"
        
        # Replace theme.currentMode.tokens with getThemeTokens(theme)
        $content = $content -replace "theme\.currentMode\.tokens", "getThemeTokens(theme)"
        
        # Write back
        Set-Content $file $content -NoNewline
        
        Write-Host "Fixed $file"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! All files processed." -ForegroundColor Green
