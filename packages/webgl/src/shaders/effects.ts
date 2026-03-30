import * as THREE from 'three';

export const blurShader = {
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
};

export const bloomShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float threshold;
    uniform float strength;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      
      if (brightness > threshold) {
        gl_FragColor = vec4(color.rgb * strength, color.a);
      } else {
        gl_FragColor = color;
      }
    }
  `,
  uniforms: {
    tDiffuse: { value: null },
    threshold: { value: 0.5 },
    strength: { value: 1.5 },
  },
};

export const chromaticAberrationShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    
    void main() {
      vec2 offset = vec2(amount, 0.0);
      
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.005 },
  },
};

export const hologramShader = {
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
};

export const distortionShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float amount;
    varying vec2 vUv;
    
    void main() {
      vec2 distortion = vec2(
        sin(vUv.y * 10.0 + time) * amount,
        cos(vUv.x * 10.0 + time) * amount
      );
      
      vec4 color = texture2D(tDiffuse, vUv + distortion);
      gl_FragColor = color;
    }
  `,
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    amount: { value: 0.01 },
  },
};

export const vignetteShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      float vignette = smoothstep(0.8, 0.0, dist);
      
      color.rgb *= mix(1.0 - darkness, 1.0, vignette);
      gl_FragColor = color;
    }
  `,
  uniforms: {
    tDiffuse: { value: null },
    darkness: { value: 0.5 },
  },
};
