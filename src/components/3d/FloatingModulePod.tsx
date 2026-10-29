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
// Bright, Professional Operating System Palette (Material-Inspired)
// -------------------------------------------------------------
export const MODULE_PALETTE: Record<
  string,
  {
    primary: string;    // Vibrant brand color
    light: string;      // Soft pastel background
    badgeText: string;  // Darker shade for readable category text
    label: string;      // Default category label
  }
> = {
  institutions: {
    primary: '#4285F4', // Google Blue
    light: '#D7E9FF',   // Sky blue
    badgeText: '#1D4ED8',
    label: 'INSTITUTIONAL OVERSIGHT',
  },
  submissions: {
    primary: '#34A853', // Google Green
    light: '#D8F3E4',   // Mint
    badgeText: '#047857',
    label: 'STUDENT DATA OPS',
  },
  apaar: {
    primary: '#7C3AED', // Lavender / Violet
    light: '#DCD7FF',   // Lavender
    badgeText: '#6D28D9',
    label: 'VERIFICATION & INTEGRITY',
  },
  admissions: {
    primary: '#FBBC04', // Google Yellow
    light: '#FEF3C7',   // Light yellow
    badgeText: '#B45309',
    label: 'INSTITUTIONAL OVERSIGHT',
  },
  duplicates: {
    primary: '#EA4335', // Google Coral Red
    light: '#FEE2E2',   // Soft coral
    badgeText: '#B91C1C',
    label: 'VERIFICATION & INTEGRITY',
  },
  compliance: {
    primary: '#0D9488', // Teal
    light: '#CCFBF1',   // Soft teal
    badgeText: '#0F766E',
    label: 'REGULATORY COMPLIANCE',
  },
  verification: {
    primary: '#4F46E5', // Blue-violet
    light: '#E0E7FF',   // Soft blue-violet
    badgeText: '#4338CA',
    label: 'ATTESTATION BUREAU',
  },
  reports: {
    primary: '#4285F4', // Multi / Blue
    light: '#E0F2FE',   // Multi tint
    badgeText: '#0369A1',
    label: 'ASSURANCE & INTEGRATION',
  },
  audit: {
    primary: '#1E3A8A', // Deep-blue
    light: '#DBEAFE',   // Light blue
    badgeText: '#1E40AF',
    label: 'SECURITY ASSURANCE',
  },
  integration: {
    primary: '#10B981', // Mint
    light: '#D1FAE5',   // Soft mint
    badgeText: '#065F46',
    label: 'SYSTEM GATEWAYS',
  },
  // Fallbacks
  students: {
    primary: '#34A853',
    light: '#D8F3E4',
    badgeText: '#047857',
    label: 'STUDENT DATA OPS',
  },
  overview: {
    primary: '#4285F4',
    light: '#D7E9FF',
    badgeText: '#1D4ED8',
    label: 'NATIONAL OVERSIGHT',
  },
};

// -------------------------------------------------------------
// Carefully Modelled Colourful 3D Symbols with Real Depth
// -------------------------------------------------------------
const Distinct3DSymbol: React.FC<{ id: ModuleId; hovered: boolean }> = ({ id, hovered }) => {
  const meshRef = useRef<THREE.Group>(null);
  const meta = MODULE_PALETTE[id] || MODULE_PALETTE.institutions;

  // Gentle, floating levitation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = 0.95 + (hovered ? 0.08 : 0) + Math.sin(time * 2 + 1) * 0.02;
    meshRef.current.rotation.y = Math.sin(time * 0.8) * 0.06;
  });

  const renderSymbolModel = () => {
    switch (id) {
      case 'institutions':
        // 1. Institution Management — Blue Architectural Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Triangular Pediment Gable */}
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 3]} rotation={[0, 0, Math.PI]} />
              <meshStandardMaterial color="#4285F4" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Golden apex medallion */}
            <mesh position={[0, 0.44, 0.04]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FBBC04" roughness={0.2} metalness={0.4} />
            </mesh>
            {/* White Entablature Beam */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.92, 0.06, 0.12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.05} />
            </mesh>
            {/* 4 Classical Columns */}
            {[-0.32, -0.11, 0.11, 0.32].map((x, idx) => (
              <group key={idx} position={[x, -0.06, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.038, 0.038, 0.46, 16]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.05} />
                </mesh>
                {/* Column capital & base rings */}
                <mesh position={[0, 0.22, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
                  <meshStandardMaterial color="#D7E9FF" roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.22, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
                  <meshStandardMaterial color="#D7E9FF" roughness={0.2} />
                </mesh>
              </group>
            ))}
            {/* Stepped Two-tier Base */}
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[0.96, 0.05, 0.14]} />
              <meshStandardMaterial color="#1E3A8A" roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <boxGeometry args={[1.04, 0.06, 0.18]} />
              <meshStandardMaterial color="#4285F4" roughness={0.2} metalness={0.1} />
            </mesh>
          </group>
        );

      case 'submissions':
        // 2. Student Data Submission — Green Document & Ingestion Arrow Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Back sheet */}
            <mesh position={[-0.06, 0.06, -0.02]} rotation={[0, 0, 0.04]}>
              <boxGeometry args={[0.62, 0.78, 0.02]} />
              <meshStandardMaterial color="#D8F3E4" roughness={0.3} />
            </mesh>
            {/* Primary Document Sheet */}
            <mesh position={[0.02, 0, 0]}>
              <boxGeometry args={[0.62, 0.78, 0.04]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.05} />
            </mesh>
            {/* Document Header Band */}
            <mesh position={[0.02, 0.28, 0.025]}>
              <boxGeometry args={[0.54, 0.1, 0.01]} />
              <meshStandardMaterial color="#34A853" roughness={0.2} />
            </mesh>
            {/* Data rows in relief */}
            {[-0.04, -0.16, -0.28].map((y, idx) => (
              <mesh key={idx} position={[0.02, y, 0.025]}>
                <boxGeometry args={[0.48 - idx * 0.06, 0.035, 0.008]} />
                <meshStandardMaterial color="#A7F3D0" roughness={0.3} />
              </mesh>
            ))}
            {/* Dynamic Upward Ingestion Arrow Badge */}
            <group position={[0.22, -0.18, 0.06]}>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#34A853" roughness={0.2} metalness={0.1} />
              </mesh>
              {/* Arrow stem */}
              <mesh position={[0, -0.04, 0.03]}>
                <boxGeometry args={[0.05, 0.14, 0.015]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              {/* Arrow head */}
              <mesh position={[0, 0.07, 0.03]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.08, 0.015]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          </group>
        );

      case 'apaar':
        // 3. APAAR ID Validation — Lavender Identity Card & Checkmark Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* ID Card Base */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.82, 0.58, 0.05]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.05} />
            </mesh>
            {/* Lavender Header Banner */}
            <mesh position={[0, 0.21, 0.028]}>
              <boxGeometry args={[0.82, 0.14, 0.01]} />
              <meshStandardMaterial color="#7C3AED" roughness={0.2} />
            </mesh>
            {/* Student Photo Avatar Silhouette */}
            <mesh position={[-0.24, -0.04, 0.03]}>
              <cylinderGeometry args={[0.12, 0.12, 0.01, 20]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#DCD7FF" roughness={0.25} />
            </mesh>
            {/* Golden Chip */}
            <mesh position={[0.02, 0.04, 0.03]}>
              <boxGeometry args={[0.14, 0.1, 0.01]} />
              <meshStandardMaterial color="#FBBC04" metalness={0.6} roughness={0.2} />
            </mesh>
            {/* Text lines */}
            <mesh position={[0.14, -0.08, 0.03]}>
              <boxGeometry args={[0.34, 0.03, 0.008]} />
              <meshBasicMaterial color="#7C3AED" />
            </mesh>
            <mesh position={[0.1, -0.16, 0.03]}>
              <boxGeometry args={[0.26, 0.03, 0.008]} />
              <meshBasicMaterial color="#9CA3AF" />
            </mesh>
            {/* Verification Checkmark Badge */}
            <group position={[0.32, -0.22, 0.05]}>
              <mesh>
                <cylinderGeometry args={[0.14, 0.14, 0.03, 24]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#34A853" roughness={0.2} />
              </mesh>
              <mesh position={[0, 0, 0.02]} rotation={[0, 0, -Math.PI / 6]}>
                <boxGeometry args={[0.04, 0.12, 0.01]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          </group>
        );

      case 'admissions':
        // 4. Admission Monitoring — Yellow / Amber Analytics Bar Chart Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Base Milestone Axis */}
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[0.88, 0.05, 0.12]} />
              <meshStandardMaterial color="#0F172A" roughness={0.3} />
            </mesh>
            {/* Bar 1 (Sky Blue) */}
            <mesh position={[-0.26, -0.17, 0]}>
              <boxGeometry args={[0.16, 0.26, 0.08]} />
              <meshStandardMaterial color="#4285F4" roughness={0.2} />
            </mesh>
            {/* Bar 2 (Coral Red) */}
            <mesh position={[0, -0.07, 0]}>
              <boxGeometry args={[0.16, 0.46, 0.08]} />
              <meshStandardMaterial color="#EA4335" roughness={0.2} />
            </mesh>
            {/* Bar 3 (Vibrant Yellow) */}
            <mesh position={[0.26, 0.06, 0]}>
              <boxGeometry args={[0.16, 0.72, 0.08]} />
              <meshStandardMaterial color="#FBBC04" roughness={0.2} />
            </mesh>
            {/* Rising Trend Arrow Vector */}
            <group position={[0.02, 0.28, 0.06]}>
              <mesh rotation={[0, 0, -0.45]}>
                <boxGeometry args={[0.62, 0.035, 0.02]} />
                <meshStandardMaterial color="#34A853" roughness={0.2} />
              </mesh>
              <mesh position={[0.28, 0.12, 0]} rotation={[0, 0, -0.45]}>
                <coneGeometry args={[0.08, 0.16, 16]} />
                <meshStandardMaterial color="#34A853" roughness={0.2} />
              </mesh>
            </group>
          </group>
        );

      case 'duplicates':
        // 5. Duplicate Record Detection — Coral Comparison Discs & Lens Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Record Disc 1 (Coral Red) */}
            <mesh position={[-0.15, 0.02, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#EA4335" roughness={0.25} />
            </mesh>
            <mesh position={[-0.15, 0.02, 0.03]}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>

            {/* Record Disc 2 (Warm Amber) */}
            <mesh position={[0.15, 0.02, 0.02]}>
              <cylinderGeometry args={[0.34, 0.34, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FBBC04" roughness={0.25} />
            </mesh>
            <mesh position={[0.15, 0.02, 0.05]}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>

            {/* Overlap Inspection Ring / Lens */}
            <group position={[0, -0.08, 0.08]}>
              <mesh>
                <torusGeometry args={[0.16, 0.03, 16, 32]} />
                <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.8} />
              </mesh>
              {/* Magnifier handle */}
              <mesh position={[0.16, -0.16, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.025, 0.025, 0.2, 16]} />
                <meshStandardMaterial color="#4285F4" roughness={0.2} />
              </mesh>
            </group>
          </group>
        );

      case 'compliance':
        // 6. Compliance Monitoring — Teal Shield & Scale of Justice Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Heraldic Shield Main Body */}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.68, 0.42, 0.05]} />
              <meshStandardMaterial color="#0D9488" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[0, -0.19, 0]} rotation={[0, 0, Math.PI]}>
              <cylinderGeometry args={[0.34, 0.34, 0.05, 3]} />
              <meshStandardMaterial color="#0D9488" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* White Bevel Border */}
            <mesh position={[0, 0.02, 0.03]}>
              <boxGeometry args={[0.54, 0.48, 0.015]} />
              <meshStandardMaterial color="#CCFBF1" roughness={0.25} />
            </mesh>
            {/* Balanced Scale of Justice in White & Gold */}
            <mesh position={[0, 0.04, 0.045]}>
              <cylinderGeometry args={[0.02, 0.025, 0.42, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.2, 0.045]}>
              <boxGeometry args={[0.42, 0.025, 0.03]} />
              <meshStandardMaterial color="#FBBC04" roughness={0.2} metalness={0.4} />
            </mesh>
            {/* Hanging weighing pans */}
            {[-0.16, 0.16].map((x, idx) => (
              <mesh key={idx} position={[x, 0.08, 0.045]}>
                <cylinderGeometry args={[0.09, 0.01, 0.04, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
              </mesh>
            ))}
          </group>
        );

      case 'verification':
        // 7. Student Record Verification — Blue-Violet Scroll & Verified Seal Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Parchment Diploma Sheet */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.66, 0.74, 0.03]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.02} />
            </mesh>
            {/* Upper & Lower Scroll Cylinders */}
            <mesh position={[0, 0.39, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
              <meshStandardMaterial color="#4F46E5" roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.39, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
              <meshStandardMaterial color="#4F46E5" roughness={0.2} />
            </mesh>
            {/* Gold Ribbon Strip */}
            <mesh position={[0, 0.1, 0.02]}>
              <boxGeometry args={[0.54, 0.04, 0.005]} />
              <meshStandardMaterial color="#FBBC04" metalness={0.4} roughness={0.2} />
            </mesh>
            {/* Official Wax Seal Stamp */}
            <group position={[0.16, -0.16, 0.04]}>
              <mesh>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 24]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#4F46E5" roughness={0.2} />
              </mesh>
              {/* Star Emblem */}
              <mesh position={[0, 0, 0.02]}>
                <octahedronGeometry args={[0.07, 0]} />
                <meshStandardMaterial color="#FBBC04" metalness={0.5} roughness={0.2} />
              </mesh>
            </group>
          </group>
        );

      case 'reports':
        // 8. Reports and Analytics — Multicolour Segmented Pie/Donut Chart Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Quadrant 1 (Google Blue) */}
            <mesh position={[0.12, 0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.06, 16, 1, false, 0, Math.PI / 2]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#4285F4" roughness={0.2} />
            </mesh>
            {/* Quadrant 2 (Google Green) */}
            <mesh position={[-0.12, 0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.06, 16, 1, false, Math.PI / 2, Math.PI / 2]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#34A853" roughness={0.2} />
            </mesh>
            {/* Quadrant 3 (Google Coral) */}
            <mesh position={[-0.12, -0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.06, 16, 1, false, Math.PI, Math.PI / 2]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#EA4335" roughness={0.2} />
            </mesh>
            {/* Quadrant 4 (Google Yellow) */}
            <mesh position={[0.12, -0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.06, 16, 1, false, (Math.PI * 3) / 2, Math.PI / 2]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FBBC04" roughness={0.2} />
            </mesh>
            {/* Center Data Hub in White */}
            <mesh position={[0, 0, 0.04]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 24]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.05} />
            </mesh>
          </group>
        );

      case 'audit':
        // 9. Audit and Security — Deep-Blue Security Padlock Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Curved Silver Metallic Shackle */}
            <mesh position={[0, 0.24, 0]}>
              <torusGeometry args={[0.2, 0.045, 16, 32, Math.PI]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.12} />
            </mesh>
            {/* Padlock Body in Deep Blue */}
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[0.62, 0.48, 0.14]} />
              <meshStandardMaterial color="#1E3A8A" roughness={0.2} metalness={0.15} />
            </mesh>
            {/* Padlock Faceplate in Blue */}
            <mesh position={[0, -0.06, 0.075]}>
              <boxGeometry args={[0.52, 0.38, 0.01]} />
              <meshStandardMaterial color="#4285F4" roughness={0.2} />
            </mesh>
            {/* Golden Keyhole Emblem */}
            <group position={[0, -0.06, 0.085]}>
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#FBBC04" metalness={0.5} roughness={0.2} />
              </mesh>
              <mesh position={[0, -0.03, 0]}>
                <boxGeometry args={[0.03, 0.08, 0.02]} />
                <meshStandardMaterial color="#FBBC04" metalness={0.5} roughness={0.2} />
              </mesh>
            </group>
          </group>
        );

      case 'integration':
      default:
        // 10. System Integration — Mint Connectivity & API Mesh Nodes Icon
        return (
          <group scale={0.88} position={[0, 0, 0.06]}>
            {/* Central Network Hub Node (Mint) */}
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.18, 24, 24]} />
              <meshStandardMaterial color="#10B981" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Satellite Node 1 (Google Blue) */}
            <mesh position={[-0.28, 0.22, 0]}>
              <sphereGeometry args={[0.11, 20, 20]} />
              <meshStandardMaterial color="#4285F4" roughness={0.2} />
            </mesh>
            {/* Satellite Node 2 (Coral Red) */}
            <mesh position={[0.28, 0.22, 0]}>
              <sphereGeometry args={[0.11, 20, 20]} />
              <meshStandardMaterial color="#EA4335" roughness={0.2} />
            </mesh>
            {/* Satellite Node 3 (Lavender) */}
            <mesh position={[0, -0.3, 0]}>
              <sphereGeometry args={[0.11, 20, 20]} />
              <meshStandardMaterial color="#7C3AED" roughness={0.2} />
            </mesh>
            {/* Interconnecting Data Rods */}
            <mesh position={[-0.14, 0.11, 0]} rotation={[0, 0, -0.68]}>
              <cylinderGeometry args={[0.02, 0.02, 0.38, 12]} />
              <meshStandardMaterial color="#D8F3E4" roughness={0.3} />
            </mesh>
            <mesh position={[0.14, 0.11, 0]} rotation={[0, 0, 0.68]}>
              <cylinderGeometry args={[0.02, 0.02, 0.38, 12]} />
              <meshStandardMaterial color="#D8F3E4" roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
              <meshStandardMaterial color="#D8F3E4" roughness={0.3} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group ref={meshRef} position={[0, 0.95, 0.06]}>
      {/* 1. Soft Tinted Circular Stage / Plinth */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.06, 36]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color={meta.light}
          roughness={0.28}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Delicate Outer Accent Halo Ring */}
      <mesh position={[0, 0, 0.032]}>
        <ringGeometry args={[0.71, 0.73, 36]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>

      {/* 3. The Refined 3D Symbol Model */}
      {renderSymbolModel()}
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
  const meta = MODULE_PALETTE[id] || MODULE_PALETTE.institutions;

  // Calm, stable positioning without back-and-forth leaping
  useFrame(() => {
    if (!groupRef.current) return;

    // Gentle hover lift only; completely stable during navigation
    const targetZ = hovered ? 0.18 : 0;
    const targetY = position[1] + (hovered ? 0.05 : 0);

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.1
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.1
    );

    const targetScale = hovered ? 1.02 : 1.0;
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
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
      {/* 1. Realistic Multi-layered Ambient Contact Shadows */}
      {/* Inner tight contact shadow */}
      <mesh position={[0, -2.25, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1, 0.42]} />
        <meshBasicMaterial color="#0F172A" transparent opacity={hovered ? 0.08 : 0.12} />
      </mesh>
      {/* Outer diffuse ambient shadow */}
      <mesh position={[0, -2.35, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 0.72]} />
        <meshBasicMaterial color="#64748B" transparent opacity={hovered ? 0.14 : 0.07} />
      </mesh>

      {/* 2. Pristine Architectural White Floating Card */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 4.3, 0.1]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.12}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Subtle Colored Top Header Accent Band */}
      <mesh position={[0, 2.05, 0.052]}>
        <boxGeometry args={[3.2, 0.2, 0.005]} />
        <meshBasicMaterial color={meta.light} />
      </mesh>
      <mesh position={[0, 2.145, 0.054]}>
        <boxGeometry args={[3.2, 0.015, 0.005]} />
        <meshBasicMaterial color={meta.primary} />
      </mesh>

      {/* 4. Crisp Border Frame Rim */}
      <group position={[0, 0, 0.052]}>
        {/* Left border */}
        <mesh position={[-1.595, 0, 0]}>
          <boxGeometry args={[0.01, 4.3, 0.002]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        {/* Right border */}
        <mesh position={[1.595, 0, 0]}>
          <boxGeometry args={[0.01, 4.3, 0.002]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        {/* Bottom border */}
        <mesh position={[0, -2.145, 0]}>
          <boxGeometry args={[3.2, 0.01, 0.002]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
      </group>

      {/* 5. Category Chip at Top */}
      <group position={[0, 1.84, 0.06]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.0, 0.22, 0.004]} />
          <meshBasicMaterial color={meta.light} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.092}
          letterSpacing={0.1}
          color={meta.badgeText}
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {(category || meta.label).toUpperCase()}
        </Text>
      </group>

      {/* 6. Refined 3D Colourful Symbol Model */}
      <Distinct3DSymbol id={id} hovered={hovered} />

      {/* 7. Module Title (Crisp, Front-Facing Dark Navy) */}
      <Text
        position={[0, -0.06, 0.06]}
        fontSize={0.21}
        maxWidth={2.8}
        lineHeight={1.2}
        color="#0F172A"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
      </Text>

      {/* 8. Module Subtitle (Readable Muted Slate Navy) */}
      <Text
        position={[0, -0.60, 0.06]}
        fontSize={0.115}
        maxWidth={2.6}
        lineHeight={1.42}
        color="#475569"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {subtitle}
      </Text>

      {/* 9. Polished "Open Module" Action Button (No wireframe X!) */}
      <group position={[0, -1.48, 0.06]}>
        {/* Button base surface */}
        <mesh>
          <boxGeometry args={[2.4, 0.44, 0.02]} />
          <meshStandardMaterial
            color={hovered ? meta.primary : '#F8FAFC'}
            roughness={0.2}
            metalness={0.05}
          />
        </mesh>
        {/* Crisp border frame when not hovered */}
        {!hovered && (
          <group position={[0, 0, 0.012]}>
            <mesh position={[0, 0.215, 0]}>
              <boxGeometry args={[2.4, 0.01, 0.002]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[0, -0.215, 0]}>
              <boxGeometry args={[2.4, 0.01, 0.002]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[-1.195, 0, 0]}>
              <boxGeometry args={[0.01, 0.44, 0.002]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[1.195, 0, 0]}>
              <boxGeometry args={[0.01, 0.44, 0.002]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          </group>
        )}
        {/* Front-Facing Sharp Action Text */}
        <Text
          position={[0, 0, 0.025]}
          fontSize={0.12}
          letterSpacing={0.04}
          color={hovered ? '#FFFFFF' : '#0F172A'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? 'Open Module  →' : 'Open Module  →'}
        </Text>
      </group>
    </group>
  );
};
