# RHUDS Pro - معماری پروژه

## نمای کلی

RHUDS Pro یک monorepo است که شامل یک سیستم طراحی HUD (Heads-Up Display) برای React است.

## ساختار Packages

```
packages/
├── core/              # Core utilities, theme, animation, audio
├── components/        # 100+ UI components
├── hooks/            # Custom React hooks
├── backgrounds/      # Background effects
├── frames/           # SVG frame components
├── charts/           # Chart system (ChartJS equivalent)
├── webgl/            # WebGL and 3D rendering
├── sfx/              # Sound effects engine
└── demo-app/         # Demo application
```

## وابستگی‌های بین Packages

```
demo-app
  ├── components
  ├── core
  ├── hooks
  ├── backgrounds
  ├── frames
  ├── charts
  └── webgl

components
  ├── core
  └── hooks

charts
  ├── core
  └── hooks

webgl
  ├── core
  └── hooks

backgrounds
  ├── core
  └── hooks

frames
  ├── core
  └── hooks
```

## مسئولیت‌های Package

### `@rhuds/core`

- Theme management و color utilities
- Animation system
- Audio system
- State management
- Utility functions

### `@rhuds/components`

- 100+ UI components
- Form components
- Layout components
- Data display components
- Navigation components
- Feedback components
- Advanced components

### `@rhuds/hooks`

- Custom React hooks
- Animation hooks
- State management hooks
- Utility hooks

### `@rhuds/backgrounds`

- Background effects
- Particle systems
- Grid patterns
- Cold War themed backgrounds

### `@rhuds/frames`

- SVG frame components
- Frame animations
- Path calculations

### `@rhuds/charts`

- Chart engine
- Chart types (bar, line, pie, etc.)
- Tooltips and legends
- Animations

### `@rhuds/webgl`

- 3D rendering
- WebGL utilities
- WebXR support
- Shader system

### `@rhuds/sfx`

- Sound effects engine
- Audio management

### `demo-app`

- Demo application
- Showcase pages
- Playground
- Documentation

## قوانین وابستگی

1. **No circular dependencies** - هیچ package نباید به package‌های وابسته به خود بستگی داشته باشد
2. **Unidirectional flow** - وابستگی‌ها فقط به سمت core و hooks هستند
3. **Minimal external deps** - استفاده از dependencies خارجی را کم کنید
4. **Workspace protocol** - از `workspace:*` برای وابستگی‌های داخلی استفاده کنید

## Build و Distribution

- **Build tool**: Vite
- **Package manager**: pnpm
- **Monorepo tool**: Turbo
- **Output**: ESM + CJS

## Testing Strategy

- **Unit tests**: Vitest
- **Integration tests**: Vitest
- **E2E tests**: Playwright (optional)
- **Property-based tests**: fast-check

## CI/CD Pipeline

- **Linting**: ESLint + Prettier
- **Type checking**: TypeScript
- **Testing**: Vitest
- **Build**: Turbo
- **Deployment**: GitHub Pages (demo-app)

## Performance Considerations

1. **Code splitting** - Components exported individually
2. **Tree shaking** - ESM format for better tree shaking
3. **Bundle size** - Monitor with `size-limit`
4. **Lazy loading** - Demo app uses code splitting

## Documentation

- **API docs**: Generated from JSDoc comments
- **Component docs**: In component files
- **Architecture docs**: This file
- **Contributing guide**: CONTRIBUTING.md
- **Installation guide**: INSTALLATION_GUIDE.md
