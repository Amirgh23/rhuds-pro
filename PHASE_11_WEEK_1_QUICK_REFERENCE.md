# Phase 11 Week 1 - Quick Reference Guide

**تاریخ**: 28 ژوئن 2026  
**هفته**: 1 از 4  
**فیچرهای تکمیل شده**: 5 از 15

---

## 🚀 شروع سریع

### WebGL Shaders

```typescript
import WebGLShaders, { BUILTIN_SHADERS } from '@rhuds/charts';

// Create shader manager
const shaders = new WebGLShaders(gl);

// Create program from built-in shader
const program = shaders.createProgram('3d', BUILTIN_SHADERS.shader3D);

// Set uniforms
shaders.setUniforms(program, {
  projection: projectionMatrix,
  view: viewMatrix,
  lightDir: [0.5, 0.5, 0.5],
});

// Delete when done
shaders.deleteProgram('3d');
```

### WebGL Buffers

```typescript
import WebGLBuffers from '@rhuds/charts';

// Create buffer manager
const buffers = new WebGLBuffers(gl);

// Create buffer with data
buffers.createBuffer('mesh', {
  vertices: vertexData,
  colors: colorData,
  indices: indexData,
  normals: normalData,
});

// Update buffer
buffers.updateBuffer('mesh', {
  vertices: newVertexData,
});

// Bind and use
buffers.bindBuffer('mesh');
buffers.bindAttribute(program, 'mesh', 'position', 3);

// Get memory usage
const usage = buffers.getMemoryUsage();

// Cleanup
buffers.deleteBuffer('mesh');
```

### 3D Renderer

```typescript
import Renderer3D from '@rhuds/charts';

// Create renderer
const renderer = new Renderer3D(canvas);

// Add mesh
renderer.addMesh('chart', {
  vertices: new Float32Array([...]),
  colors: new Float32Array([...]),
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
});

// Set camera
renderer.setCamera({
  position: [0, 0, 10],
  target: [0, 0, 0],
  fov: 45,
});

// Rotate camera
renderer.rotateCamera(0.1, 0.2, 0.3);

// Render
renderer.render();

// Resize
renderer.resize(1024, 768);

// Cleanup
renderer.destroy();
```

### Matrix Math

```typescript
import Matrix from '@rhuds/charts';

// Create matrices
const identity = Matrix.identity();
const translation = Matrix.translation(1, 2, 3);
const scale = Matrix.scale(2, 2, 2);
const rotationX = Matrix.rotationX(Math.PI / 4);
const rotationY = Matrix.rotationY(Math.PI / 4);
const rotationZ = Matrix.rotationZ(Math.PI / 4);

// Projections
const perspective = Matrix.perspective(45, 16 / 9, 0.1, 1000);
const orthographic = Matrix.orthographic(-1, 1, -1, 1, 0.1, 1000);

// Look-at
const view = Matrix.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);

// Operations
const result = Matrix.multiply(a, b);
const transposed = Matrix.transpose(matrix);
const inverted = Matrix.invert(matrix);

// Vector operations
const normalized = Matrix.normalize([3, 4, 0]);
const cross = Matrix.cross([1, 0, 0], [0, 1, 0]);
const dot = Matrix.dot([1, 2, 3], [4, 5, 6]);
const length = Matrix.length([3, 4, 0]);
```

---

## 📚 Built-in Shaders

### Line Chart Shader

```typescript
const program = shaders.createProgram('line', BUILTIN_SHADERS.lineChart);
// For rendering line charts with colors
```

### Bar Chart Shader

```typescript
const program = shaders.createProgram('bar', BUILTIN_SHADERS.barChart);
// For rendering bar charts with height attribute
```

### Scatter Plot Shader

```typescript
const program = shaders.createProgram('scatter', BUILTIN_SHADERS.scatterPlot);
// For rendering scatter plots with point sizes
```

### Heatmap Shader

```typescript
const program = shaders.createProgram('heatmap', BUILTIN_SHADERS.heatmap);
// For rendering heatmaps with color gradients
```

### 3D Shader

```typescript
const program = shaders.createProgram('3d', BUILTIN_SHADERS.shader3D);
// For rendering 3D objects with lighting
```

### Gradient Shader

```typescript
const program = shaders.createProgram('gradient', BUILTIN_SHADERS.gradient);
// For rendering gradient backgrounds
```

---

## 🎨 Custom Shaders

```typescript
const customShader = {
  vertex: `
    attribute vec2 position;
    attribute vec4 color;
    uniform mat4 projection;
    
    varying vec4 vColor;
    
    void main() {
      gl_Position = projection * vec4(position, 0.0, 1.0);
      vColor = color;
    }
  `,
  fragment: `
    precision mediump float;
    varying vec4 vColor;
    
    void main() {
      gl_FragColor = vColor;
    }
  `,
};

const program = shaders.createProgram('custom', customShader);
```

---

## 📊 Performance Tips

### Buffer Management

```typescript
// Good: Reuse buffers
const buffers = new WebGLBuffers(gl);
buffers.createBuffer('data', { vertices, colors });
buffers.updateBuffer('data', { vertices: newVertices });

// Bad: Create new buffers each frame
for (let i = 0; i < frames; i++) {
  buffers.createBuffer(`data_${i}`, { vertices, colors });
}
```

### Shader Programs

```typescript
// Good: Create once, reuse
const program = shaders.createProgram('chart', source);
// Use program multiple times

// Bad: Create new program each frame
for (let i = 0; i < frames; i++) {
  shaders.createProgram(`chart_${i}`, source);
}
```

### Large Datasets

```typescript
// Good: Use WebGL for large datasets
const vertices = new Float32Array(1000000 * 2);
const buffers = new WebGLBuffers(gl);
buffers.createBuffer('large', { vertices });

// Bad: Use Canvas 2D for large datasets
// Canvas 2D is slower for large datasets
```

---

## 🐛 Debugging

### Check Shader Compilation

```typescript
try {
  const program = shaders.createProgram('test', source);
  console.log('Shader compiled successfully');
} catch (error) {
  console.error('Shader compilation failed:', error);
}
```

### Check Buffer Creation

```typescript
try {
  const buffer = buffers.createBuffer('test', { vertices });
  console.log('Buffer created successfully');
} catch (error) {
  console.error('Buffer creation failed:', error);
}
```

### Monitor Memory Usage

```typescript
const usage = buffers.getMemoryUsage();
console.log(`Memory usage: ${(usage / 1024 / 1024).toFixed(2)}MB`);
```

### Check Rendering

```typescript
renderer.render();
// Check browser console for WebGL errors
// Use WebGL Inspector or similar tools
```

---

## 📋 Common Patterns

### Simple 3D Chart

```typescript
const renderer = new Renderer3D(canvas);

// Create chart data
const vertices = generateChartVertices();
const colors = generateChartColors();

// Add mesh
renderer.addMesh('chart', {
  vertices,
  colors,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
});

// Animation loop
function animate() {
  renderer.rotateCamera(0.01, 0.01, 0);
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
```

### Interactive 3D Chart

```typescript
const renderer = new Renderer3D(canvas);
let rotation = [0, 0, 0];

// Mouse controls
canvas.addEventListener('mousemove', (e) => {
  rotation[0] = (e.clientY / canvas.height) * Math.PI;
  rotation[1] = (e.clientX / canvas.width) * Math.PI;
});

// Animation loop
function animate() {
  renderer.rotateCamera(rotation[0], rotation[1], rotation[2]);
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
```

### Multiple Meshes

```typescript
const renderer = new Renderer3D(canvas);

// Add multiple meshes
renderer.addMesh('mesh1', { vertices: data1, colors: colors1, ... });
renderer.addMesh('mesh2', { vertices: data2, colors: colors2, ... });
renderer.addMesh('mesh3', { vertices: data3, colors: colors3, ... });

// Render all
renderer.render();
```

---

## 🔗 Related Files

- `packages/charts/src/engine/rendering/WebGLShaders.ts`
- `packages/charts/src/engine/rendering/WebGLBuffers.ts`
- `packages/charts/src/engine/rendering/3DRenderer.ts`
- `packages/charts/src/engine/math/Matrix.ts`
- `packages/charts/src/__tests__/integration/phase-11-week-1-webgl.test.ts`

---

## 📞 Support

For issues or questions:

1. Check the test files for examples
2. Review the implementation summary
3. Check the inline documentation
4. Open an issue on GitHub

---

**تاریخ**: 28 ژوئن 2026  
**وضعیت**: ✅ COMPLETE  
**فیچرهای**: 5 از 15
