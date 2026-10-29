import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { InfiniteSpace } from './InfiniteSpace';
import { ObsidianFloor } from './ObsidianFloor';
import { FloatingModulePod } from './FloatingModulePod';
import { CameraController } from './CameraController';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';

export const SpatialCanvas: React.FC = () => {
  const { activeModule, openWorkspace } = usePortal();

  const modulesList: {
    id: ModuleId;
    title: string;
    subtitle: string;
    x: number;
  }[] = [
    {
      id: 'institutions',
      title: 'Institution Management',
      subtitle: 'Manage approved institutions, programmes and authorized users',
      x: -18,
    },
    {
      id: 'students',
      title: 'Student Data Submission',
      subtitle: 'Upload and manage student admission records',
      x: -14,
    },
    {
      id: 'apaar',
      title: 'APAAR ID Validation',
      subtitle: 'Validate APAAR IDs and check authenticity',
      x: -10,
    },
    {
      id: 'admissions',
      title: 'Admission Monitoring',
      subtitle: 'Track intake and enrolment status',
      x: -6,
    },
    {
      id: 'duplicates',
      title: 'Duplicate Record Detection',
      subtitle: 'Identify and resolve duplicate entries',
      x: -2,
    },
    {
      id: 'compliance',
      title: 'Compliance Monitoring',
      subtitle: 'Monitor regulatory compliance and discrepancies',
      x: 2,
    },
    {
      id: 'verification',
      title: 'Student Verification',
      subtitle: 'Verify student records and documentation',
      x: 6,
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'Generate reports and visual insights',
      x: 10,
    },
    {
      id: 'audit',
      title: 'Audit & Security',
      subtitle: 'Track system activities and verify integrity',
      x: 14,
    },
    {
      id: 'integration',
      title: 'System Integration',
      subtitle: 'Manage external integrations and API gateways',
      x: 18,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-auto bg-[#08090B]">
      <Canvas
        camera={{ position: [0, 1.1, 9.2], fov: 44 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Spatial background color & distant atmospheric depth fog */}
        <color attach="background" args={['#08090B']} />
        <fog attach="fog" args={['#08090B', 28, 75]} />

        {/* Studio Lighting Setup: Crisp, High-Contrast Metallic Illumination */}
        <ambientLight intensity={1.1} color="#E2E8F0" />

        {/* Main High-Intensity Overhead Key Light */}
        <directionalLight
          position={[6, 16, 14]}
          intensity={2.8}
          color="#FFFFFF"
          castShadow
        />

        {/* Dual Side Rim Lights for Metallic Edge Gleam */}
        <directionalLight
          position={[-18, 12, 6]}
          intensity={1.8}
          color="#CBD5E1"
        />
        <directionalLight
          position={[18, 12, 6]}
          intensity={1.8}
          color="#CBD5E1"
        />

        {/* Backlight for Volumetric Silhouette Separation */}
        <directionalLight
          position={[0, 10, -12]}
          intensity={1.4}
          color="#94A3B8"
        />

        {/* Floor Upward Bounce Light */}
        <directionalLight
          position={[0, -6, 6]}
          intensity={0.9}
          color="#64748B"
        />

        {/* Center Point Fill */}
        <pointLight position={[0, 4, 6]} intensity={2.2} color="#FFFFFF" distance={30} />
        <pointLight position={[-12, 3, 4]} intensity={1.8} color="#FFFFFF" distance={20} />
        <pointLight position={[12, 3, 4]} intensity={1.8} color="#FFFFFF" distance={20} />

        <Suspense fallback={null}>
          <CameraController />
          <InfiniteSpace />
          <ObsidianFloor />

          {/* 10 Floating Module Pods along X Axis */}
          {modulesList.map((m) => (
            <FloatingModulePod
              key={m.id}
              id={m.id}
              title={m.title}
              subtitle={m.subtitle}
              position={[m.x, 0.5, 0]}
              onSelect={openWorkspace}
              isActive={activeModule === m.id}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
