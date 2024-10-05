import React, { useRef, useEffect } from 'react';
import { useFBX } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

const weaponModels = {
  Pistol: { path: '/models/Glock17.fbx', scale: [0.3, 0.3, 0.3], price: 300 },
  Pistol2: { path: '/models/Phenoix.fbx', scale: [0.2, 0.2, 0.3], price: 350 },
  AK: { path: '/models/AK-103.fbx', scale: [0.05, 0.05, 0.05], price: 1200 },
  knife: { path: '/models/knife.fbx', scale: [0.1, 0.1, 0.1], price: 100 },
  grinder: { path: '/models/grinder.fbx', scale: [0.2, 0.2, 0.2], price: 200 },
  scar: { path: '/models/Scar.fbx', scale: [0.01, 0.01, 0.01], price: 1500 },
  Phenoix: { path: '/models/New.fbx', scale: [0.15, 0.15, 0.15], price: 800 },
  Snipper: { path: '/models/snipper.fbx', scale: [0.05, 0.05, 0.05], price: 1800 },
  // Add other models as needed
};

export function Weapons({ weapon, color }) {
  const group = useRef();
  const weaponModel = useFBX(weaponModels[weapon].path);

  useEffect(() => {
    if (weaponModel) {
      weaponModel.traverse((child) => {
        if (child.isMesh) {
          child.material = new MeshStandardMaterial({ color });
        }
      });
    }
  }, [weaponModel, color]);

  return (
    <group ref={group} dispose={null} scale={weaponModels[weapon].scale}>
      {weaponModel && <primitive object={weaponModel} />}
    </group>
  );
}

Weapons.defaultProps = {
  color: 'gray', // default color
};
