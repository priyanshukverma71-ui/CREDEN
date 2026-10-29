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

  // Gentle floating animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 1.5 + position[0]) * 0.08;
    const targetY = position[1] + (hovered ? 0.25 : 0) + floatOffset;
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
      {/* 1. Base Pedestal: Circular Floating Platinum Disc */}
      <group position={[0, -2.1, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[1.5, 1.7, 0.12, 32]} />
          <meshStandardMaterial
            color="#111317"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing Platinum Outer Ring */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.6, 32]} />
          <meshBasicMaterial
            color={hovered || isActive ? '#FFFFFF' : '#D4D7DC'}
            transparent
            opacity={hovered || isActive ? 0.7 : 0.3}
          />
        </mesh>
      </group>

      {/* 2. Main Floating Smoked Glass Panel */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 3.8, 0.15]} />
        <meshStandardMaterial
          color="#08090B"
          metalness={0.3}
          roughness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 3. Panel Bevel Border in Highlight Silver / Platinum */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[3.25, 3.85, 0.02]} />
        <meshStandardMaterial
          color={hovered || isActive ? '#FFFFFF' : '#D4D7DC'}
          metalness={0.95}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* 4. Embossed 3D Metallic Module Icon (Geometric architectural representation) */}
      <group position={[0, 0.8, 0.15]}>
        {/* Outer Icon Shield/Disc */}
        <mesh castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color={hovered ? '#F1F3F5' : '#D4D7DC'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Core emblem geometry */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.45, 0.45, 0.06]} />
          <meshStandardMaterial
            color="#111317"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* 5. Typography: Module Title */}
      <Text
        position={[0, -0.4, 0.12]}
        fontSize={0.24}
        maxWidth={2.8}
        lineHeight={1.2}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color={hovered || isActive ? '#FFFFFF' : '#F1F3F5'}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
      </Text>

      {/* 6. Typography: Module Subtitle */}
      <Text
        position={[0, -0.95, 0.12]}
        fontSize={0.13}
        maxWidth={2.6}
        lineHeight={1.3}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color="#9299A3"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {subtitle}
      </Text>

      {/* 7. Action Indicator Pill / Arrow */}
      <group position={[0, -1.45, 0.12]}>
        <mesh>
          <circleGeometry args={[0.22, 24]} />
          <meshStandardMaterial
            color={hovered ? '#FFFFFF' : '#1A1D22'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0.02, 0, 0.02]}
          fontSize={0.2}
          color={hovered ? '#08090B' : '#D4D7DC'}
          anchorX="center"
          anchorY="middle"
        >
          {'>'}
        </Text>
      </group>
    </group>
  );
};
