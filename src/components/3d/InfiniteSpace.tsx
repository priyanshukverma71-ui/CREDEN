import React from 'react';

/**
 * Pure, restrained spatial atmosphere for CREDEN.
 * Completely removes giant vertical pillars, decorative particles, and sci-fi geometry.
 * Preserves high-performance, distraction-free architectural negative space.
 */
export const InfiniteSpace: React.FC = () => {
  return (
    <group>
      {/* Distant soft silver horizon divider - minimal and understated */}
      <mesh position={[0, -2.78, -12]}>
        <boxGeometry args={[120, 0.02, 0.02]} />
        <meshBasicMaterial color="#1E232B" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
