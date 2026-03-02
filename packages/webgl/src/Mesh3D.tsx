import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import type { Mesh3DProps } from './types';

export function Mesh3D({
  geometry,
  material = {},
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = false,
  receiveShadow = false,
}: Mesh3DProps) {
  const [mesh] = useState(() => {
    // Create geometry
    let geom: THREE.BufferGeometry;
    switch (geometry) {
      case 'box':
        geom = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geom = new THREE.SphereGeometry(1, 32, 32);
        break;
      case 'cylinder':
        geom = new THREE.CylinderGeometry(1, 1, 2, 32);
        break;
      case 'plane':
        geom = new THREE.PlaneGeometry(1, 1);
        break;
      case 'torus':
        geom = new THREE.TorusGeometry(1, 0.4, 16, 100);
        break;
      default:
        geom = new THREE.BoxGeometry(1, 1, 1);
    }

    // Create material
    let mat: THREE.Material;
    switch (material.type) {
      case 'standard':
        mat = new THREE.MeshStandardMaterial({
          color: material.color || '#ffffff',
          metalness: material.metalness || 0.5,
          roughness: material.roughness || 0.5,
          transparent: material.transparent,
          opacity: material.opacity,
          wireframe: material.wireframe,
        });
        break;
      case 'phong':
        mat = new THREE.MeshPhongMaterial({
          color: material.color || '#ffffff',
          transparent: material.transparent,
          opacity: material.opacity,
          wireframe: material.wireframe,
        });
        break;
      case 'lambert':
        mat = new THREE.MeshLambertMaterial({
          color: material.color || '#ffffff',
          transparent: material.transparent,
          opacity: material.opacity,
          wireframe: material.wireframe,
        });
        break;
      default:
        mat = new THREE.MeshBasicMaterial({
          color: material.color || '#ffffff',
          transparent: material.transparent,
          opacity: material.opacity,
          wireframe: material.wireframe,
        });
    }

    const m = new THREE.Mesh(geom, mat);
    m.castShadow = castShadow;
    m.receiveShadow = receiveShadow;
    return m;
  });

  useEffect(() => {
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.scale.set(...scale);
  }, [mesh, position, rotation, scale]);

  return null; // This component doesn't render DOM elements
}
