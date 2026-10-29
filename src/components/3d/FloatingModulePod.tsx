import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ModuleId } from '../../types';

interface FloatingModulePodProps {
  id: ModuleId;
  title: string;
  subtitle: string;
  position: [number, number, number];
  onSelect: (id: ModuleId) => void;
  isActive: boolean;
}

// 3D Architectural / Symbolic Sculptures for Each Module
const ModuleSculpture: React.FC<{ id: ModuleId; hovered: boolean }> = ({ id, hovered }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(time * 0.8) * 0.15;
    if (hovered) {
      meshRef.current.position.y = 0.95 + Math.sin(time * 3) * 0.05;
    } else {
      meshRef.current.position.y = 0.9;
    }
  });

  const platinumMat = (
    <meshStandardMaterial
      color="#F8FAFC"
      metalness={0.95}
      roughness={0.12}
      emissive="#334155"
      emissiveIntensity={0.25}
    />
  );

  const darkMat = (
    <meshStandardMaterial
      color="#1E232D"
      metalness={0.85}
      roughness={0.25}
    />
  );

  const renderIconGeometry = () => {
    switch (id) {
      case 'institutions':
        // Classical Greek / Academic Temple
        return (
          <group scale={0.75}>
            {/* Base Steps */}
            <mesh position={[0, -0.4, 0]}>
              <boxGeometry args={[1.5, 0.08, 0.9]} />
              {platinumMat}
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[1.35, 0.08, 0.8]} />
              {platinumMat}
            </mesh>
            {/* 4 Pillars */}
            {[-0.45, -0.15, 0.15, 0.45].map((x, idx) => (
              <mesh key={idx} position={[x, 0, 0.2]}>
                <cylinderGeometry args={[0.06, 0.07, 0.55, 16]} />
                {platinumMat}
              </mesh>
            ))}
            {/* Architrave & Pediment */}
            <mesh position={[0, 0.32, 0.2]}>
              <boxGeometry args={[1.35, 0.08, 0.5]} />
              {platinumMat}
            </mesh>
            <mesh position={[0, 0.52, 0.2]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.42, 0.42, 0.4]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'students':
      case 'submissions':
        // Layered Document Stack with Upward Ingestion Arrow
        return (
          <group scale={0.75}>
            {/* Back sheet */}
            <mesh position={[-0.1, 0.05, -0.05]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.8, 1.0, 0.04]} />
              {darkMat}
            </mesh>
            {/* Front sheet */}
            <mesh position={[0.05, 0, 0.05]}>
              <boxGeometry args={[0.8, 1.0, 0.05]} />
              {platinumMat}
            </mesh>
            {/* Embossed Text stripes on front sheet */}
            <mesh position={[0.05, 0.2, 0.09]}>
              <boxGeometry args={[0.5, 0.04, 0.02]} />
              {darkMat}
            </mesh>
            <mesh position={[0.05, 0.05, 0.09]}>
              <boxGeometry args={[0.5, 0.04, 0.02]} />
              {darkMat}
            </mesh>
            {/* Upward Ingestion Arrow */}
            <group position={[0.35, -0.15, 0.15]}>
              <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.28, 16]} />
                {platinumMat}
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <coneGeometry args={[0.18, 0.25, 16]} />
                {platinumMat}
              </mesh>
            </group>
          </group>
        );

      case 'apaar':
        // 3D National ID Badge Card & Checkmark Shield
        return (
          <group scale={0.75}>
            {/* Card plate */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 0.85, 0.06]} />
              {platinumMat}
            </mesh>
            {/* Photo / Avatar plate */}
            <mesh position={[-0.32, 0.05, 0.05]}>
              <boxGeometry args={[0.35, 0.45, 0.04]} />
              {darkMat}
            </mesh>
            <mesh position={[-0.32, 0.15, 0.08]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              {platinumMat}
            </mesh>
            {/* Info stripes */}
            <mesh position={[0.18, 0.15, 0.05]}>
              <boxGeometry args={[0.45, 0.05, 0.02]} />
              {darkMat}
            </mesh>
            <mesh position={[0.18, 0.02, 0.05]}>
              <boxGeometry args={[0.45, 0.05, 0.02]} />
              {darkMat}
            </mesh>
            {/* APAAR Number Barcode stripe */}
            <mesh position={[0, -0.22, 0.05]}>
              <boxGeometry args={[0.9, 0.08, 0.02]} />
              {darkMat}
            </mesh>
            {/* Checkmark Badge */}
            <mesh position={[0.42, 0.28, 0.1]}>
              <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} rotation={[Math.PI / 2, 0, 0]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'admissions':
        // 3D Ascending Bar Chart & Trend Slope
        return (
          <group scale={0.75}>
            {/* Base ground plate */}
            <mesh position={[0, -0.4, 0]}>
              <boxGeometry args={[1.2, 0.06, 0.5]} />
              {darkMat}
            </mesh>
            {/* Bar 1 */}
            <mesh position={[-0.35, -0.15, 0]}>
              <boxGeometry args={[0.18, 0.4, 0.18]} />
              {platinumMat}
            </mesh>
            {/* Bar 2 */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.18, 0.7, 0.18]} />
              {platinumMat}
            </mesh>
            {/* Bar 3 */}
            <mesh position={[0.35, 0.18, 0]}>
              <boxGeometry args={[0.18, 1.05, 0.18]} />
              {platinumMat}
            </mesh>
            {/* Trend Arrow Beam */}
            <mesh position={[0, 0.1, 0.15]} rotation={[0, 0, 0.6]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 16]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'duplicates':
        // Twin User Silhouettes & Magnifying Ring
        return (
          <group scale={0.75}>
            {/* User A */}
            <group position={[-0.2, -0.05, -0.05]}>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.18, 20, 20]} />
                {platinumMat}
              </mesh>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.1, 0.28, 0.4, 20]} />
                {platinumMat}
              </mesh>
            </group>
            {/* User B */}
            <group position={[0.2, -0.05, 0.05]}>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.18, 20, 20]} />
                {darkMat}
              </mesh>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.1, 0.28, 0.4, 20]} />
                {darkMat}
              </mesh>
            </group>
            {/* Magnifying Glass Ring */}
            <mesh position={[0.05, 0.12, 0.2]} rotation={[0, 0, -0.3]}>
              <torusGeometry args={[0.32, 0.04, 16, 32]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'compliance':
        // Chiseled Security Shield & Embossed Crest
        return (
          <group scale={0.75}>
            {/* Main Shield Body */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.55, 0.05, 1.0, 3]} rotation={[0, 0, Math.PI]} />
              {platinumMat}
            </mesh>
            {/* Inner Crest Plate */}
            <mesh position={[0, 0.05, 0.06]}>
              <cylinderGeometry args={[0.42, 0.05, 0.8, 3]} rotation={[0, 0, Math.PI]} />
              {darkMat}
            </mesh>
            {/* Center Checkmark / Scale */}
            <mesh position={[0, 0.08, 0.12]}>
              <octahedronGeometry args={[0.18, 0]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'verification':
        // Academic Certificate Scroll & Ribbon
        return (
          <group scale={0.75}>
            {/* Scroll Body */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.9, 1.1, 0.06]} />
              {platinumMat}
            </mesh>
            {/* Rolled Cylinder top & bottom */}
            <mesh position={[-0.1, 0.56, 0]} rotation={[0, 0, Math.PI / 2 + 0.2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.95, 20]} />
              {platinumMat}
            </mesh>
            <mesh position={[0.1, -0.56, 0]} rotation={[0, 0, Math.PI / 2 + 0.2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.95, 20]} />
              {platinumMat}
            </mesh>
            {/* Attestation Seal Ribbon */}
            <mesh position={[0.15, -0.15, 0.1]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} rotation={[Math.PI / 2, 0, 0]} />
              {platinumMat}
            </mesh>
          </group>
        );

      case 'reports':
        // 3D Faceted Analytics Prism & Polyhedron
        return (
          <group scale={0.75}>
            {/* Central Diamond Octahedron */}
            <mesh position={[0, 0.1, 0]}>
              <octahedronGeometry args={[0.5, 0]} />
              {platinumMat}
            </mesh>
            {/* Outer Orbital Ring */}
            <mesh position={[0, 0.1, 0]} rotation={[1.1, 0.4, 0]}>
              <torusGeometry args={[0.75, 0.035, 16, 48]} />
              {platinumMat}
            </mesh>
            {/* Base Stand */}
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.12, 24]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'audit':
        // Heavy Metallic Padlock
        return (
          <group scale={0.75}>
            {/* Shackle (Torus segment) */}
            <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
              {platinumMat}
            </mesh>
            {/* Padlock Body */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[0.8, 0.65, 0.32]} />
              {platinumMat}
            </mesh>
            {/* Keyhole Cylinder */}
            <mesh position={[0, -0.1, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
              {darkMat}
            </mesh>
          </group>
        );

      case 'integration':
      default:
        // Interlocking Mechanical Gears
        return (
          <group scale={0.75}>
            {/* Main Gear */}
            <mesh position={[-0.15, 0.1, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.12, 12]} />
              {platinumMat}
            </mesh>
            <mesh position={[-0.15, 0.1, 0.08]}>
              <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
              {darkMat}
            </mesh>
            {/* Secondary Gear */}
            <mesh position={[0.32, -0.2, 0.02]} rotation={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.28, 0.28, 0.1, 10]} />
              {platinumMat}
            </mesh>
          </group>
        );
    }
  };

  return (
    <group ref={meshRef} position={[0, 0.9, 0.18]}>
      {/* Background Circular Halo Disc */}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#0F131A"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Halo Rim Highlight */}
      <mesh position={[0, 0, -0.02]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.82, 0.88, 32]} />
        <meshBasicMaterial color={hovered ? '#FFFFFF' : '#CBD5E1'} transparent opacity={0.6} />
      </mesh>

      {/* Render module-specific 3D sculpture */}
      {renderIconGeometry()}
    </group>
  );
};

export const FloatingModulePod: React.FC<FloatingModulePodProps> = ({
  id,
  title,
  subtitle,
  position,
  onSelect,
  isActive,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth floating bob animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 1.5 + position[0] * 0.5) * 0.09;
    const targetY = position[1] + (hovered ? 0.3 : 0) + floatOffset;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.1
    );
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
      {/* 1. Base Multi-Tier Floating Disc Pedestal */}
      <group position={[0, -2.4, 0]}>
        {/* Tier 1: Outer metallic disc */}
        <mesh receiveShadow>
          <cylinderGeometry args={[1.7, 1.9, 0.12, 48]} />
          <meshStandardMaterial
            color="#141822"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        {/* Tier 2: Stepped inner chrome pedestal */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[1.3, 1.45, 0.08, 48]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.98}
            roughness={0.08}
            emissive="#334155"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Tier 3: Glowing Platinum Light Halo */}
        <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.25, 48]} />
          <meshBasicMaterial
            color={hovered || isActive ? '#FFFFFF' : '#CBD5E1'}
            transparent
            opacity={hovered || isActive ? 0.95 : 0.65}
          />
        </mesh>
      </group>

      {/* 2. Main Floating Smoked Glass Panel */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 4.2, 0.12]} />
        <meshStandardMaterial
          color="#0F1218"
          metalness={0.65}
          roughness={0.12}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 3. Outer Chamfered Beveled Platinum Border */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[3.45, 4.25, 0.04]} />
        <meshStandardMaterial
          color={hovered || isActive ? '#FFFFFF' : '#E2E8F0'}
          metalness={0.96}
          roughness={0.08}
          emissive={hovered || isActive ? '#64748B' : '#1E293B'}
          emissiveIntensity={0.4}
          wireframe
        />
      </mesh>

      {/* 4. Glass Surface Subtle Specular Sheen (Horizontal accent line) */}
      <mesh position={[0, 1.95, 0.07]}>
        <boxGeometry args={[3.2, 0.04, 0.02]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={hovered ? 0.9 : 0.5} />
      </mesh>

      {/* 5. 3D Sculptural Emblem Area */}
      <ModuleSculpture id={id} hovered={hovered} />

      {/* 6. Typography: Module Title (White, High-Contrast) */}
      <Text
        position={[0, -0.45, 0.14]}
        fontSize={0.24}
        maxWidth={2.8}
        lineHeight={1.2}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color={hovered || isActive ? '#FFFFFF' : '#F8FAFC'}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
      </Text>

      {/* 7. Typography: Module Description / Subtitle (Liquid Silver) */}
      <Text
        position={[0, -0.95, 0.14]}
        fontSize={0.125}
        maxWidth={2.8}
        lineHeight={1.35}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color="#CBD5E1"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {subtitle}
      </Text>

      {/* 8. Circular Right Arrow Action Pill (Matches Reference Image) */}
      <group position={[1.25, -0.45, 0.14]}>
        {/* Circle ring */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color={hovered ? '#FFFFFF' : '#334155'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* '>' Arrow indicator */}
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.18}
          color={hovered ? '#08090B' : '#F1F3F5'}
          anchorX="center"
          anchorY="middle"
        >
          {'>'}
        </Text>
      </group>
    </group>
  );
};
