import * as THREE from 'three';
import type { ShaderConfig } from './types';

export class ShaderManager {
  private shaders: Map<string, THREE.ShaderMaterial> = new Map();

  registerShader(config: ShaderConfig): THREE.ShaderMaterial {
    const material = new THREE.ShaderMaterial({
      vertexShader: config.vertexShader,
      fragmentShader: config.fragmentShader,
      uniforms: config.uniforms || {},
    });

    this.shaders.set(config.name, material);
    return material;
  }

  getShader(name: string): THREE.ShaderMaterial | undefined {
    return this.shaders.get(name);
  }

  updateUniforms(name: string, uniforms: Record<string, any>): void {
    const shader = this.shaders.get(name);
    if (shader) {
      Object.keys(uniforms).forEach(key => {
        if (shader.uniforms[key]) {
          shader.uniforms[key].value = uniforms[key];
        }
      });
    }
  }

  removeShader(name: string): void {
    const shader = this.shaders.get(name);
    if (shader) {
      shader.dispose();
      this.shaders.delete(name);
    }
  }

  dispose(): void {
    this.shaders.forEach(shader => shader.dispose());
    this.shaders.clear();
  }
}

// Common shader presets
export const commonShaders = {
  hologram: {
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        vec3 glow = color * intensity;
        float scanline = sin(vPosition.y * 10.0 + time) * 0.1 + 0.9;
        gl_FragColor = vec4(glow * scanline, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00ffff) },
    },
  },
  
  blur: {
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform float blurAmount;
      varying vec2 vUv;
      
      void main() {
        vec4 sum = vec4(0.0);
        vec2 texelSize = 1.0 / resolution;
        
        for(float x = -4.0; x <= 4.0; x++) {
          for(float y = -4.0; y <= 4.0; y++) {
            vec2 offset = vec2(x, y) * texelSize * blurAmount;
            sum += texture2D(tDiffuse, vUv + offset);
          }
        }
        
        gl_FragColor = sum / 81.0;
      }
    `,
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new THREE.Vector2(512, 512) },
      blurAmount: { value: 1.0 },
    },
  },
};
