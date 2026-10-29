import React from 'react';

/**
 * Clean, deep matte obsidian ground plane.
 * Wireframe grid, circular podiums, and reflective rings are completely removed.
 * Catches soft ambient shadows directly beneath floating architectural slabs.
 */
export const ObsidianFloor: React.FC = () => {
  return (
    <group position={[0, -2.8, 0]}>
      {/* Matte Midnight Charcoal Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 60]} />
        <meshStandardMaterial
          color="#07080A"
          roughness={0.92}
          metalness={0.06}
        />
      </mesh>
    </group>
  );
};
