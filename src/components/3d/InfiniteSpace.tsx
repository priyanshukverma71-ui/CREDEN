import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const InfiniteSpace: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const monolithsRef = useRef<THREE.Group>(null);

  // Generate restrained silver dust particles
  const particleCount = 200;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    return pos;
  }, []);

  // Generate background crystal monoliths
  const monolithData = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      position: [
        (i - 9) * 5 + (Math.random() - 0.5) * 2,
        Math.random() * 6 + 4,
        -14 - Math.random() * 8,
      ] as [number, number, number],
      scale: [
        0.8 + Math.random() * 0.6,
        4 + Math.random() * 6,
        0.8 + Math.random() * 0.6,
      ] as [number, number, number],
      rotation: [
        (Math.random() - 0.5) * 0.2,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.2,
      ] as [number, number, number],
    }));
  }, []);

  // Gentle float animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.015;
    }
    if (monolithsRef.current) {
      monolithsRef.current.children.forEach((child, idx) => {
        child.position.y += Math.sin(time * 0.5 + idx) * 0.002;
      });
    }
  });

  return (
    <>
      {/* Background Star / Silver particle points */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#D4D7DC"
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>

      {/* Floating Obsidian & Platinum Crystal Monoliths */}
      <group ref={monolithsRef}>
        {monolithData.map((m, idx) => (
          <mesh
            key={idx}
            position={m.position}
            scale={m.scale}
            rotation={m.rotation}
          >
            {/* Hexagonal prism / cylinder geometry for architectural crystals */}
            <cylinderGeometry args={[0.5, 0.7, 2, 6]} />
            <meshStandardMaterial
              color="#111317"
              roughness={0.2}
              metalness={0.85}
              envMapIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};
