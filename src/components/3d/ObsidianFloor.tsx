import React from 'react';

export const ObsidianFloor: React.FC = () => {
  return (
    <group position={[0, -3.2, 0]}>
      {/* Deep Obsidian Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 60]} />
        <meshStandardMaterial
          color="#08090B"
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Subtle floor grid line accents */}
      <gridHelper
        args={[100, 50, '#1A1D22', '#111317']}
        position={[0, 0.01, 0]}
      />
    </group>
  );
};
