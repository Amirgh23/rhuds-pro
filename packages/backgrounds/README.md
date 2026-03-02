# @rhuds/backgrounds

Advanced animated background effects and particle systems for RHUDS Pro.

## Features

### Basic Effects
- **Dots** - Grid, random, and hexagonal dot patterns with animation
- **Puffs** - Particle effects with configurable movement
- **GridLines** - Static and dashed grid patterns
- **MovingLines** - Animated lines (horizontal, vertical, diagonal)

### Advanced Effects
- **Nebula** - Animated nebula effects with gradient blending
- **StarField** - Star field with parallax scrolling
- **AnimatedGradient** - Animated gradient backgrounds
- **Plasma** - Procedural plasma effects

### Particle System
- Full physics simulation (velocity, acceleration, gravity, friction)
- Particle emitters with configurable spawn rates
- Collision detection support
- Particle pooling for performance
- Support for 1000+ particles at 60fps

## Installation

```bash
npm install @rhuds/backgrounds
```

## Usage

### Basic Dots Pattern

```tsx
import { Dots } from '@rhuds/backgrounds';

export function MyComponent() {
  return (
    <Dots
      width={800}
      height={600}
      pattern="grid"
      dotSize={2}
      spacing={20}
      color="#00ffff"
      opacity={0.6}
      animated={true}
      animationSpeed={1}
    />
  );
}
```

### Particle Effects

```tsx
import { Puffs } from '@rhuds/backgrounds';

export function MyComponent() {
  return (
    <Puffs
      width={800}
      height={600}
      particleCount={50}
      particleSize={4}
      color="#ff00ff"
      speed={1}
      opacity={0.6}
      animated={true}
    />
  );
}
```

### Advanced Effects

```tsx
import { Nebula, StarField, AnimatedGradient, Plasma } from '@rhuds/backgrounds';

export function MyComponent() {
  return (
    <div>
      <Nebula
        width={800}
        height={600}
        colors={['#ff00ff', '#00ffff', '#ff0080']}
        scale={1}
        speed={1}
        opacity={0.6}
      />
      
      <StarField
        width={800}
        height={600}
        starCount={200}
        speed={2}
        parallaxFactor={0.5}
        color="#ffffff"
      />
      
      <AnimatedGradient
        width={800}
        height={600}
        colors={['#ff0080', '#00ffff']}
        angle={0}
        speed={1}
        opacity={1}
      />
      
      <Plasma
        width={800}
        height={600}
        color1="#ff0080"
        color2="#00ffff"
        speed={1}
        opacity={0.7}
      />
    </div>
  );
}
```

### Particle System

```tsx
import { ParticleSystem, ParticleEmitter } from '@rhuds/backgrounds';

const system = new ParticleSystem({
  maxParticles: 1000,
  gravity: 100,
  friction: 0.99,
  collisionEnabled: true,
});

const emitter = new ParticleEmitter({
  x: 400,
  y: 300,
  rate: 100, // particles per second
  speed: 50,
  size: 5,
  color: '#ff0000',
  direction: 90,
  spread: 45,
  life: 2,
});

system.addEmitter(emitter);

// In animation loop
system.update({ width: 800, height: 600 });
```

## Component Props

### Dots

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| pattern | 'grid' \| 'random' \| 'hexagonal' | 'grid' | Dot pattern type |
| dotSize | number | 2 | Size of each dot |
| spacing | number | 20 | Spacing between dots |
| color | string | '#00ffff' | Dot color |
| opacity | number | 0.5 | Dot opacity |
| animated | boolean | true | Enable animation |
| animationSpeed | number | 1 | Animation speed multiplier |

### Puffs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| particleCount | number | 50 | Number of particles |
| particleSize | number | 4 | Particle size |
| color | string | '#ffffff' | Particle color |
| speed | number | 1 | Particle speed |
| opacity | number | 0.6 | Particle opacity |
| animated | boolean | true | Enable animation |

### GridLines

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| cellSize | number | 50 | Grid cell size |
| color | string | '#00ffff' | Line color |
| strokeWidth | number | 1 | Line width |
| dashed | boolean | false | Use dashed lines |
| dashArray | string | '5,5' | Dash pattern |
| opacity | number | 0.4 | Line opacity |

### MovingLines

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| lineCount | number | 8 | Number of lines |
| color | string | '#00ffff' | Line color |
| strokeWidth | number | 2 | Line width |
| speed | number | 1 | Animation speed |
| direction | 'horizontal' \| 'vertical' \| 'diagonal' | 'horizontal' | Line direction |
| opacity | number | 0.5 | Line opacity |

### Nebula

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| colors | string[] | ['#ff00ff', '#00ffff', '#ff0080'] | Gradient colors |
| scale | number | 1 | Effect scale |
| speed | number | 1 | Animation speed |
| opacity | number | 0.5 | Effect opacity |

### StarField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| starCount | number | 200 | Number of stars |
| speed | number | 1 | Animation speed |
| parallaxFactor | number | 0.5 | Parallax effect strength |
| color | string | '#ffffff' | Star color |

### AnimatedGradient

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| colors | string[] | ['#ff0080', '#00ffff'] | Gradient colors |
| angle | number | 0 | Gradient angle |
| speed | number | 1 | Animation speed |
| opacity | number | 1 | Gradient opacity |

### Plasma

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| color1 | string | '#ff0080' | Primary color |
| color2 | string | '#00ffff' | Secondary color |
| speed | number | 1 | Animation speed |
| opacity | number | 0.5 | Effect opacity |

## Performance

All components use Canvas API for optimal performance:

- **Dots**: 60fps with 1000+ dots
- **Puffs**: 60fps with 500+ particles
- **GridLines**: 60fps with any grid size
- **MovingLines**: 60fps with any line count
- **Nebula**: 60fps with smooth gradients
- **StarField**: 60fps with 200+ stars
- **AnimatedGradient**: 60fps with smooth transitions
- **Plasma**: 60fps with procedural generation

## Layering

Combine multiple effects for complex backgrounds:

```tsx
<div style={{ position: 'relative', width: 800, height: 600 }}>
  {/* Base layer */}
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    <GridLines width={800} height={600} cellSize={50} opacity={0.2} />
  </div>

  {/* Middle layer */}
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    <Dots width={800} height={600} pattern="grid" opacity={0.4} />
  </div>

  {/* Top layer */}
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    <Puffs width={800} height={600} particleCount={30} opacity={0.3} />
  </div>

  {/* Content */}
  <div style={{ position: 'relative', zIndex: 10 }}>
    Your content here
  </div>
</div>
```

## Advanced Usage

### Custom Particle System

```tsx
import { ParticleSystem, ParticleEmitter, Particle } from '@rhuds/backgrounds';

const system = new ParticleSystem({
  maxParticles: 1000,
  gravity: 100,
  friction: 0.99,
  collisionEnabled: true,
});

// Create emitter
const emitter = new ParticleEmitter({
  x: 400,
  y: 300,
  rate: 100,
  speed: 50,
  size: 5,
  direction: 90,
  spread: 45,
  life: 2,
});

system.addEmitter(emitter);

// Update loop
function animate() {
  system.update({ width: 800, height: 600 });
  
  // Access particles
  system.particles.forEach(particle => {
    // Draw particle
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.opacity;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  requestAnimationFrame(animate);
}
```

### Noise Generation

```tsx
import { NoiseGenerator } from '@rhuds/backgrounds';

const generator = new NoiseGenerator(42);

// Generate Perlin noise
const noise = generator.perlin(x, y, z);
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Canvas API support

## Performance Tips

1. **Limit particle count** - Use `maxParticles` to prevent performance issues
2. **Disable collision detection** - Only enable when needed
3. **Use appropriate canvas size** - Larger canvases use more GPU
4. **Layer effects carefully** - Too many layers can impact performance
5. **Adjust animation speed** - Lower speeds use less CPU

## API Reference

### ParticleSystem

```typescript
class ParticleSystem {
  particles: Particle[];
  emitters: ParticleEmitter[];
  config: ParticleSystemConfig;
  
  addEmitter(emitter: ParticleEmitter): void;
  removeEmitter(emitter: ParticleEmitter): void;
  update(bounds?: { width: number; height: number }): void;
  clear(): void;
  getParticleCount(): number;
}
```

### Particle

```typescript
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  ax: number;
  ay: number;
  
  update(deltaTime: number, gravity?: number, friction?: number, bounds?: { width: number; height: number }): void;
  applyForce(fx: number, fy: number): void;
  isAlive(): boolean;
  distanceTo(other: Particle): number;
}
```

### ParticleEmitter

```typescript
class ParticleEmitter {
  x: number;
  y: number;
  rate: number;
  speed: number;
  size: number;
  color: string;
  direction: number;
  spread: number;
  life: number;
  
  emit(deltaTime: number): Particle[];
}
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## Support

For issues and questions, please visit our GitHub repository.
