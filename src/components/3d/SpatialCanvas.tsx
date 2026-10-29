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
    <div className="absolute inset-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.8, 8.5], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Spatial background color & atmospheric depth fog */}
        <color attach="background" args={['#08090B']} />
        <fog attach="fog" args={['#08090B', 8, 35]} />

        {/* Ambient & Silver Volumetric Lights */}
        <ambientLight intensity={0.65} color="#D4D7DC" />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          color="#F1F3F5"
          castShadow
        />
        <directionalLight
          position={[-15, 10, -5]}
          intensity={0.5}
          color="#9299A3"
        />
        <pointLight position={[0, 4, 2]} intensity={0.8} color="#FFFFFF" />

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
              position={[m.x, 0.2, 0]}
              onSelect={openWorkspace}
              isActive={activeModule === m.id}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
