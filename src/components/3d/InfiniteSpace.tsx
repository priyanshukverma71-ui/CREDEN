import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const InfiniteSpace: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const monolithsRef = useRef<THREE.Group>(null);

  // Generate restrained silver dust particles
  const particleCount = 280;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35 + 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45 - 8;
    }
    return pos;
  }, []);

  // Generate background crystal & platinum monoliths
  const monolithData = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      position: [
        (i - 13) * 3.6 + (Math.random() - 0.5) * 2.5,
        Math.random() * 6 + 3,
        -10 - Math.random() * 14,
      ] as [number, number, number],
      scale: [
        0.7 + Math.random() * 0.7,
        3.5 + Math.random() * 6,
        0.7 + Math.random() * 0.7,
      ] as [number, number, number],
      rotation: [
        (Math.random() - 0.5) * 0.3,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.3,
      ] as [number, number, number],
      isPlatinum: i % 3 === 0,
    }));
  }, []);

  // Gentle float animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.012;
    }
    if (monolithsRef.current) {
      monolithsRef.current.children.forEach((child, idx) => {
        child.position.y += Math.sin(time * 0.4 + idx) * 0.0015;
      });
    }
  });

  return (
    <>
      {/* Background Silver dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#E2E8F0"
          transparent
          opacity={0.45}
          sizeAttenuation
        />
      </points>

      {/* Floating Obsidian & Platinum Crystal Monoliths */}
      <group ref={monolithsRef}>
        {monolithData.map((m, idx) => (
          <group
            key={idx}
            position={m.position}
            scale={m.scale}
            rotation={m.rotation}
          >
            {/* Hexagonal prism crystal */}
            <mesh>
              <cylinderGeometry args={[0.4, 0.65, 2.2, 6]} />
              <meshStandardMaterial
                color={m.isPlatinum ? '#E2E8F0' : '#141822'}
                roughness={m.isPlatinum ? 0.12 : 0.25}
                metalness={0.95}
                emissive={m.isPlatinum ? '#334155' : '#0B0D13'}
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Specular edge ring highlight */}
            <mesh position={[0, 0.4, 0]}>
              <ringGeometry args={[0.48, 0.52, 6]} />
              <meshBasicMaterial
                color="#FFFFFF"
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
};
