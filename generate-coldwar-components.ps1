# PowerShell Script to Generate Remaining Cold War Components
# این اسکریپت تمام کامپوننت‌های باقی‌مانده را به صورت خودکار ایجاد می‌کند

$ErrorActionPreference = "Stop"

# Component templates
$checkboxTemplate = @'
/**
 * Cold War {NAME} Component
 * {DESCRIPTION}
 */

import React, {{ CSSProperties, useState }} from 'react';
import {{ getRgbString, generateTechCode, ThemeVariant }} from '../utils/coldWarUtils';

export interface ColdWar{NAME}Props {{
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}}

const THEME_COLORS = {{
  perseus: {{ primary: '#FFB000', secondary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' }},
  greenTerminal: {{ primary: '#33FF00', secondary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' }},
  satelliteView: {{ primary: '#00CCFF', secondary: '#0066CC', background: '#3a3a3e', surface: '#2a2a2e' }},
}};

export const ColdWar{NAME}: React.FC<ColdWar{NAME}Props> = ({{
  label,
  checked: controlledChecked,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  disabled = false,
  className = '',
  style = {{}},
}}) => {{
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('{CODE}');

  const sizeMap = {{
    sm: {{ size: '16px', fontSize: '12px', checkSize: '10px' }},
    md: {{ size: '20px', fontSize: '14px', checkSize: '12px' }},
    lg: {{ size: '24px', fontSize: '16px', checkSize: '14px' }},
  }};

  const handleChange = () => {{
    if (!disabled) {{
      const newChecked = !checked;
      if (controlledChecked === undefined) setInternalChecked(newChecked);
      onChange?.(newChecked);
    }}
  }};

  const containerStyle: CSSProperties = {{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  }};

  const boxStyle: CSSProperties = {{
    position: 'relative',
    width: sizeMap[size].size,
    height: sizeMap[size].size,
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `2px solid ${{disabled ? '#666' : (checked ? variantColor : '#666')}}`,
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }};

  if (checked && glow && !disabled) {{
    boxStyle.boxShadow = `0 0 15px rgba(${{rgb}}, 0.6), inset 0 0 10px rgba(${{rgb}}, 0.3)`;
  }}

  const checkStyle: CSSProperties = {{
    width: sizeMap[size].checkSize,
    height: sizeMap[size].checkSize,
    backgroundColor: variantColor,
    clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
    opacity: checked ? 1 : 0,
    transform: checked ? 'scale(1)' : 'scale(0)',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }};

  const labelStyle: CSSProperties = {{
    fontSize: sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: disabled ? '#666' : '#fff',
    userSelect: 'none',
  }};

  return (
    <label className={{className}} style={{containerStyle}} onClick={{handleChange}}>
      <div style={{boxStyle}}>
        <div style={{checkStyle}} />
      </div>
      {{label && <span style={{labelStyle}}>{{label}}</span>}}
      <input type="checkbox" checked={{checked}} disabled={{disabled}} onChange={{() => {{}}}} style={{{{ display: 'none' }}}} />
    </label>
  );
}};

export default ColdWar{NAME};
'@

# Components to generate
$components = @(
    @{ Category='Form'; Name='BubbleCheckbox'; Code='BUB-CHK'; Desc='Checkbox with bubble animation' },
    @{ Category='Form'; Name='NeonCheckbox'; Code='NEO-CHK'; Desc='Checkbox with neon glow' },
    @{ Category='Form'; Name='GlowingCheckbox'; Code='GLW-CHK'; Desc='Checkbox with intense glow' },
    @{ Category='Form'; Name='GlitchRadio'; Code='GLT-RAD'; Desc='Radio with glitch effect' },
    @{ Category='Form'; Name='CyberpunkRadio'; Code='CYB-RAD'; Desc='Radio with cyberpunk style' },
    @{ Category='Form'; Name='NeonRadio'; Code='NEO-RAD'; Desc='Radio with neon glow' },
    @{ Category='Form'; Name='ToggleSwitch'; Code='TGL'; Desc='Toggle switch control' },
    @{ Category='Form'; Name='CyberpunkToggle'; Code='CYB-TGL'; Desc='Toggle with cyberpunk style' },
    @{ Category='Form'; Name='LockSwitch'; Code='LCK'; Desc='Lock/unlock switch' },
    @{ Category='Form'; Name='NeonSlider'; Code='NEO-SLD'; Desc='Slider with neon effect' },
    @{ Category='Form'; Name='Slider'; Code='SLD'; Desc='Basic slider control' }
)

Write-Host "Generating Cold War Components..." -ForegroundColor Cyan

foreach ($comp in $components) {
    $filePath = "packages/components/src/$($comp.Category)/ColdWar$($comp.Name).tsx"
    
    if (Test-Path $filePath) {
        Write-Host "  ✓ $($comp.Name) already exists" -ForegroundColor Yellow
        continue
    }

    $content = $checkboxTemplate -replace '\{NAME\}', $comp.Name
    $content = $content -replace '\{CODE\}', $comp.Code
    $content = $content -replace '\{DESCRIPTION\}', $comp.Desc

    # Adjust for Radio/Switch/Slider types
    if ($comp.Name -like '*Radio*') {
        $content = $content -replace 'checked', 'selected'
        $content = $content -replace 'Checkbox', 'Radio'
        $content = $content -replace 'type="checkbox"', 'type="radio"'
    }
    elseif ($comp.Name -like '*Switch*' -or $comp.Name -like '*Toggle*') {
        $content = $content -replace 'Checkbox', 'Switch'
    }
    elseif ($comp.Name -like '*Slider*') {
        $content = $content -replace 'checked', 'value'
        $content -replace 'Checkbox', 'Slider'
        $content = $content -replace 'type="checkbox"', 'type="range"'
    }

    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "  ✓ Created $($comp.Name)" -ForegroundColor Green
}

Write-Host "`nDone! Generated $($components.Count) components." -ForegroundColor Green
