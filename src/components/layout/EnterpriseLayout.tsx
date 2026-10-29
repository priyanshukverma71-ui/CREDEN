import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { SpatialFloatingRail } from './SpatialFloatingRail';
import { SpatialTopCapsule } from './SpatialTopCapsule';
import { SpatialBottomDock } from './SpatialBottomDock';
import { AcademicNavigatorPanel, GovernanceInspectorPanel } from './SpatialContextualPanels';
import { SearchModal } from '../ui/SearchModal';
import { SpatialCanvas } from '../3d/SpatialCanvas';
import { NonWebGLFallback } from '../3d/NonWebGLFallback';
import {
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

// Workspaces
import { ExecutiveCockpit } from '../workspaces/ExecutiveCockpit';
import { InstitutionWorkspace } from '../workspaces/InstitutionWorkspace';
import { StudentDataWorkspace } from '../workspaces/StudentDataWorkspace';
import { StudentSubmissionWorkspace } from '../workspaces/StudentSubmissionWorkspace';
import { ApaarValidationWorkspace } from '../workspaces/ApaarValidationWorkspace';
import { AdmissionMonitoringWorkspace } from '../workspaces/AdmissionMonitoringWorkspace';
import { DuplicateDetectionWorkspace } from '../workspaces/DuplicateDetectionWorkspace';
import { ComplianceCentreWorkspace } from '../workspaces/ComplianceCentreWorkspace';
import { StudentVerificationWorkspace } from '../workspaces/StudentVerificationWorkspace';
import { ReportsAnalyticsWorkspace } from '../workspaces/ReportsAnalyticsWorkspace';
import { AuditSecurityWorkspace } from '../workspaces/AuditSecurityWorkspace';
import { SystemIntegrationWorkspace } from '../workspaces/SystemIntegrationWorkspace';

interface EnterpriseLayoutProps {
  onOpenLogin: () => void;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({ onOpenLogin }) => {
  const { user } = useAuth();
  const {
    activeModule,
    setActiveModule,
    viewMode,
    isReducedMotion,
    scrollProgress,
  } = usePortal();

  const [searchOpen, setSearchOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Pointer Parallax coordinates for 3D holographic tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: normX, y: normY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReducedMotion]);

  // Global Keyboard shortcuts: Escape to return to 3D Space, Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && activeModule !== 'overview') {
        setActiveModule('overview');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModule, setActiveModule]);

  const getWorkspaceMeta = (mod: ModuleId) => {
    switch (mod) {
      case 'institutions':
        return {
          title: 'Institution Management',
          subtitle: 'AICTE Approved Technical Institutions, Regional Directorates & Programmes',
          category: 'Institutional Oversight',
          actionLabel: 'Add Institution',
        };
      case 'students':
        return {
          title: 'Student Registry',
          subtitle: 'Institutional Enrolment Directory, APAAR Records & Digital Credential Verification',
          category: 'Student Data Ops',
          actionLabel: 'Export Directory',
        };
      case 'submissions':
        return {
          title: 'Student Data Submission',
          subtitle: 'Smart Batch CSV Ingestion, Verhoeff Checksum Engine & Intake Quota Pre-Check',
          category: 'Data Ingestion',
          actionLabel: 'Ingest Batch CSV',
        };
      case 'apaar':
        return {
          title: 'APAAR ID Validation Engine',
          subtitle: '12-Digit Verhoeff Structural Verification & DigiLocker / ABC Registry Gateway',
          category: 'Identity Integrity',
          actionLabel: 'Verify APAAR ID',
        };
      case 'admissions':
        return {
          title: 'Admission & Intake Monitoring',
          subtitle: 'Approved Capacity Sanctions vs Real-Time Actual Student Admissions',
          category: 'Intake Monitoring',
          actionLabel: 'Run Audit Scan',
        };
      case 'duplicates':
        return {
          title: 'Duplicate Record Review Bureau',
          subtitle: 'Cross-Institution Concurrent Enrolment & Fuzzy Identity Conflict Adjudication',
          category: 'Integrity Bureau',
          actionLabel: 'Adjudicate All',
        };
      case 'compliance':
        return {
          title: 'Compliance Action Centre',
          subtitle: 'APH 2024-25 Regulatory Discrepancies, Hearing Work Queue & Sanctions',
          category: 'Regulatory Oversight',
          actionLabel: 'Issue Determination',
        };
      case 'verification':
        return {
          title: 'Student Verification Bureau',
          subtitle: 'Zero-Knowledge Minimal Disclosure & HMAC-SHA256 QR Attestation Checking',
          category: 'Public Attestation',
          actionLabel: 'Issue QR Attest',
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'National Technical Education Data Quality Index & Longitudinal Enrolment Trends',
          category: 'Data Intelligence',
          actionLabel: 'Generate Report',
        };
      case 'audit':
        return {
          title: 'Audit & Tamper Logs',
          subtitle: 'Cryptographically Chained SHA-256 Tamper-Evident Ledger & Chain Integrity',
          category: 'Security Assurance',
          actionLabel: 'Verify SHA-256',
        };
      case 'integration':
        return {
          title: 'System Integration Settings',
          subtitle: 'Government Registry Gateways (DigiLocker, NDEAR) & OpenAPI 3.0 Specs',
          category: 'System Gateways',
          actionLabel: 'Test Webhooks',
        };
      default:
        return {
          title: 'Executive Governance Cockpit',
          subtitle: 'National Academic Data Summary & Performance Indicators',
          category: 'National Oversight',
          actionLabel: 'Generate Digest',
        };
    }
  };

  const renderActiveModuleWorkspace = () => {
    switch (activeModule) {
      case 'overview':
        return <ExecutiveCockpit />;
      case 'institutions':
        return <InstitutionWorkspace />;
      case 'students':
        return <StudentDataWorkspace />;
      case 'submissions':
        return <StudentSubmissionWorkspace />;
      case 'apaar':
        return <ApaarValidationWorkspace />;
      case 'admissions':
        return <AdmissionMonitoringWorkspace />;
      case 'duplicates':
        return <DuplicateDetectionWorkspace />;
      case 'compliance':
        return <ComplianceCentreWorkspace />;
      case 'verification':
        return <StudentVerificationWorkspace />;
      case 'reports':
        return <ReportsAnalyticsWorkspace />;
      case 'audit':
        return <AuditSecurityWorkspace />;
      case 'integration':
        return <SystemIntegrationWorkspace />;
      default:
        return <ExecutiveCockpit />;
    }
  };

  const { title, subtitle, category, actionLabel } = getWorkspaceMeta(activeModule);
  const is3DSpace = activeModule === 'overview' && viewMode !== 'grid';

  return (
    <div className="relative h-screen w-screen overflow-hidden spatial-ambient-bg text-[#F4F6F9] font-sans select-none">
      {/* 1. Underlying Real Navigable Three.js Liquid-Glass Spatial Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {isReducedMotion ? (
          <NonWebGLFallback />
        ) : (
          <SpatialCanvas />
        )}
      </div>

      {/* 2. Floating VisionOS Smoked Glass Navigation Rail (Left Pill) */}
      <SpatialFloatingRail />

      {/* 3. Floating VisionOS Verified Address & Security Capsule (Top Pill) */}
      <SpatialTopCapsule
        onSearchClick={() => setSearchOpen(true)}
        onOpenLogin={onOpenLogin}
      />

      {/* 4. Spatial Horizon Progress Flight Bar (Visible in 3D Flight) */}
      {is3DSpace && (
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/10 z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-white to-teal-200 transition-all duration-150 shadow-[0_0_10px_rgba(255,255,255,0.7)]"
            style={{ width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%` }}
          />
        </div>
      )}

      {/* 5. VisionOS Spatial Floating Workspace Window (Exact match to Reference Image) */}
      {!is3DSpace && (
        <div
          className="absolute inset-0 z-10 pt-16 pb-20 px-3 sm:px-6 md:pl-24 md:pr-8 flex justify-center pointer-events-none transition-transform duration-100 ease-out"
          style={{
            perspective: '1400px',
            transform: isReducedMotion
              ? 'none'
              : `perspective(1400px) rotateY(${mousePos.x * 2.0}deg) rotateX(${-mousePos.y * 1.5}deg)`,
          }}
        >
          <div className="flex w-full max-w-7xl gap-4 h-full pointer-events-auto">
            {/* Left Contextual Panel: VisionOS Navigator */}
            <AcademicNavigatorPanel
              isOpen={navigatorOpen}
              onToggle={() => setNavigatorOpen(false)}
            />

            {/* Central Primary Spatial Liquid Glass Window (Matches Reference Image) */}
            <div className="flex-1 flex flex-col h-full min-w-0 rounded-[32px] liquid-glass-window overflow-hidden transition-all duration-200">
              {/* Window Header Bar (Matches Webflow / VisionOS window toolbar in Reference Image) */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/15 bg-black/30 backdrop-blur-md flex-shrink-0">
                {/* Left: Window Return Button & Page Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setActiveModule('overview')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-semibold transition-all group flex-shrink-0 shadow-sm"
                    title="Return to 3D Spatial Overview (Esc)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to 3D Space</span>
                    <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-white/70 border border-white/10">
                      Esc
                    </kbd>
                  </button>

                  <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />

                  {/* Window Title & Breadcrumb */}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60 font-mono hidden sm:inline">Page:</span>
                      <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                        {title}
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Center: VisionOS Device Preview Switcher (Exact match to Reference Image) */}
                <div className="hidden lg:flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/15 text-xs text-white/70">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-full transition-colors ${previewDevice === 'desktop' ? 'bg-white text-black font-semibold shadow-sm' : 'hover:text-white'}`}
                    title="Desktop Workspace"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-full transition-colors ${previewDevice === 'tablet' ? 'bg-white text-black font-semibold shadow-sm' : 'hover:text-white'}`}
                    title="Tablet Responsive"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-full transition-colors ${previewDevice === 'mobile' ? 'bg-white text-black font-semibold shadow-sm' : 'hover:text-white'}`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-2 text-white/60">
                    2304 PX 100%
                  </span>
                </div>

                {/* Right: Drawer Toggles & Prominent White Action Button (Like Publish in Image) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setNavigatorOpen(!navigatorOpen)}
                    className={`hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
                      navigatorOpen
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-transparent text-white/60 border-white/15 hover:text-white'
                    }`}
                    title="Toggle Academic Navigator Drawer"
                  >
                    {navigatorOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                    <span>Navigator</span>
                  </button>

                  <button
                    onClick={() => setInspectorOpen(!inspectorOpen)}
                    className={`hidden 2xl:flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
                      inspectorOpen
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-transparent text-white/60 border-white/15 hover:text-white'
                    }`}
                    title="Toggle Governance Inspector Drawer"
                  >
                    {inspectorOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                    <span>Inspector</span>
                  </button>

                  {/* Luminous White Publish / Action Pill Button (Exact match to Reference Image) */}
                  <button
                    onClick={() => {
                      // Trigger action or toast
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.45)] hover:scale-102"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{actionLabel}</span>
                  </button>
                </div>
              </div>

              {/* Internal Content Canvas: Housing Working High-Density Data Tables */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-6 shadow-inner">
                  {renderActiveModuleWorkspace()}
                </div>
              </main>
            </div>

            {/* Right Contextual Panel: VisionOS Inspector */}
            <GovernanceInspectorPanel
              isOpen={inspectorOpen}
              onToggle={() => setInspectorOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 6. VisionOS Floating Liquid Glass Bottom Quick Dock */}
      <SpatialBottomDock />

      {/* 7. Quick Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
