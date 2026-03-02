import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import type { LightConfig } from './types';

export function Light({
  type,
  color = '#ffffff',
  intensity = 1,
  position = [0, 10, 0],
  castShadow = false,
}: LightConfig) {
  const [light] = useState(() => {
    let l: THREE.Light;
    
    switch (type) {
      case 'ambient':
        l = new THREE.AmbientLight(color, intensity);
        break;
      case 'directional':
        l = new THREE.DirectionalLight(color, intensity);
        break;
      case 'point':
        l = new THREE.PointLight(color, intensity);
        break;
      case 'spot':
        l = new THREE.SpotLight(color, intensity);
        break;
      default:
        l = new THREE.AmbientLight(color, intensity);
    }
    
    l.castShadow = castShadow;
    return l;
  });

  useEffect(() => {
    if (type !== 'ambient') {
      light.position.set(...position);
    }
  }, [light, type, position]);

  return null;
}
