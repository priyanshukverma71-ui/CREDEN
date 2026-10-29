import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiquidChromeSculptureProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

/**
 * Sculptural Liquid Glass Environmental Form
 * Crystal-clear optical glass sculpture in the spatial perimeter.
 * Provides luminous refraction and fluid elegance in light mode.
 */
export const LiquidChromeSculpture: React.FC<LiquidChromeSculptureProps> = ({
  position = [0, 1.2, -7.5],
  scale = 1.0,
  rotationSpeed = 0.12,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * rotationSpeed;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
    meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.2, 0.32, 128, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.06}
          metalness={0.05}
          transmission={0.94}
          thickness={0.8}
          ior={1.52}
          transparent
          opacity={0.85}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
};
