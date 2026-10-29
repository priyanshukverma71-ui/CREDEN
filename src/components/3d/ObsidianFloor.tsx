import React from 'react';

export const ObsidianFloor: React.FC = () => {
  const podXPositions = [-18, -14, -10, -6, -2, 2, 6, 10, 14, 18];

  return (
    <group position={[0, -3.2, 0]}>
      {/* Deep Obsidian Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 70]} />
        <meshStandardMaterial
          color="#08090C"
          roughness={0.12}
          metalness={0.96}
          emissive="#0B0D12"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Subtle floor grid line accents */}
      <gridHelper
        args={[120, 60, '#1E232B', '#12151B']}
        position={[0, 0.01, 0]}
      />

      {/* Reflective light pools beneath each floating pod structure */}
      {podXPositions.map((x, idx) => (
        <group key={idx} position={[x, 0.02, 0]}>
          {/* Outer diffuse reflection pool */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.2, 32]} />
            <meshBasicMaterial
              color="#CBD5E1"
              transparent
              opacity={0.12}
            />
          </mesh>
          {/* Middle reflective disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.8, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.25}
            />
          </mesh>
          {/* Center bright specular spot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.9, 24]} />
            <meshBasicMaterial
              color="#F8FAFC"
              transparent
              opacity={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
