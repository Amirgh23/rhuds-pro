import * as THREE from 'three';
import { ShaderManager } from '../ShaderManager';

export interface EffectPass {
  name: string;
  shader: THREE.ShaderMaterial;
  enabled: boolean;
}

export class EffectComposer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderTarget: THREE.WebGLRenderTarget;
  private passes: EffectPass[] = [];
  private shaderManager: ShaderManager;
  private quad: THREE.Mesh;
  private time = 0;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    this.shaderManager = new ShaderManager();

    // Create render target
    this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });

    // Create quad for post-processing
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial();
    this.quad = new THREE.Mesh(geometry, material);
    this.scene.add(this.quad);
  }

  addPass(name: string, shader: THREE.ShaderMaterial): void {
    this.passes.push({
      name,
      shader,
      enabled: true,
    });
  }

  removePass(name: string): void {
    this.passes = this.passes.filter((pass) => pass.name !== name);
  }

  getPass(name: string): EffectPass | undefined {
    return this.passes.find((pass) => pass.name === name);
  }

  enablePass(name: string): void {
    const pass = this.getPass(name);
    if (pass) {
      pass.enabled = true;
    }
  }

  disablePass(name: string): void {
    const pass = this.getPass(name);
    if (pass) {
      pass.enabled = false;
    }
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.time += 0.016; // Assume 60fps

    // Render scene to render target
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(scene, camera);

    let inputTexture = this.renderTarget.texture;

    // Apply each pass
    for (const pass of this.passes) {
      if (!pass.enabled) continue;

      // Update uniforms
      if (pass.shader.uniforms.tDiffuse) {
        pass.shader.uniforms.tDiffuse.value = inputTexture;
      }
      if (pass.shader.uniforms.time) {
        pass.shader.uniforms.time.value = this.time;
      }

      // Apply pass
      (this.quad.material as THREE.ShaderMaterial) = pass.shader;
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.render(this.scene, this.camera);

      inputTexture = this.renderTarget.texture;
    }

    // Render final result to screen
    this.renderer.setRenderTarget(null);
    (this.quad.material as THREE.ShaderMaterial).uniforms.tDiffuse.value = inputTexture;
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width: number, height: number): void {
    this.renderTarget.setSize(width, height);
  }

  dispose(): void {
    this.renderTarget.dispose();
    this.shaderManager.dispose();
    (this.quad.geometry as THREE.BufferGeometry).dispose();
    (this.quad.material as THREE.Material as any).dispose();
  }
}
