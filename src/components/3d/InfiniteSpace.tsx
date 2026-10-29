import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Soft Spatial Atmosphere
 * White-to-ice-blue ambient horizon with faint lavender and mint floating halos
 */
export const InfiniteSpace: React.FC = () => {
  const lavenderRef = useRef<THREE.Group>(null);
  const mintRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lavenderRef.current) {
      lavenderRef.current.position.y = 1.6 + Math.sin(time * 0.7) * 0.12;
      lavenderRef.current.position.x = -5.4 + Math.cos(time * 0.5) * 0.14;
    }
    if (mintRef.current) {
      mintRef.current.position.y = 1.3 + Math.cos(time * 0.8) * 0.12;
      mintRef.current.position.x = 5.4 + Math.sin(time * 0.6) * 0.14;
    }
  });

  return (
    <group>
      {/* 1. Faint Lavender Atmospheric Ambient Halo on Left Wing */}
      <group ref={lavenderRef} position={[-5.4, 1.6, -7.0]}>
        {/* Soft outer halo aura */}
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[4.6, 64]} />
          <meshBasicMaterial
            color="#DDD6FE"
            transparent
            opacity={0.065}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Luminous inner core aura */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[2.8, 64]} />
          <meshBasicMaterial
            color="#EDE9FE"
            transparent
            opacity={0.085}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. Faint Mint Atmospheric Ambient Halo on Right Wing */}
      <group ref={mintRef} position={[5.4, 1.3, -7.0]}>
        {/* Soft outer halo aura */}
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[4.6, 64]} />
          <meshBasicMaterial
            color="#A7F3D0"
            transparent
            opacity={0.055}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Luminous inner core aura */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[2.8, 64]} />
          <meshBasicMaterial
            color="#D1FAE5"
            transparent
            opacity={0.075}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 3. Subtle, restrained ice-blue studio horizon guide in the distance */}
      <mesh position={[0, -2.85, -14]}>
        <boxGeometry args={[140, 0.01, 0.01]} />
        <meshBasicMaterial color="#CBD5E1" transparent opacity={0.25} />
      </mesh>
    </group>
  );
};
