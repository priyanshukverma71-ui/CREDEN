import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiquidChromeSculptureProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

/**
 * Sculptural Liquid-Chrome Environmental Element
 * Refined, flowing molten platinum form situated in the spatial perimeter.
 * Provides cinematic liquid-platinum identity with physically based metallic reflections.
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
        <meshStandardMaterial
          color="#F2F5F9"
          metalness={0.97}
          roughness={0.11}
          emissive="#18202A"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
};
