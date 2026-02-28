import React from 'react'
import { ThemeContextValue } from './types'

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)
