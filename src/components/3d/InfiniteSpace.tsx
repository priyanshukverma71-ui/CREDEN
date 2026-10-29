import React from 'react';

/**
 * Clean, restrained spatial atmosphere for CREDEN 3D Launcher.
 * Features a soft studio horizon and gentle depth gradient without distracting background clutter.
 */
export const InfiniteSpace: React.FC = () => {
  return (
    <group>
      {/* Subtle, restrained studio horizon line in the distance */}
      <mesh position={[0, -2.78, -14]}>
        <boxGeometry args={[140, 0.015, 0.015]} />
        <meshBasicMaterial color="#E2E8F0" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};
