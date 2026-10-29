import React from 'react';

/**
 * Bright Professional Studio Ground Plane
 * Blends seamlessly into the #F7F9FC background while receiving realistic soft contact shadows
 * beneath the floating 3D module cards.
 */
export const ObsidianFloor: React.FC = () => {
  return (
    <group position={[0, -2.8, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 60]} />
        <meshStandardMaterial
          color="#F7F9FC"
          roughness={0.9}
          metalness={0.01}
        />
      </mesh>
    </group>
  );
};
