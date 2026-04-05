# Archive old documentation files
# Keep only essential docs in root

$keepFiles = @(
    'README.md',
    'START_HERE.md',
    'CONTRIBUTING.md',
    'INSTALLATION_GUIDE.md',
    'PROJECT_CLEANUP_PLAN.md'
)

$archiveDirs = @{
    'charts' = @('CHART*', 'CHARTS*', 'CHARTJS*', 'LINE_CHARTS*', 'BAR_CHARTS*', 'ADVANCED_LINE*', 'LEGEND*', 'SCALES*', 'TOOLTIP*', 'OTHER_CHARTS*')
    'coldwar' = @('COLDWAR*', 'COLD_WAR*', 'CINEMATIC*', 'GLASS_HUD*')
    'phases' = @('PHASE_*')
    'bubble' = @('BUBBLE*')
    'other' = @()
}

# Create archive directories
foreach ($dir in $archiveDirs.Keys) {
    $path = "docs/archive/$dir"
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created: $path"
    }
}

# Move files to archive
Get-ChildItem -Path . -MaxDepth 1 -Filter "*.md" -File | ForEach-Object {
    $fileName = $_.Name
    
    # Skip files to keep
    if ($keepFiles -contains $fileName) {
        Write-Host "Keeping: $fileName"
        return
    }
    
    # Determine destination
    $destination = $null
    foreach ($category in $archiveDirs.Keys) {
        $patterns = $archiveDirs[$category]
        foreach ($pattern in $patterns) {
            if ($fileName -like $pattern) {
                $destination = "docs/archive/$category/$fileName"
                break
            }
        }
        if ($destination) { break }
    }
    
    # Default to 'other' if no match
    if (-not $destination) {
        $destination = "docs/archive/other/$fileName"
    }
    
    # Move file
    Move-Item -Path $_.FullName -Destination $destination -Force
    Write-Host "Archived: $fileName -> $destination"
}

Write-Host "Documentation archival complete!"
