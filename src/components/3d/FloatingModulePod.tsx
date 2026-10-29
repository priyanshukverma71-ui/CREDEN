import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ModuleId } from '../../types';

interface FloatingModulePodProps {
  id: ModuleId;
  title: string;
  subtitle: string;
  category?: string;
  position: [number, number, number];
  onSelect: (id: ModuleId) => void;
  isActive: boolean;
}

// -------------------------------------------------------------
// Small, carefully crafted platinum 3D symbols
// Realistic brushed aluminium, restrained reflections, soft studio lighting.
// Secondary to module titles. Zero giant circular rings.
// -------------------------------------------------------------
const ModuleSymbol: React.FC<{ id: ModuleId; hovered: boolean }> = ({ id, hovered }) => {
  const platinumMat = (
    <meshStandardMaterial
      color="#D8DCE3"
      metalness={0.82}
      roughness={0.32}
    />
  );

  const darkMat = (
    <meshStandardMaterial
      color="#181B22"
      metalness={0.35}
      roughness={0.55}
    />
  );

  const renderSymbol = () => {
    switch (id) {
      case 'institutions':
        // Minimal architectural institution symbol: Neoclassical pediment & 4 slender columns
        return (
          <group scale={0.78}>
            {/* Triangular Pediment Roof */}
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 3]} rotation={[0, 0, Math.PI]} />
              {platinumMat}
            </mesh>
            {/* Entablature Crossbeam */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.92, 0.05, 0.1]} />
              {platinumMat}
            </mesh>
            {/* 4 Slender Columns */}
            {[-0.32, -0.11, 0.11, 0.32].map((x, idx) => (
              <mesh key={idx} position={[x, -0.04, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.44, 16]} />
                {platinumMat}
              </mesh>
            ))}
            {/* Stepped Stylobate Plinth Base */}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.96, 0.05, 0.12]} />
              {platinumMat}
            </mesh>
            <mesh position={[0, -0.34, 0]}>
              <boxGeometry args={[1.04, 0.05, 0.14]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'students':
        // Refined student registry identity credential slab
        return (
          <group scale={0.8}>
            {/* Base Credential Plate */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.78, 0.55, 0.04]} />
              {platinumMat}
            </mesh>
            {/* Photo Avatar Recess */}
            <mesh position={[-0.22, 0.06, 0.025]}>
              <boxGeometry args={[0.22, 0.26, 0.02]} />
              {darkMat}
            </mesh>
            <mesh position={[-0.22, 0.1, 0.04]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              {platinumMat}
            </mesh>
            {/* Credential Data Lines */}
            <mesh position={[0.12, 0.12, 0.025]}>
              <boxGeometry args={[0.34, 0.03, 0.01]} />
              {darkMat}
            </mesh>
            <mesh position={[0.12, 0.03, 0.025]}>
              <boxGeometry args={[0.34, 0.03, 0.01]} />
              {darkMat}
            </mesh>
            <mesh position={[0.02, -0.12, 0.025]}>
              <boxGeometry args={[0.54, 0.04, 0.01]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'submissions':
        // Refined document & structured data ingestion symbol
        return (
          <group scale={0.8}>
            {/* Secondary Back Sheet */}
            <mesh position={[-0.06, 0.06, -0.02]}>
              <boxGeometry args={[0.62, 0.76, 0.025]} />
              {darkMat}
            </mesh>
            {/* Primary Front Sheet */}
            <mesh position={[0.04, 0, 0.01]}>
              <boxGeometry args={[0.62, 0.76, 0.03]} />
              {platinumMat}
            </mesh>
            {/* Horizontal Ingested Data Stripes */}
            {[-0.15, -0.05, 0.05, 0.15].map((y, idx) => (
              <mesh key={idx} position={[0.04, y, 0.03]}>
                <boxGeometry args={[0.42, 0.03, 0.01]} />
                {darkMat}
              </mesh>
            ))}
            {/* Upward Ingestion Arrow Notch */}
            <mesh position={[0.28, -0.16, 0.05]}>
              <coneGeometry args={[0.08, 0.16, 16]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'apaar':
        // Subtle identity verification symbol: Refined chamfered security shield with check
        return (
          <group scale={0.82}>
            {/* Upper Shield Block */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.66, 0.38, 0.06]} />
              {platinumMat}
            </mesh>
            {/* Lower Shield Triangular Taper */}
            <mesh position={[0, -0.18, 0]} rotation={[0, 0, Math.PI]}>
              <cylinderGeometry args={[0.33, 0.33, 0.06, 3]} />
              {platinumMat}
            </mesh>
            {/* Inner Dark Recess */}
            <mesh position={[0, 0.04, 0.035]}>
              <boxGeometry args={[0.46, 0.44, 0.02]} />
              {darkMat}
            </mesh>
            {/* Central Verification Checkmark / Keyhole */}
            <mesh position={[0, 0.04, 0.05]}>
              <boxGeometry args={[0.18, 0.18, 0.02]} rotation={[0, 0, Math.PI / 4]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'admissions':
        // Refined admission & intake monitoring symbol: 3 graduated capacity bars
        return (
          <group scale={0.8}>
            {/* Base Sanction Line */}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.82, 0.04, 0.08]} />
              {darkMat}
            </mesh>
            {/* Bar 1 */}
            <mesh position={[-0.24, -0.12, 0]}>
              <boxGeometry args={[0.14, 0.28, 0.08]} />
              {platinumMat}
            </mesh>
            {/* Bar 2 */}
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.14, 0.48, 0.08]} />
              {platinumMat}
            </mesh>
            {/* Bar 3 */}
            <mesh position={[0.24, 0.1, 0]}>
              <boxGeometry args={[0.14, 0.72, 0.08]} />
              {platinumMat}
            </mesh>
            {/* Quota Sanction Line Beam */}
            <mesh position={[0, 0.24, 0.05]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[0.78, 0.02, 0.02]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'duplicates':
        // Duplicate detection: Twin overlapping identification discs with central conflict diamond
        return (
          <group scale={0.8}>
            {/* Left Record Disc */}
            <mesh position={[-0.14, 0, -0.01]}>
              <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} />
              {darkMat}
            </mesh>
            {/* Right Record Disc */}
            <mesh position={[0.14, 0, 0.01]}>
              <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} />
              {platinumMat}
            </mesh>
            {/* Conflict Intersection Diamond */}
            <mesh position={[0, 0, 0.04]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.14, 0.14, 0.02]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'compliance':
        // Compliance action: Minimal regulatory balance scale
        return (
          <group scale={0.8}>
            {/* Central Pillar */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.6, 16]} />
              {platinumMat}
            </mesh>
            {/* Horizontal Balance Crossbeam */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.78, 0.03, 0.05]} />
              {platinumMat}
            </mesh>
            {/* Left Pan */}
            <mesh position={[-0.28, 0.06, 0]}>
              <cylinderGeometry args={[0.14, 0.02, 0.03, 16]} />
              {platinumMat}
            </mesh>
            {/* Right Pan */}
            <mesh position={[0.28, 0.1, 0]}>
              <cylinderGeometry args={[0.14, 0.02, 0.03, 16]} />
              {platinumMat}
            </mesh>
            {/* Plinth Base */}
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.4, 0.04, 0.1]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'verification':
        // Student verification: Refined diploma credential scroll with attestation seal
        return (
          <group scale={0.78}>
            {/* Scroll Body */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.65, 0.75, 0.04]} />
              {platinumMat}
            </mesh>
            {/* Rolled Cylinder Margins */}
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
              {platinumMat}
            </mesh>
            <mesh position={[0, -0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
              {platinumMat}
            </mesh>
            {/* Attestation Seal */}
            <mesh position={[0.14, -0.15, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 20]} />
              {darkMat}
            </mesh>
            <mesh position={[0.14, -0.15, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'reports':
        // Reports & Analytics: Precision geometric analytics prism
        return (
          <group scale={0.8}>
            <mesh position={[0, 0.02, 0]}>
              <octahedronGeometry args={[0.38, 0]} />
              {platinumMat}
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[0.48, 0.04, 0.12]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'audit':
        // Audit & Security: Precision architectural padlock
        return (
          <group scale={0.8}>
            {/* Torus Shackle Arch */}
            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[0.18, 0.04, 16, 24, Math.PI]} />
              {platinumMat}
            </mesh>
            {/* Solid Padlock Body */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[0.56, 0.44, 0.16]} />
              {platinumMat}
            </mesh>
            {/* Micro Keyhole Slit */}
            <mesh position={[0, -0.1, 0.09]}>
              <boxGeometry args={[0.06, 0.12, 0.02]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'integration':
      default:
        // System Integration: Precision intermeshed gear set
        return (
          <group scale={0.78}>
            {/* Main Primary Gear */}
            <mesh position={[-0.12, 0.08, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.06, 12]} rotation={[Math.PI / 2, 0, 0]} />
              {platinumMat}
            </mesh>
            {/* Secondary Gear */}
            <mesh position={[0.22, -0.14, 0.02]}>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 10]} rotation={[Math.PI / 2, 0, 0]} />
              {platinumMat}
            </mesh>
            {/* Central Axles */}
            <mesh position={[-0.12, 0.08, 0.04]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
              {darkMat}
            </mesh>
          </group>
        );
    }
  };

  return (
    <group position={[0, 1.05, 0.08]}>
      {renderSymbol()}
    </group>
  );
};

export const FloatingModulePod: React.FC<FloatingModulePodProps> = ({
  id,
  title,
  subtitle,
  category,
  position,
  onSelect,
  isActive,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth, damped horizontal focus easing:
  // Focused module moves gently toward the camera; adjacent modules recede into background.
  useFrame((state) => {
    if (!groupRef.current) return;
    const camX = state.camera.position.x;
    const dist = Math.abs(camX - position[0]);
    const isFocused = dist < 2.0;

    // Restrained Z-depth shift: focused pod glides slightly forward, outer pods recede
    const targetZ = isFocused
      ? (hovered ? 0.45 : 0.32)
      : -Math.min(1.1, (dist - 1.8) * 0.22);

    // Subtle, consistent vertical alignment (no wobbling or bouncing)
    const targetY = position[1] + (hovered ? 0.06 : 0);

    // Smooth lerp (damped easing)
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.08
    );

    // Controlled scale focus
    const targetScale = isFocused ? 1.015 : THREE.MathUtils.lerp(1.0, 0.94, Math.min(1, (dist - 1.8) / 5));
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
    groupRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* 1. Natural Soft Ambient Occlusion Contact Shadow directly below slab */}
      <mesh position={[0, -2.25, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1, 0.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* 2. Refined Architectural Charcoal Slab (Deep Matte-Black & Graphite) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 4.4, 0.08]} />
        <meshStandardMaterial
          color="#0E1116"
          roughness={0.68}
          metalness={0.22}
        />
      </mesh>

      {/* 3. Extremely Thin Platinum Hairline Border (1px Equivalent Precision Edge) */}
      <group position={[0, 0, 0.042]}>
        {/* Top hairline */}
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[3.2, 0.012, 0.006]} />
          <meshStandardMaterial
            color={hovered || isActive ? '#FFFFFF' : '#8E95A2'}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
        {/* Bottom hairline */}
        <mesh position={[0, -2.2, 0]}>
          <boxGeometry args={[3.2, 0.012, 0.006]} />
          <meshStandardMaterial
            color={hovered || isActive ? '#FFFFFF' : '#5A6270'}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
        {/* Left hairline */}
        <mesh position={[-1.6, 0, 0]}>
          <boxGeometry args={[0.012, 4.4, 0.006]} />
          <meshStandardMaterial
            color={hovered || isActive ? '#FFFFFF' : '#5A6270'}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
        {/* Right hairline */}
        <mesh position={[1.6, 0, 0]}>
          <boxGeometry args={[0.012, 4.4, 0.006]} />
          <meshStandardMaterial
            color={hovered || isActive ? '#FFFFFF' : '#5A6270'}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </group>

      {/* 4. Subtle Category Tag at Top */}
      {category && (
        <Text
          position={[0, 1.82, 0.06]}
          fontSize={0.105}
          letterSpacing={0.12}
          color="#8E95A2"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {category.toUpperCase()}
        </Text>
      )}

      {/* 5. Small, Carefully Crafted Platinum 3D Symbol (Secondary to Title) */}
      <ModuleSymbol id={id} hovered={hovered} />

      {/* 6. Module Title (High-Contrast White Inter) */}
      <Text
        position={[0, -0.08, 0.06]}
        fontSize={0.21}
        maxWidth={2.8}
        lineHeight={1.2}
        color={hovered || isActive ? '#FFFFFF' : '#F1F3F5'}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
      </Text>

      {/* 7. Module Subtitle / Functional Description (Liquid Silver) */}
      <Text
        position={[0, -0.62, 0.06]}
        fontSize={0.12}
        maxWidth={2.7}
        lineHeight={1.4}
        color="#9BA1AA"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {subtitle}
      </Text>

      {/* 8. Refined Interactive Action Button */}
      <group position={[0, -1.48, 0.06]}>
        {/* Button Charcoal Base */}
        <mesh>
          <boxGeometry args={[2.3, 0.44, 0.02]} />
          <meshStandardMaterial
            color={hovered ? '#1E232D' : '#14171E'}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        {/* Button Fine Perimeter Line */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[2.3, 0.44, 0.002]} />
          <meshBasicMaterial
            color={hovered ? '#CBD5E1' : '#2A303C'}
            wireframe
          />
        </mesh>
        {/* Button Label */}
        <Text
          position={[0, 0, 0.025]}
          fontSize={0.12}
          letterSpacing={0.06}
          color={hovered ? '#FFFFFF' : '#D2D6DC'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? 'Access Workspace  →' : 'Open Module  →'}
        </Text>
      </group>
    </group>
  );
};
