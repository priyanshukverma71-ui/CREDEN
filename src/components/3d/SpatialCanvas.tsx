import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { InfiniteSpace } from './InfiniteSpace';
import { ObsidianFloor } from './ObsidianFloor';
import { FloatingModulePod } from './FloatingModulePod';
import { CameraController } from './CameraController';
import { usePortal, MODULE_COORDINATES } from '../../context/PortalContext';
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
    subtitle: 'AICTE approved institutions, regional directorates & programmes',
    x: -20,
  },
  {
    id: 'students',
    category: 'Student Data Ops',
    title: 'Student Registry',
    subtitle: 'National enrolment directory & verified APAAR identities',
    x: -16,
  },
  {
    id: 'submissions',
    category: 'Student Data Ops',
    title: 'Student Data Submission',
    subtitle: 'Batch CSV ingestion, Verhoeff checksum & quota pre-check',
    x: -12,
  },
  {
    id: 'apaar',
    category: 'Verification & Integrity',
    title: 'APAAR ID Validation',
    subtitle: '12-digit Verhoeff structural verification & ABC gateway',
    x: -8,
  },
  {
    id: 'admissions',
    category: 'Institutional Oversight',
    title: 'Admission Monitoring',
    subtitle: 'Approved capacity sanctions vs real-time actual enrolments',
    x: -4,
  },
  {
    id: 'duplicates',
    category: 'Verification & Integrity',
    title: 'Duplicate Record Detection',
    subtitle: 'Cross-institution concurrent enrolment & fuzzy identity conflicts',
    x: 0,
  },
  {
    id: 'compliance',
    category: 'Verification & Integrity',
    title: 'Compliance Action Centre',
    subtitle: 'APH 2024-25 regulatory discrepancies, hearings & sanctions',
    x: 4,
  },
  {
    id: 'verification',
    category: 'Verification & Integrity',
    title: 'Student Verification',
    subtitle: 'Zero-knowledge verification & SHA-256 QR attestation checking',
    x: 8,
  },
  {
    id: 'reports',
    category: 'Assurance & Integration',
    title: 'Reports & Analytics',
    subtitle: 'National data quality index & longitudinal enrolment trends',
    x: 12,
  },
  {
    id: 'audit',
    category: 'Assurance & Integration',
    title: 'Audit & Tamper Logs',
    subtitle: 'Cryptographically chained SHA-256 tamper-evident ledger',
    x: 16,
  },
  {
    id: 'integration',
    category: 'Assurance & Integration',
    title: 'System Integration',
    subtitle: 'Government registry gateways (DigiLocker, ABC) & API specs',
    x: 20,
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
    const newTarget = Math.max(-20, (cameraTargetX || 0) - 4);
    setCameraTargetX(newTarget);
    setScrollProgress((newTarget + 21) / 42);
  };

  const handleNavRight = () => {
    const newTarget = Math.min(20, (cameraTargetX || 0) + 4);
    setCameraTargetX(newTarget);
    setScrollProgress((newTarget + 21) / 42);
  };

  return (
    <div className="absolute inset-0 pointer-events-auto bg-[#EDF2F7] select-none">
      <Canvas
        camera={{ position: [0, 0.35, 8.2], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Luminous Light Mode Studio Atmosphere & Depth Fog */}
        <color attach="background" args={['#EDF2F7']} />
        <fog attach="fog" args={['#EDF2F7', 22, 65]} />

        {/* VisionOS Style Light Studio Illumination */}
        <ambientLight intensity={1.4} color="#FFFFFF" />

        {/* Primary High-Key Overhead Daylight Key */}
        <directionalLight
          position={[8, 16, 12]}
          intensity={2.2}
          color="#FFFFFF"
          castShadow
        />

        {/* Luminous Specular Rim Light from Behind-Left */}
        <directionalLight
          position={[-10, 8, -6]}
          intensity={1.2}
          color="#E2E8F0"
        />

        {/* Soft Studio Floor Bounce Fill */}
        <directionalLight
          position={[0, -4, 4]}
          intensity={0.6}
          color="#CBD5E1"
        />

        <Suspense fallback={null}>
          <CameraController />
          <InfiniteSpace />
          <ObsidianFloor />

          {/* 11 Spatially Floating Liquid Glass Pods with Colorful Round Symbols */}
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

      {/* On-Screen Horizontal Navigation Controls in Frosted Light Glass */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavLeft}
          className="pointer-events-auto p-3 rounded-2xl liquid-glass-pill text-slate-700 hover:text-black border border-white/90 hover:scale-105 transition-all shadow-md group"
          title="Previous Module (Left Arrow)"
          aria-label="Previous Module"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavRight}
          className="pointer-events-auto p-3 rounded-2xl liquid-glass-pill text-slate-700 hover:text-black border border-white/90 hover:scale-105 transition-all shadow-md group"
          title="Next Module (Right Arrow)"
          aria-label="Next Module"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Floating Navigation Hint Pill above Bottom Dock in Light Glass */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 hidden md:block">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] text-slate-600 shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Scroll trackpad / wheel or use <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-900 font-mono text-[10px] border border-slate-200 shadow-sm">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-900 font-mono text-[10px] border border-slate-200 shadow-sm">→</kbd> to explore</span>
          <span className="text-slate-300">•</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-900 font-mono text-[10px] border border-slate-200 shadow-sm">Enter</kbd> to open</span>
        </div>
      </div>
    </div>
  );
};
