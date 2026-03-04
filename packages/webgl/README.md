# @rhuds/webgl

WebGL and 3D components with Three.js integration for RHUDS Pro.

## Installation

```bash
npm install @rhuds/webgl three
```

## Features

- 🎨 3D Scene management
- 🔷 Mesh components (Box, Sphere, Cylinder, etc.)
- 💡 Multiple light types
- 🎭 Shader system with presets
- 🎬 Animation support
- 📦 TypeScript support

## Usage

### Basic 3D Scene

```tsx
import { Scene3D, Mesh3D, Light } from '@rhuds/webgl';

function My3DScene() {
  return (
    <Scene3D
      width={800}
      height={600}
      backgroundColor="#000000"
      camera={{
        position: [0, 0, 5],
        fov: 75,
      }}
    >
      <Light type="ambient" intensity={0.5} />
      <Light type="directional" position={[10, 10, 5]} intensity={1} />
      
      <Mesh3D
        geometry="box"
        material={{ type: 'standard', color: '#ff0000' }}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </Scene3D>
  );
}
```

### Using Shaders

```tsx
import { ShaderManager, commonShaders } from '@rhuds/webgl';

const shaderManager = new ShaderManager();

// Register hologram shader
const hologramShader = shaderManager.registerShader({
  name: 'hologram',
  ...commonShaders.hologram,
});

// Update uniforms
shaderManager.updateUniforms('hologram', {
  time: Date.now() * 0.001,
  color: new THREE.Color(0x00ffff),
});
```

## Components

### Scene3D

Main 3D scene container.

**Props:**
- `width`: number - Scene width
- `height`: number - Scene height
- `backgroundColor`: string - Background color
- `fog`: object - Fog configuration
- `camera`: CameraConfig - Camera settings
- `onRender`: function - Render callback

### Mesh3D

3D mesh component.

**Props:**
- `geometry`: 'box' | 'sphere' | 'cylinder' | 'plane' | 'torus'
- `material`: MaterialConfig - Material settings
- `position`: [x, y, z] - Position
- `rotation`: [x, y, z] - Rotation
- `scale`: [x, y, z] - Scale
- `castShadow`: boolean - Cast shadows
- `receiveShadow`: boolean - Receive shadows

### Light

Light component.

**Props:**
- `type`: 'ambient' | 'directional' | 'point' | 'spot'
- `color`: string - Light color
- `intensity`: number - Light intensity
- `position`: [x, y, z] - Light position
- `castShadow`: boolean - Cast shadows

## Shader Presets

### Hologram

Creates a holographic effect with scanlines.

```tsx
import { commonShaders } from '@rhuds/webgl';

const shader = commonShaders.hologram;
```

### Blur

Applies blur effect.

```tsx
import { commonShaders } from '@rhuds/webgl';

const shader = commonShaders.blur;
```

## License

MIT
