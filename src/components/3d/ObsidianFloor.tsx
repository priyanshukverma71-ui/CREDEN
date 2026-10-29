import React from 'react';

/**
 * Luminous Light Studio Ground Plane
 * Replaces the dark floor with a soft, daylight studio floor plane.
 * Catches soft ambient shadows directly beneath floating liquid glass pods.
 */
export const ObsidianFloor: React.FC = () => {
  return (
    <group position={[0, -2.8, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 60]} />
        <meshStandardMaterial
          color="#E2E8F0"
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>
    </group>
  );
};
