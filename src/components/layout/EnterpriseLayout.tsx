import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { EnterpriseSidebar } from './EnterpriseSidebar';
import { EnterpriseTopNav } from './EnterpriseTopNav';
import { SearchModal } from '../ui/SearchModal';
import { SmokedGlassModal } from '../ui/SmokedGlassModal';
import { SpatialCanvas } from '../3d/SpatialCanvas';
import { NonWebGLFallback } from '../3d/NonWebGLFallback';

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
    isWorkspaceOpen,
    openWorkspace,
    closeWorkspace,
    viewMode,
    isReducedMotion,
    scrollProgress,
  } = usePortal();

  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K shortcut listener for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

        {/* 3D Spatial Panoramic Environment (Living in Background) */}
        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
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

        {/* Pop-up Form Transition Workspace Modal */}
        <SmokedGlassModal
          isOpen={isWorkspaceOpen && activeModule !== 'overview'}
          onClose={closeWorkspace}
          title={title}
          subtitle={subtitle}
        >
          {renderActiveModuleWorkspace()}
        </SmokedGlassModal>

        {/* Global Quick Search Modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </div>
  );
};
