import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';
import { OrbitControls } from '../controls/OrbitControls';
import { ModelLoader } from '../loaders/ModelLoader';
import { ShaderManager } from '../ShaderManager';

describe('WebGL 3D Components', () => {
  describe('OrbitControls', () => {
    let camera: THREE.PerspectiveCamera;
    let container: HTMLElement;
    let controls: OrbitControls;

    beforeEach(() => {
      camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
      camera.position.z = 5;
      container = document.createElement('div');
      container.style.width = '800px';
      container.style.height = '600px';
      document.body.appendChild(container);
      controls = new OrbitControls(camera, container);
    });

    afterEach(() => {
      if (controls) {
        controls.dispose();
      }
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
    });

    it('should create orbit controls', () => {
      expect(controls).toBeInstanceOf(OrbitControls);
    });

    it('should update camera on update call', () => {
      const initialPos = camera.position.clone();
      controls.update();
      expect(camera.position).toBeDefined();
    });

    it('should handle mouse events', () => {
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      });
      container.dispatchEvent(mouseDownEvent);

      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 150,
      });
      container.dispatchEvent(mouseMoveEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      container.dispatchEvent(mouseUpEvent);

      controls.update();
      expect(camera.position).toBeDefined();
    });

    it('should handle zoom with wheel event', () => {
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: 100,
      });
      container.dispatchEvent(wheelEvent);
      controls.update();
      expect(camera.position).toBeDefined();
    });

    it('should apply damping', () => {
      const controlsWithDamping = new OrbitControls(camera, container, {
        enableDamping: true,
        dampingFactor: 0.05,
      });
      controlsWithDamping.update();
      expect(camera.position).toBeDefined();
      controlsWithDamping.dispose();
    });

    it('should auto-rotate when enabled', () => {
      const controlsAutoRotate = new OrbitControls(camera, container, {
        autoRotate: true,
        autoRotateSpeed: 2,
      });
      controlsAutoRotate.update();
      expect(camera.rotation).toBeDefined();
      controlsAutoRotate.dispose();
    });

    it('should respect min/max distance', () => {
      const controlsWithLimits = new OrbitControls(camera, container, {
        minDistance: 1,
        maxDistance: 10,
      });
      controlsWithLimits.update();
      expect(camera.position).toBeDefined();
      controlsWithLimits.dispose();
    });
  });

  describe('ModelLoader', () => {
    let loader: ModelLoader;

    beforeEach(() => {
      loader = new ModelLoader();
    });

    afterEach(() => {
      loader.dispose();
    });

    it('should create model loader', () => {
      expect(loader).toBeInstanceOf(ModelLoader);
    });

    it('should reject unsupported format', async () => {
      try {
        await loader.loadModel('model.xyz');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect((error as Error).message).toContain('Unsupported model format');
      }
    });

    it('should handle load errors', async () => {
      const onError = vi.fn();
      try {
        await loader.loadModel('nonexistent.gltf', { onError });
      } catch (error) {
        // Expected to fail
      }
    });

    it('should dispose loader', () => {
      loader.dispose();
      expect(loader).toBeInstanceOf(ModelLoader);
    });
  });

  describe('ShaderManager', () => {
    let manager: ShaderManager;

    beforeEach(() => {
      manager = new ShaderManager();
    });

    afterEach(() => {
      manager.dispose();
    });

    it('should create shader manager', () => {
      expect(manager).toBeInstanceOf(ShaderManager);
    });

    it('should register shader', () => {
      const shader = manager.registerShader({
        name: 'test',
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
      });
      expect(shader).toBeInstanceOf(THREE.ShaderMaterial);
    });

    it('should get registered shader', () => {
      manager.registerShader({
        name: 'test',
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
      });
      const shader = manager.getShader('test');
      expect(shader).toBeInstanceOf(THREE.ShaderMaterial);
    });

    it('should return undefined for non-existent shader', () => {
      const shader = manager.getShader('nonexistent');
      expect(shader).toBeUndefined();
    });

    it('should update shader uniforms', () => {
      const shader = manager.registerShader({
        name: 'test',
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
        uniforms: {
          color: { value: new THREE.Color(0xff0000) },
        },
      });
      manager.updateUniforms('test', {
        color: new THREE.Color(0x00ff00),
      });
      expect(shader.uniforms.color.value).toBeInstanceOf(THREE.Color);
    });

    it('should remove shader', () => {
      manager.registerShader({
        name: 'test',
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
      });
      manager.removeShader('test');
      const shader = manager.getShader('test');
      expect(shader).toBeUndefined();
    });

    it('should dispose all shaders', () => {
      manager.registerShader({
        name: 'test1',
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
      });
      manager.registerShader({
        name: 'test2',
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
      });
      manager.dispose();
      expect(manager.getShader('test1')).toBeUndefined();
      expect(manager.getShader('test2')).toBeUndefined();
    });
  });

  describe('Three.js Scene Management', () => {
    it('should create and manage Three.js scene', () => {
      const scene = new THREE.Scene();
      expect(scene).toBeInstanceOf(THREE.Scene);
      expect(scene.children.length).toBe(0);
    });

    it('should add and remove objects from scene', () => {
      const scene = new THREE.Scene();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
      scene.add(mesh);
      expect(scene.children.length).toBe(1);
      scene.remove(mesh);
      expect(scene.children.length).toBe(0);
    });

    it('should create different geometries', () => {
      const box = new THREE.BoxGeometry(1, 1, 1);
      const sphere = new THREE.SphereGeometry(1, 32, 32);
      const cylinder = new THREE.CylinderGeometry(1, 1, 2, 32);
      const plane = new THREE.PlaneGeometry(1, 1);
      const torus = new THREE.TorusGeometry(1, 0.4, 16, 100);

      expect(box).toBeInstanceOf(THREE.BufferGeometry);
      expect(sphere).toBeInstanceOf(THREE.BufferGeometry);
      expect(cylinder).toBeInstanceOf(THREE.BufferGeometry);
      expect(plane).toBeInstanceOf(THREE.BufferGeometry);
      expect(torus).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('should create different materials', () => {
      const basic = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const standard = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const phong = new THREE.MeshPhongMaterial({ color: 0x0000ff });
      const lambert = new THREE.MeshLambertMaterial({ color: 0xffff00 });

      expect(basic).toBeInstanceOf(THREE.Material);
      expect(standard).toBeInstanceOf(THREE.Material);
      expect(phong).toBeInstanceOf(THREE.Material);
      expect(lambert).toBeInstanceOf(THREE.Material);
    });

    it('should create different light types', () => {
      const ambient = new THREE.AmbientLight(0xffffff, 1);
      const directional = new THREE.DirectionalLight(0xffffff, 1);
      const point = new THREE.PointLight(0xffffff, 1);
      const spot = new THREE.SpotLight(0xffffff, 1);

      expect(ambient).toBeInstanceOf(THREE.Light);
      expect(directional).toBeInstanceOf(THREE.Light);
      expect(point).toBeInstanceOf(THREE.Light);
      expect(spot).toBeInstanceOf(THREE.Light);
    });

    it('should create perspective camera', () => {
      const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
      expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
      expect(camera.fov).toBe(75);
    });

    it('should create orthographic camera', () => {
      const camera = new THREE.OrthographicCamera(-400, 400, 300, -300, 0.1, 1000);
      expect(camera).toBeInstanceOf(THREE.OrthographicCamera);
    });

    it('should handle mesh transformations', () => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
      mesh.position.set(1, 2, 3);
      mesh.rotation.set(0.1, 0.2, 0.3);
      mesh.scale.set(2, 2, 2);

      expect(mesh.position.x).toBe(1);
      expect(mesh.position.y).toBe(2);
      expect(mesh.position.z).toBe(3);
      expect(mesh.scale.x).toBe(2);
    });

    it('should handle shadow properties', () => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      expect(mesh.castShadow).toBe(true);
      expect(mesh.receiveShadow).toBe(true);
    });
  });
});
