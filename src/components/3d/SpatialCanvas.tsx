import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { InfiniteSpace } from './InfiniteSpace';
import { ObsidianFloor } from './ObsidianFloor';
import { FloatingModulePod } from './FloatingModulePod';
import { CameraController } from './CameraController';
import { usePortal, MODULE_COORDINATES } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

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
    <div className="absolute inset-0 pointer-events-auto bg-[#08090B] select-none">
      <Canvas
        camera={{ position: [0, 0.35, 8.2], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Deep Midnight Black Spatial Atmosphere & Subtle Distance Fog */}
        <color attach="background" args={['#08090B']} />
        <fog attach="fog" args={['#08090B', 15, 45]} />

        {/* Studio Lighting Setup: Soft, Diffused Metallic Illumination */}
        <ambientLight intensity={0.7} color="#CBD5E1" />

        {/* Primary Soft Directional Key Light from Top Front */}
        <directionalLight
          position={[6, 12, 10]}
          intensity={1.6}
          color="#FFFFFF"
        />

        {/* Restrained Silver Rim Lighting from Behind-Left */}
        <directionalLight
          position={[-8, 6, -6]}
          intensity={0.75}
          color="#94A3B8"
        />

        {/* Subtle Bottom Ground Bounce Fill */}
        <directionalLight
          position={[0, -4, 4]}
          intensity={0.25}
          color="#334155"
        />

        <Suspense fallback={null}>
          <CameraController />
          <InfiniteSpace />
          <ObsidianFloor />

          {/* 11 Spatially Floating Charcoal Architectural Slabs */}
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

      {/* On-Screen Horizontal Navigation Controls (Accessible on Mobile, Trackpad & Mouse) */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavLeft}
          className="pointer-events-auto p-2.5 rounded-xl bg-[#12151B]/80 hover:bg-[#1C2028] text-[#929AA5] hover:text-white border border-[#222730] hover:border-[#D2D6DC] transition-all backdrop-blur-sm shadow-lg group"
          title="Previous Module (Left Arrow)"
          aria-label="Previous Module"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavRight}
          className="pointer-events-auto p-2.5 rounded-xl bg-[#12151B]/80 hover:bg-[#1C2028] text-[#929AA5] hover:text-white border border-[#222730] hover:border-[#D2D6DC] transition-all backdrop-blur-sm shadow-lg group"
          title="Next Module (Right Arrow)"
          aria-label="Next Module"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Floating Navigation Hint Pill at Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#12151B]/85 border border-[#242A34] text-[11px] text-[#929AA5] shadow-md backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
          <span>Scroll trackpad / wheel or use <kbd className="px-1.5 py-0.5 rounded bg-[#1C2028] text-[#F1F3F5] font-mono text-[10px] border border-[#2B3240]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[#1C2028] text-[#F1F3F5] font-mono text-[10px] border border-[#2B3240]">→</kbd> to explore</span>
          <span className="text-[#4B5563] hidden sm:inline">•</span>
          <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-[#1C2028] text-[#F1F3F5] font-mono text-[10px] border border-[#2B3240]">Enter</kbd> to open</span>
        </div>
      </div>
    </div>
  );
};
