import { ThemeMode, ThemeTokens } from './types'

export function createTheme(
  name: string,
  baseMode: ThemeMode,
  overrides?: Partial<ThemeTokens>
): ThemeMode {
  if (!name || name.length === 0) {
    throw new Error('Theme name must be non-empty string')
  }

  if (!baseMode || !baseMode.tokens) {
    throw new Error('Base mode must be valid ThemeMode object')
  }

  // Deep merge tokens
  const mergedTokens = deepMerge(baseMode.tokens, overrides || {})

  // Validate all required tokens are present
  if (!allRequiredTokensPresent(mergedTokens)) {
    throw new Error('All required tokens must be present in theme')
  }

  return {
    name: name as ThemeMode['name'],
    tokens: mergedTokens,
  }
}

function deepMerge(target: any, source: any): any {
  const result = JSON.parse(JSON.stringify(target))
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }
  }
  return result
}

function allRequiredTokensPresent(tokens: any): boolean {
  const required = ['colors', 'spacing', 'typography', 'shadows', 'transitions', 'breakpoints']
  return required.every((key) => key in tokens && tokens[key] !== null)
}
