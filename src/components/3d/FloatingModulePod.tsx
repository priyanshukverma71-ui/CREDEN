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

// VisionOS Module Vibrant Color Palette
const MODULE_COLORS: Record<ModuleId, { primary: string; secondary: string }> = {
  overview: { primary: '#2563EB', secondary: '#1D4ED8' },
  institutions: { primary: '#2563EB', secondary: '#1E40AF' },
  students: { primary: '#059669', secondary: '#047857' },
  submissions: { primary: '#0284C7', secondary: '#0369A1' },
  apaar: { primary: '#7C3AED', secondary: '#6D28D9' },
  admissions: { primary: '#D97706', secondary: '#B45309' },
  duplicates: { primary: '#E11D48', secondary: '#BE123C' },
  compliance: { primary: '#DC2626', secondary: '#B91C1C' },
  verification: { primary: '#0D9488', secondary: '#0F766E' },
  reports: { primary: '#4F46E5', secondary: '#4338CA' },
  audit: { primary: '#334155', secondary: '#1E293B' },
  integration: { primary: '#8B5CF6', secondary: '#7C3AED' },
  settings: { primary: '#475569', secondary: '#334155' },
};

// -------------------------------------------------------------
// Liquid Glass Colorful Round Symbol with 3D White Logo
// -------------------------------------------------------------
const ColorfulRoundSymbol: React.FC<{ id: ModuleId; hovered: boolean }> = ({ id, hovered }) => {
  const meshRef = useRef<THREE.Group>(null);
  const colorData = MODULE_COLORS[id] || { primary: '#2563EB', secondary: '#1D4ED8' };

  // Floating gentle levitation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = 1.05 + (hovered ? 0.08 : 0) + Math.sin(time * 2 + 1) * 0.02;
  });

  const whiteLogoMat = (
    <meshStandardMaterial
      color="#FFFFFF"
      metalness={0.9}
      roughness={0.12}
      emissive="#E2E8F0"
      emissiveIntensity={0.2}
    />
  );

  const renderLogoGeometry = () => {
    switch (id) {
      case 'institutions':
        // Neoclassical pediment & 4 slender columns in white
        return (
          <group scale={0.72} position={[0, 0, 0.06]}>
            <mesh position={[0, 0.36, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.07, 3]} rotation={[0, 0, Math.PI]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.85, 0.04, 0.08]} />
              {whiteLogoMat}
            </mesh>
            {[-0.28, -0.09, 0.09, 0.28].map((x, idx) => (
              <mesh key={idx} position={[x, -0.04, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.42, 16]} />
                {whiteLogoMat}
              </mesh>
            ))}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.9, 0.05, 0.1]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'students':
        // Student registry ID card in white
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.72, 0.52, 0.04]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[-0.2, 0.06, 0.03]}>
              <boxGeometry args={[0.2, 0.24, 0.02]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[0.12, 0.1, 0.03]}>
              <boxGeometry args={[0.3, 0.03, 0.01]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[0.12, 0.02, 0.03]}>
              <boxGeometry args={[0.3, 0.03, 0.01]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          </group>
        );

      case 'submissions':
        // Layered document with upward ingestion arrow
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[-0.05, 0.05, -0.02]}>
              <boxGeometry args={[0.56, 0.7, 0.02]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[0.04, 0, 0.01]}>
              <boxGeometry args={[0.56, 0.7, 0.03]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0.24, -0.12, 0.04]}>
              <coneGeometry args={[0.08, 0.18, 16]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'apaar':
        // Chamfered security shield with check
        return (
          <group scale={0.78} position={[0, 0, 0.06]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.62, 0.36, 0.05]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, -0.16, 0]} rotation={[0, 0, Math.PI]}>
              <cylinderGeometry args={[0.31, 0.31, 0.05, 3]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, 0.02, 0.04]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.16, 0.16, 0.02]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'admissions':
        // 3 stepped intake capacity bars
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[0, -0.26, 0]}>
              <boxGeometry args={[0.76, 0.04, 0.06]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[-0.22, -0.12, 0]}>
              <boxGeometry args={[0.13, 0.26, 0.06]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.13, 0.44, 0.06]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0.22, 0.1, 0]}>
              <boxGeometry args={[0.13, 0.68, 0.06]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'duplicates':
        // Twin overlapping record discs
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[-0.14, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.03, 24]} rotation={[Math.PI / 2, 0, 0]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0.14, 0, 0.02]}>
              <cylinderGeometry args={[0.24, 0.24, 0.03, 24]} rotation={[Math.PI / 2, 0, 0]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'compliance':
        // Regulatory balance scale
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.035, 0.58, 16]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.74, 0.03, 0.04]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[-0.26, 0.06, 0]}>
              <cylinderGeometry args={[0.12, 0.02, 0.03, 16]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0.26, 0.1, 0]}>
              <cylinderGeometry args={[0.12, 0.02, 0.03, 16]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'verification':
        // Diploma credential scroll with seal
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.62, 0.72, 0.03]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.68, 16]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, -0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.68, 16]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0.14, -0.15, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 20]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'reports':
        // Analytics octahedron prism
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[0, 0.02, 0]}>
              <octahedronGeometry args={[0.36, 0]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'audit':
        // Cryptographic security padlock
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[0, 0.2, 0]}>
              <torusGeometry args={[0.16, 0.035, 16, 24, Math.PI]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.52, 0.4, 0.12]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );

      case 'integration':
      default:
        // Interlocking gear set
        return (
          <group scale={0.75} position={[0, 0, 0.06]}>
            <mesh position={[-0.1, 0.08, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.05, 12]} rotation={[Math.PI / 2, 0, 0]} />
              {whiteLogoMat}
            </mesh>
            <mesh position={[0.2, -0.12, 0.02]}>
              <cylinderGeometry args={[0.16, 0.16, 0.04, 10]} rotation={[Math.PI / 2, 0, 0]} />
              {whiteLogoMat}
            </mesh>
          </group>
        );
    }
  };

  return (
    <group ref={meshRef} position={[0, 1.05, 0.08]}>
      {/* 1. Vibrant Colorful Round Squircle Disc */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.54, 0.08, 36]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color={colorData.primary}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Frosted Glass Bevel Halo Rim */}
      <mesh position={[0, 0, 0.042]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.53, 0.58, 36]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>

      {/* 3. 3D White Logo Geometry */}
      {renderLogoGeometry()}
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

  // Smooth, damped horizontal focus easing
  useFrame((state) => {
    if (!groupRef.current) return;
    const camX = state.camera.position.x;
    const dist = Math.abs(camX - position[0]);
    const isFocused = dist < 2.0;

    const targetZ = isFocused
      ? (hovered ? 0.45 : 0.32)
      : -Math.min(1.1, (dist - 1.8) * 0.22);

    const targetY = position[1] + (hovered ? 0.06 : 0);

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
      {/* 1. Soft Light Studio Ambient Shadow directly below slab */}
      <mesh position={[0, -2.25, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 0.55]} />
        <meshBasicMaterial color="#64748B" transparent opacity={0.16} />
      </mesh>

      {/* 2. VisionOS Liquid Glass Slab (Crystal Clear Glass with High Transmission) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 4.4, 0.08]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.05}
          transmission={0.92}
          thickness={0.7}
          ior={1.5}
          transparent
          opacity={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* 3. Pure White Specular Rim Border */}
      <group position={[0, 0, 0.042]}>
        {/* Top edge */}
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[3.2, 0.016, 0.008]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Bottom edge */}
        <mesh position={[0, -2.2, 0]}>
          <boxGeometry args={[3.2, 0.012, 0.006]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        {/* Left edge */}
        <mesh position={[-1.6, 0, 0]}>
          <boxGeometry args={[0.012, 4.4, 0.006]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        {/* Right edge */}
        <mesh position={[1.6, 0, 0]}>
          <boxGeometry args={[0.012, 4.4, 0.006]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
      </group>

      {/* 4. Category Tag at Top */}
      {category && (
        <Text
          position={[0, 1.82, 0.06]}
          fontSize={0.105}
          letterSpacing={0.12}
          color="#64748B"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {category.toUpperCase()}
        </Text>
      )}

      {/* 5. Liquid Glass Colorful Round Symbol with White Logo in Floating Style */}
      <ColorfulRoundSymbol id={id} hovered={hovered} />

      {/* 6. Module Title (High-Contrast Slate Black Inter) */}
      <Text
        position={[0, -0.08, 0.06]}
        fontSize={0.21}
        maxWidth={2.8}
        lineHeight={1.2}
        color={hovered || isActive ? '#0F172A' : '#1E293B'}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
      </Text>

      {/* 7. Module Subtitle (Legible Slate Gray) */}
      <Text
        position={[0, -0.62, 0.06]}
        fontSize={0.12}
        maxWidth={2.7}
        lineHeight={1.4}
        color="#475569"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {subtitle}
      </Text>

      {/* 8. Frosted Liquid Glass Action Button */}
      <group position={[0, -1.48, 0.06]}>
        <mesh>
          <boxGeometry args={[2.3, 0.44, 0.02]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.15}
            transmission={0.88}
            transparent
            opacity={0.95}
          />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[2.3, 0.44, 0.002]} />
          <meshBasicMaterial color="#CBD5E1" wireframe />
        </mesh>
        <Text
          position={[0, 0, 0.025]}
          fontSize={0.12}
          letterSpacing={0.06}
          color={hovered ? '#000000' : '#0F172A'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? 'Access Workspace  →' : 'Open Module  →'}
        </Text>
      </group>
    </group>
  );
};
