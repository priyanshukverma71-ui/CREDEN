import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { EnterpriseSidebar } from './EnterpriseSidebar';
import { EnterpriseTopNav } from './EnterpriseTopNav';
import { SearchModal } from '../ui/SearchModal';
import { SpatialCanvas } from '../3d/SpatialCanvas';
import { NonWebGLFallback } from '../3d/NonWebGLFallback';
import { ArrowLeft, Compass, Shield } from 'lucide-react';

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
    setViewMode,
    isReducedMotion,
    scrollProgress,
  } = usePortal();

  const [searchOpen, setSearchOpen] = useState(false);

  // Global Keyboard shortcuts: Escape to return to 3D, Ctrl+K for search
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
        };
      case 'students':
        return {
          title: 'Student Registry',
          subtitle: 'Institutional Enrolment Directory, APAAR Records & Digital Credential Verification',
        };
      case 'submissions':
        return {
          title: 'Student Data Submission',
          subtitle: 'Smart Batch CSV Ingestion, Verhoeff Checksum Engine & Intake Quota Pre-Check',
        };
      case 'apaar':
        return {
          title: 'APAAR ID Validation Engine',
          subtitle: '12-Digit Verhoeff Structural Verification & DigiLocker / ABC Registry Gateway',
        };
      case 'admissions':
        return {
          title: 'Admission & Intake Monitoring',
          subtitle: 'Approved Capacity Sanctions vs Real-Time Actual Student Admissions',
        };
      case 'duplicates':
        return {
          title: 'Duplicate Record Review Bureau',
          subtitle: 'Cross-Institution Concurrent Enrolment & Fuzzy Identity Conflict Adjudication',
        };
      case 'compliance':
        return {
          title: 'Compliance Action Centre',
          subtitle: 'APH 2024-25 Regulatory Discrepancies, Hearing Work Queue & Sanctions',
        };
      case 'verification':
        return {
          title: 'Student Verification Bureau',
          subtitle: 'Zero-Knowledge Minimal Disclosure & HMAC-SHA256 QR Attestation Checking',
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'National Technical Education Data Quality Index & Longitudinal Enrolment Trends',
        };
      case 'audit':
        return {
          title: 'Audit & Tamper Logs',
          subtitle: 'Cryptographically Chained SHA-256 Tamper-Evident Ledger & Chain Integrity Verification',
        };
      case 'integration':
        return {
          title: 'System Integration Settings',
          subtitle: 'Government Registry Gateways (DigiLocker, NDEAR) & OpenAPI 3.0 Specs',
        };
      default:
        return {
          title: 'Executive Governance Cockpit',
          subtitle: 'National Academic Data Summary & Performance Indicators',
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

  const { title, subtitle } = getWorkspaceMeta(activeModule);
  const is3DSpace = activeModule === 'overview' && viewMode !== 'grid';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090B] text-[#F1F3F5]">
      {/* Enterprise Left Sidebar */}
      <EnterpriseSidebar />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        {/* Slim Top Navigation */}
        <EnterpriseTopNav
          onSearchClick={() => setSearchOpen(true)}
          onOpenLogin={onOpenLogin}
        />

        {/* Dynamic Canvas: 3D Spatial Overview on Opening Page OR Full Open Page Workspace */}
        {is3DSpace ? (
          <div className="relative flex-1 w-full h-full overflow-hidden select-none animate-in fade-in duration-200">
            {isReducedMotion ? (
              <NonWebGLFallback />
            ) : (
              <>
                {/* Crystal-Clear 3D Spatial Panoramic Canvas */}
                <SpatialCanvas />

                {/* Horizontal Flight Progress Bar at bottom */}
                <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#1A1D22] z-30">
                  <div
                    className="h-full bg-gradient-to-r from-[#929AA5] via-[#CBD5E1] to-[#FFFFFF] transition-all duration-150"
                    style={{ width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%` }}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          /* FULL OPEN PAGE WORKSPACE (Fluid, Full Width & Height, Flawless Smooth Flow) */
          <main className="flex-1 overflow-y-auto bg-[#08090B] p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Full Page Header with Quick Return to 3D Space */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#22262C]">
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => setActiveModule('overview')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14171E] hover:bg-[#1C2027] border border-[#262C36] hover:border-[#D2D6DC] text-xs font-medium text-[#D2D6DC] hover:text-white transition-all shadow-sm group flex-shrink-0"
                    title="Return to 3D Spatial Overview (Esc)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to 3D Space</span>
                    <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B0C0E] text-[#929AA5] border border-[#22262C]">
                      Esc
                    </kbd>
                  </button>

                  <div className="h-5 w-[1px] bg-[#22262C] hidden sm:block" />

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base sm:text-lg font-bold text-[#F1F3F5] tracking-tight">
                        {title}
                      </h1>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16191F] text-[#D2D6DC] border border-[#282E37] flex-shrink-0">
                        AICTE Portal
                      </span>
                    </div>
                    {subtitle && (
                      <p className="text-xs text-[#929AA5] mt-0.5 leading-snug">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                  <span className="text-[11px] font-mono text-[#929AA5] hidden md:inline">
                    APH 2024-25 Standard
                  </span>
                </div>
              </div>

              {/* Workspace Content: High-density Data Tables, Forms & Adjudication Drawers */}
              <div className="space-y-4">
                {renderActiveModuleWorkspace()}
              </div>
            </div>
          </main>
        )}

        {/* Global Quick Search Modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </div>
  );
};
