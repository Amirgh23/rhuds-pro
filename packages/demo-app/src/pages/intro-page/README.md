# Intro Page Components

This directory contains all components for the RHUDS intro page redesign with Arwes-style animations and sci-fi aesthetics.

## Directory Structure

```
intro-page/
├── types.ts                 # TypeScript interfaces for all components
├── constants.ts             # Animation timings, colors, breakpoints
├── README.md               # This file
└── __tests__/
    ├── setup.ts            # Test configuration and mocks
    ├── test-utils.ts       # Testing utilities and helpers
    └── intro-page.test.ts   # Main test file
```

## Components

### IntroPage

Root component orchestrating page layout, animations, and responsive behavior.

**Props:**

- `onNavigate?: (route: string) => void` - Navigation callback
- `animationEnabled?: boolean` - Enable/disable animations
- `theme?: 'dark' | 'light'` - Theme selection

### HeroSection

Primary content area with animated frame, title, subtitle, and CTA buttons.

**Props:**

- `title: string` - Main title
- `subtitle: string` - Subtitle text
- `description?: string` - Optional description
- `frameType?: 'kranox' | 'nefrex'` - Frame component type
- `onCTAClick?: (action: 'primary' | 'secondary') => void` - CTA callback
- `animationDelay?: number` - Animation delay in ms

### FeatureCard

Individual card displaying feature with frame and content.

**Props:**

- `title: string` - Feature title
- `description: string` - Feature description
- `icon?: React.ReactNode` - Optional icon
- `frameType?: 'octagon' | 'corners'` - Frame type
- `animationDelay?: number` - Animation delay in ms
- `onHover?: () => void` - Hover callback

### FeatureCardsGrid

Responsive grid container managing card layout and staggered animations.

**Props:**

- `features: FeatureCardData[]` - Array of feature data
- `columns?: 'auto' | 1 | 2 | 3` - Column count
- `animationDelay?: number` - Initial animation delay
- `staggerInterval?: number` - Delay between card animations

### AnimatedBackground

Dynamic particle or grid-based background with continuous animation.

**Props:**

- `type?: 'particles' | 'grid' | 'hybrid'` - Background type
- `opacity?: number` - Opacity (0.1-0.3)
- `color?: string` - Color value
- `particleCount?: number` - Number of particles
- `animationSpeed?: number` - Animation speed (0.5-2.0)

### Navigation

Top navigation bar with links to other sections.

**Props:**

- `links?: NavLink[]` - Navigation links
- `onNavigate?: (route: string) => void` - Navigation callback

## Constants

### Animation Configuration

- `heroDelay: 200ms` - Delay before hero animation
- `heroDuration: 1500ms` - Hero animation duration
- `cardsStartDelay: 1700ms` - Delay before cards animate
- `cardStaggerInterval: 150ms` - Delay between card animations
- `totalDuration: 3000ms` - Total sequence duration

### Color Palette

- Primary: Cyan `rgba(41, 242, 223, 1)`
- Secondary: Magenta `rgba(239, 62, 241, 1)`
- Background: Black `#000000`

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: >= 1024px

## Testing

### Test Utilities

The `__tests__/test-utils.ts` file provides helpers for:

- Animation testing
- Responsive design testing
- Accessibility testing
- Color contrast checking
- Keyboard navigation testing

### Running Tests

```bash
npm run test -- intro-page
```

### Property-Based Tests

Property-based tests validate universal correctness properties across all inputs using fast-check.

## Styling

All components use:

- Monospace fonts throughout
- Cyan and magenta color scheme
- CSS drop-shadow for glow effects
- GPU-accelerated animations (transform, opacity)
- Mobile-first responsive design

## Accessibility

All components include:

- Semantic HTML structure
- Keyboard navigation support
- Focus indicators
- WCAG AA color contrast compliance
- Skip-to-content link
- Decorative SVG aria-hidden attributes

## Performance

- Initial content renders within 1000ms
- Animations maintain 60fps frame rate
- GPU-accelerated CSS properties only
- Lazy-loading for below-fold content
- RequestAnimationFrame for smooth animations
