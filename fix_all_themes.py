#!/usr/bin/env python3
"""
Fix all theme.currentMode.tokens references in component files
"""

import os
import re
from pathlib import Path

# Helper function to add import if not exists
def add_import_if_needed(content):
    if 'getThemeTokens' in content or 'DEFAULT_COLORS' in content:
        return content  # Already has the import
    
    # Find the last import from @rhuds/core
    pattern = r"(import.*from '@rhuds/core';)"
    match = re.search(pattern, content)
    
    if match:
        import_line = match.group(1)
        new_import = f"{import_line}\nimport {{ getThemeTokens, DEFAULT_COLORS }} from '../utils/themeHelpers';"
        content = content.replace(import_line, new_import)
    
    return content

# Replace theme.currentMode.tokens references
def fix_theme_references(content):
    # Replace theme.currentMode.tokens.colors.X
    content = re.sub(
        r'theme\.currentMode\.tokens\.colors\.(\w+)',
        r'(getThemeTokens(theme).colors?.\1 || DEFAULT_COLORS.\1)',
        content
    )
    
    # Replace remaining theme.currentMode.tokens
    content = re.sub(
        r'theme\.currentMode\.tokens',
        r'getThemeTokens(theme)',
        content
    )
    
    return content

# Process a single file
def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if no theme.currentMode.tokens found
        if 'theme.currentMode.tokens' not in content:
            return False
        
        print(f"Processing {filepath}...")
        
        # Add import
        content = add_import_if_needed(content)
        
        # Fix references
        content = fix_theme_references(content)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Fixed {filepath}")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

# Main
def main():
    base_path = Path('packages/components/src')
    
    # Find all .tsx files
    tsx_files = list(base_path.rglob('*.tsx'))
    
    fixed_count = 0
    for filepath in tsx_files:
        if process_file(filepath):
            fixed_count += 1
    
    print(f"\n✓ Done! Fixed {fixed_count} files.")

if __name__ == '__main__':
    main()
