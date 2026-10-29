import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { SpatialTopCapsule } from './SpatialTopCapsule';
import { SpatialBottomDock } from './SpatialBottomDock';
import { SearchModal } from '../ui/SearchModal';
import { SpatialCanvas } from '../3d/SpatialCanvas';
import { NonWebGLFallback } from '../3d/NonWebGLFallback';
import {
  ArrowLeft,
  Sparkles,
  X,
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
import { TrustGraphWorkspace } from '../workspaces/TrustGraphWorkspace';

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
      case 'trustgraph':
        return {
          title: 'CREDEN TrustGraph™ Intelligence',
          subtitle: 'Interactive 3D Entity Relationship Visualiser, Duplicate Conflict Radar & Provenance Engine',
          category: 'Graph AI & Intelligence',
          actionLabel: 'Scan Collisions',
        };
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
      case 'trustgraph':
        return <TrustGraphWorkspace />;
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

  const handlePrimaryAction = () => {
    switch (activeModule) {
      case 'submissions':
        window.dispatchEvent(new CustomEvent('creden:action:submissions'));
        break;
      case 'institutions':
        window.dispatchEvent(new CustomEvent('creden:action:institutions'));
        break;
      case 'apaar':
        window.dispatchEvent(new CustomEvent('creden:action:apaar'));
        break;
      case 'duplicates':
        window.dispatchEvent(new CustomEvent('creden:action:duplicates'));
        break;
      case 'compliance':
        window.dispatchEvent(new CustomEvent('creden:action:compliance'));
        break;
      case 'verification':
        window.dispatchEvent(new CustomEvent('creden:action:verification'));
        break;
      case 'reports':
        window.open('/api/analytics/export-csv?type=students', '_blank');
        break;
      case 'audit':
        window.dispatchEvent(new CustomEvent('creden:action:audit'));
        break;
      case 'integration':
        window.dispatchEvent(new CustomEvent('creden:action:integration'));
        break;
      default:
        break;
    }
  };

  const { title, subtitle, category, actionLabel } = getWorkspaceMeta(activeModule);
  const is3DSpace = activeModule === 'overview' && viewMode !== 'grid';

  return (
    <div className="relative h-screen w-screen overflow-hidden spatial-ambient-bg text-[#0F172A] font-sans select-none">
      {/* 1. Underlying Real Navigable Three.js Liquid-Glass Spatial Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {isReducedMotion ? (
          <NonWebGLFallback />
        ) : (
          <SpatialCanvas />
        )}
      </div>

      {/* 2. Floating VisionOS Light Address & Security Capsule (Top Pill) */}
      <SpatialTopCapsule
        onSearchClick={() => setSearchOpen(true)}
        onOpenLogin={onOpenLogin}
      />

      {/* 3. Spatial Horizon Progress Flight Bar (Visible in 3D Flight) */}
      {is3DSpace && (
        <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-slate-200/60 z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 transition-all duration-150 shadow-sm"
            style={{ width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%` }}
          />
        </div>
      )}

      {/* 4. Rock-Solid Liquid Glass Workspace Window with Dark Blur Backdrop */}
      {!is3DSpace && (
        <>
          {/* Dark Spatial Backdrop (Lightweight, crisp focus behind the window) */}
          <div
            className="fixed inset-0 z-10 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200 pointer-events-auto"
            onClick={() => setActiveModule('overview')}
            aria-label="Backdrop click to close and return to 3D Space"
          />

          {/* Centered, Stable Workspace Window (No tilt, blur-free crisp typography) */}
          <div className="fixed inset-0 z-20 pt-16 pb-20 px-3 sm:px-6 md:px-10 flex justify-center pointer-events-none">
            <div className="flex w-full max-w-6xl h-full pointer-events-auto">
              <div className="flex-1 flex flex-col h-full min-w-0 rounded-3xl liquid-glass-window shadow-2xl overflow-hidden border border-slate-300/60">
                {/* Window Header Bar: Clean, distraction-free, blur-free */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/70 bg-slate-100/75 backdrop-blur-md flex-shrink-0">
                  {/* Left: Return Button & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setActiveModule('overview')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 text-xs font-semibold transition-all group flex-shrink-0 shadow-xs"
                      title="Return to 3D Space"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Back to 3D Space</span>
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 hidden sm:block" />

                    <div className="flex items-center gap-2 truncate">
                      <h1 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight truncate">
                        {title}
                      </h1>
                    </div>
                  </div>

                  {/* Right: Contextual Action Button & Close Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handlePrimaryAction}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-md hover:scale-102"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{actionLabel}</span>
                    </button>

                    <button
                      onClick={() => setActiveModule('overview')}
                      className="p-1.5 rounded-full bg-white/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                      title="Close Window"
                    >
                      <span className="sr-only">Close</span>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtitle Banner in Soft Tint */}
                {subtitle && (
                  <div className="px-5 py-2 bg-slate-100/50 border-b border-slate-200/60 text-xs text-slate-600 flex items-center justify-between flex-shrink-0">
                    <span className="truncate">{subtitle}</span>
                  </div>
                )}

                {/* Internal Content Canvas: Blur-free, clean texts, sharp overview */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  <div className="rounded-2xl bg-white/85 border border-slate-200/70 p-4 sm:p-6 shadow-xs">
                    {renderActiveModuleWorkspace()}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 5. VisionOS Floating Liquid Glass Bottom Quick Dock */}
      <SpatialBottomDock />

      {/* 7. Quick Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
