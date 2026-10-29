import React from 'react';

/**
 * Soft Spatial Ground Plane
 * Blends seamlessly into the white-to-ice-blue atmosphere while receiving
 * soft ambient shadows beneath the floating icons.
 */
export const ObsidianFloor: React.FC = () => {
  return (
    <group position={[0, -2.85, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 50]} />
        <meshStandardMaterial
          color="#E8F1FA"
          roughness={0.96}
          metalness={0.01}
          transparent
          opacity={0.78}
        />
      </mesh>
    </group>
  );
};
