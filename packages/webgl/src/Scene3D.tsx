import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { Scene3DProps } from './types';

export function Scene3D({
  children,
  backgroundColor = '#000000',
  fog,
  width = 800,
  height = 600,
  camera,
  onRender,
}: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scene] = useState(() => new THREE.Scene());
  const [renderer] = useState(() => new THREE.WebGLRenderer({ antialias: true }));
  const [cam] = useState(() => {
    if (camera?.type === 'orthographic') {
      return new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, camera.near || 0.1, camera.far || 1000);
    }
    return new THREE.PerspectiveCamera(
      camera?.fov || 75,
      camera?.aspect || width / height,
      camera?.near || 0.1,
      camera?.far || 1000
    );
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup renderer
    renderer.setSize(width, height);
    renderer.setClearColor(backgroundColor);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Setup scene
    scene.background = new THREE.Color(backgroundColor);
    
    if (fog) {
      scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
    }

    // Setup camera
    if (camera?.position) {
      cam.position.set(...camera.position);
    } else {
      cam.position.z = 5;
    }

    if (camera?.lookAt) {
      cam.lookAt(...camera.lookAt);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (onRender) {
        onRender(scene, cam);
      }
      
      renderer.render(scene, cam);
    };

    animate();

    return () => {
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scene, renderer, cam, backgroundColor, fog, width, height, camera, onRender]);

  return (
    <div ref={containerRef} style={{ width, height }}>
      {/* Children will be rendered as 3D objects */}
    </div>
  );
}
