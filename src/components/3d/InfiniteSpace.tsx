import React from 'react';
import { LiquidChromeSculpture } from './LiquidChromeSculpture';

/**
 * Pure, restrained spatial atmosphere for CREDEN.
 * Features sculptural liquid-chrome forms as occasional environmental elements.
 * Generates depth through camera perspective, material contrast, and cool silver studio lighting.
 */
export const InfiniteSpace: React.FC = () => {
  return (
    <group>
      {/* Sculptural Liquid-Chrome Environmental Elements in the Spatial Distance */}
      <LiquidChromeSculpture position={[-16, 2.2, -10]} scale={0.85} rotationSpeed={0.08} />
      <LiquidChromeSculpture position={[0, 2.6, -12]} scale={1.1} rotationSpeed={0.06} />
      <LiquidChromeSculpture position={[16, 2.2, -10]} scale={0.85} rotationSpeed={0.08} />

      {/* Subtle silver horizon divider */}
      <mesh position={[0, -2.78, -14]}>
        <boxGeometry args={[140, 0.015, 0.015]} />
        <meshBasicMaterial color="#1E232B" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
