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
  Shield,
  Layers,
  Sparkles,
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
        };
      case 'students':
        return {
          title: 'Student Registry',
          subtitle: 'Institutional Enrolment Directory, APAAR Records & Digital Credential Verification',
          category: 'Student Data Ops',
        };
      case 'submissions':
        return {
          title: 'Student Data Submission',
          subtitle: 'Smart Batch CSV Ingestion, Verhoeff Checksum Engine & Intake Quota Pre-Check',
          category: 'Data Ingestion',
        };
      case 'apaar':
        return {
          title: 'APAAR ID Validation Engine',
          subtitle: '12-Digit Verhoeff Structural Verification & DigiLocker / ABC Registry Gateway',
          category: 'Identity Integrity',
        };
      case 'admissions':
        return {
          title: 'Admission & Intake Monitoring',
          subtitle: 'Approved Capacity Sanctions vs Real-Time Actual Student Admissions',
          category: 'Intake Monitoring',
        };
      case 'duplicates':
        return {
          title: 'Duplicate Record Review Bureau',
          subtitle: 'Cross-Institution Concurrent Enrolment & Fuzzy Identity Conflict Adjudication',
          category: 'Integrity Bureau',
        };
      case 'compliance':
        return {
          title: 'Compliance Action Centre',
          subtitle: 'APH 2024-25 Regulatory Discrepancies, Hearing Work Queue & Sanctions',
          category: 'Regulatory Oversight',
        };
      case 'verification':
        return {
          title: 'Student Verification Bureau',
          subtitle: 'Zero-Knowledge Minimal Disclosure & HMAC-SHA256 QR Attestation Checking',
          category: 'Public Attestation',
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'National Technical Education Data Quality Index & Longitudinal Enrolment Trends',
          category: 'Data Intelligence',
        };
      case 'audit':
        return {
          title: 'Audit & Tamper Logs',
          subtitle: 'Cryptographically Chained SHA-256 Tamper-Evident Ledger & Chain Integrity',
          category: 'Security Assurance',
        };
      case 'integration':
        return {
          title: 'System Integration Settings',
          subtitle: 'Government Registry Gateways (DigiLocker, NDEAR) & OpenAPI 3.0 Specs',
          category: 'System Gateways',
        };
      default:
        return {
          title: 'Executive Governance Cockpit',
          subtitle: 'National Academic Data Summary & Performance Indicators',
          category: 'National Oversight',
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

  const { title, subtitle, category } = getWorkspaceMeta(activeModule);
  const is3DSpace = activeModule === 'overview' && viewMode !== 'grid';

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#07080A] text-[#F2F4F7] font-sans select-none">
      {/* 1. Underlying Real Navigable Three.js Liquid-Platinum Spatial Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {isReducedMotion ? (
          <NonWebGLFallback />
        ) : (
          <SpatialCanvas />
        )}
      </div>

      {/* 2. Floating Spatial Left Navigation Rail (VisionOS Inspired Pill) */}
      <SpatialFloatingRail />

      {/* 3. Floating Spatial Top Address & Security Capsule */}
      <SpatialTopCapsule
        onSearchClick={() => setSearchOpen(true)}
        onOpenLogin={onOpenLogin}
      />

      {/* 4. Spatial Horizon Progress Flight Bar (Visible in 3D Flight) */}
      {is3DSpace && (
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#13161B]/80 z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-[#9BA4B0] via-[#D7DBE2] to-[#FFFFFF] transition-all duration-150"
            style={{ width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%` }}
          />
        </div>
      )}

      {/* 5. Floating Spatial Workspace Window (When ActiveModule !== 'overview') */}
      {!is3DSpace && (
        <div className="absolute inset-0 z-10 pt-16 pb-20 px-3 sm:px-6 md:pl-24 md:pr-8 flex justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="flex w-full max-w-7xl gap-4 h-full pointer-events-auto">
            {/* Left Contextual Panel: Academic Navigator */}
            <AcademicNavigatorPanel
              isOpen={navigatorOpen}
              onToggle={() => setNavigatorOpen(false)}
            />

            {/* Central Primary Spatial Workspace Window */}
            <div className="flex-1 flex flex-col h-full min-w-0 rounded-3xl bg-[#13161B]/95 backdrop-blur-2xl border border-[#D7DBE2]/25 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_1px_rgba(215,219,226,0.2)] overflow-hidden transition-all duration-200">
              {/* Spatial Window Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#303642] bg-[#07080A]/60 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Return to 3D Space Button */}
                  <button
                    onClick={() => setActiveModule('overview')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E232B] hover:bg-[#D7DBE2] text-[#D7DBE2] hover:text-[#07080A] border border-[#303642] text-xs font-semibold transition-all group flex-shrink-0 shadow-sm"
                    title="Return to 3D Spatial Overview (Esc)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to 3D Space</span>
                    <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#07080A] text-[#9BA4B0] border border-[#303642] group-hover:border-[#07080A] group-hover:text-[#07080A]">
                      Esc
                    </kbd>
                  </button>

                  <div className="h-4 w-[1px] bg-[#303642] hidden sm:block" />

                  {/* Window Title & Breadcrumb */}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h1 className="text-sm sm:text-base font-bold text-[#F2F4F7] tracking-tight truncate">
                        {title}
                      </h1>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181C22] text-[#D7DBE2] border border-[#303642] hidden sm:inline flex-shrink-0">
                        {category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Window Action Controls & Panel Toggles */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setNavigatorOpen(!navigatorOpen)}
                    className={`hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                      navigatorOpen
                        ? 'bg-[#1E232B] text-[#FFFFFF] border-[#D7DBE2]/40'
                        : 'bg-transparent text-[#9BA4B0] border-[#303642] hover:text-[#F2F4F7]'
                    }`}
                    title="Toggle Academic Navigator Drawer"
                  >
                    {navigatorOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                    <span>Navigator</span>
                  </button>

                  <button
                    onClick={() => setInspectorOpen(!inspectorOpen)}
                    className={`hidden 2xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                      inspectorOpen
                        ? 'bg-[#1E232B] text-[#FFFFFF] border-[#D7DBE2]/40'
                        : 'bg-transparent text-[#9BA4B0] border-[#303642] hover:text-[#F2F4F7]'
                    }`}
                    title="Toggle Governance Inspector Drawer"
                  >
                    {inspectorOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                    <span>Inspector</span>
                  </button>
                </div>
              </div>

              {/* Subtitle Banner */}
              {subtitle && (
                <div className="px-5 py-2 bg-[#0E1116]/80 border-b border-[#222730] text-xs text-[#9BA4B0] flex items-center justify-between flex-shrink-0">
                  <span className="truncate">{subtitle}</span>
                  <span className="font-mono text-[10px] text-[#A6AFBB] hidden md:inline ml-4 flex-shrink-0">
                    APH Standard 2024-25
                  </span>
                </div>
              )}

              {/* Primary Content: Working Enterprise Tables, Forms & Adjudication Drawers */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {renderActiveModuleWorkspace()}
              </main>
            </div>

            {/* Right Contextual Panel: Governance Inspector */}
            <GovernanceInspectorPanel
              isOpen={inspectorOpen}
              onToggle={() => setInspectorOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 6. Floating Spatial Bottom Quick Dock */}
      <SpatialBottomDock />

      {/* 7. Quick Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
