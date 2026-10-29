import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { InfiniteSpace } from './InfiniteSpace';
import { ObsidianFloor } from './ObsidianFloor';
import { FloatingModulePod } from './FloatingModulePod';
import { CameraController } from './CameraController';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MODULES_LIST: {
  id: ModuleId;
  category: string;
  title: string;
  subtitle: string;
  x: number;
}[] = [
  {
    id: 'institutions',
    category: 'Institutional Oversight',
    title: 'Institution Management',
    subtitle: 'Approved technical institutions, programmes & statutory capacity',
    x: -18,
  },
  {
    id: 'submissions',
    category: 'Student Data Ops',
    title: 'Student Data Submission',
    subtitle: 'Batch CSV ingestion, Verhoeff checksum & quota pre-check',
    x: -14,
  },
  {
    id: 'apaar',
    category: 'Verification & Integrity',
    title: 'APAAR ID Validation',
    subtitle: '12-digit Verhoeff structural verification & ABC gateway',
    x: -10,
  },
  {
    id: 'admissions',
    category: 'Institutional Oversight',
    title: 'Admission Monitoring',
    subtitle: 'Approved capacity sanctions vs real-time actual student enrolments',
    x: -6,
  },
  {
    id: 'duplicates',
    category: 'Verification & Integrity',
    title: 'Duplicate Record Detection',
    subtitle: 'Cross-institution concurrent enrolment & fuzzy identity conflicts',
    x: -2,
  },
  {
    id: 'compliance',
    category: 'Verification & Integrity',
    title: 'Compliance Monitoring',
    subtitle: 'APH 2024-25 regulatory discrepancies, hearings & sanctions',
    x: 2,
  },
  {
    id: 'verification',
    category: 'Verification & Integrity',
    title: 'Student Record Verification',
    subtitle: 'Zero-knowledge verification & SHA-256 QR attestation checking',
    x: 6,
  },
  {
    id: 'reports',
    category: 'Assurance & Integration',
    title: 'Reports and Analytics',
    subtitle: 'National data quality index & longitudinal enrolment analytics',
    x: 10,
  },
  {
    id: 'audit',
    category: 'Assurance & Integration',
    title: 'Audit and Security',
    subtitle: 'Cryptographically chained SHA-256 tamper-evident security ledger',
    x: 14,
  },
  {
    id: 'integration',
    category: 'Assurance & Integration',
    title: 'System Integration',
    subtitle: 'Government registry gateways (DigiLocker, ABC) & API specs',
    x: 18,
  },
];

export const SpatialCanvas: React.FC = () => {
  const {
    activeModule,
    openWorkspace,
    cameraTargetX,
    setCameraTargetX,
    setScrollProgress,
  } = usePortal();

  // Navigation handlers for on-screen chevron buttons
  const handleNavLeft = () => {
    const newTarget = Math.max(-18, (cameraTargetX || 0) - 4);
    setCameraTargetX(newTarget);
    setScrollProgress((newTarget + 18) / 36);
  };

  const handleNavRight = () => {
    const newTarget = Math.min(18, (cameraTargetX || 0) + 4);
    setCameraTargetX(newTarget);
    setScrollProgress((newTarget + 18) / 36);
  };

  return (
    <div className="absolute inset-0 pointer-events-auto bg-[#F7F9FC] select-none">
      <Canvas
        camera={{ position: [0, 0.35, 8.2], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Bright Clean Material-Inspired Spatial Atmosphere */}
        <color attach="background" args={['#F7F9FC']} />
        <fog attach="fog" args={['#F7F9FC', 22, 60]} />

        {/* Studio High-Key Daylight Illumination */}
        <ambientLight intensity={1.35} color="#FFFFFF" />

        {/* Primary Overhead Key Light for Crisp Architectural Shadows */}
        <directionalLight
          position={[6, 14, 10]}
          intensity={2.0}
          color="#FFFFFF"
          castShadow
        />

        {/* Soft Ambient Rim Light */}
        <directionalLight
          position={[-8, 8, -6]}
          intensity={0.8}
          color="#D7E9FF"
        />

        {/* Soft Daylight Bounce */}
        <directionalLight
          position={[0, -4, 4]}
          intensity={0.4}
          color="#E2E8F0"
        />

        <Suspense fallback={null}>
          <CameraController />
          <InfiniteSpace />
          <ObsidianFloor />

          {/* 10 Colourful 3D Application Launcher Modules */}
          {MODULES_LIST.map((m) => (
            <FloatingModulePod
              key={m.id}
              id={m.id}
              category={m.category}
              title={m.title}
              subtitle={m.subtitle}
              position={[m.x, 0.1, 0]}
              onSelect={openWorkspace}
              isActive={activeModule === m.id}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* On-Screen Horizontal Navigation Controls in Pure White Floating Pills */}
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavLeft}
          className="pointer-events-auto p-3.5 rounded-full bg-white text-slate-800 hover:text-black hover:bg-slate-50 border border-slate-200/90 hover:scale-105 transition-all shadow-md group"
          title="Previous Module (Left Arrow)"
          aria-label="Previous Module"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavRight}
          className="pointer-events-auto p-3.5 rounded-full bg-white text-slate-800 hover:text-black hover:bg-slate-50 border border-slate-200/90 hover:scale-105 transition-all shadow-md group"
          title="Next Module (Right Arrow)"
          aria-label="Next Module"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Floating Navigation Hint Pill above Bottom Dock */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 hidden md:block">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-slate-200 text-[11px] text-slate-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Scroll trackpad / wheel or use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200 shadow-2xs">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200 shadow-2xs">→</kbd> to navigate</span>
          <span className="text-slate-300">•</span>
          <span>Click card or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200 shadow-2xs">Enter</kbd> to launch</span>
        </div>
      </div>
    </div>
  );
};
