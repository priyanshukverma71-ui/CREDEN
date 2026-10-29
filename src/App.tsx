import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/ui/Navbar';
import { DemoWorkflowBanner } from './components/ui/DemoWorkflowBanner';
import { SpatialCanvas } from './components/3d/SpatialCanvas';
import { NonWebGLFallback } from './components/3d/NonWebGLFallback';
import { OverviewHUD } from './components/ui/OverviewHUD';
import { SmokedGlassModal } from './components/ui/SmokedGlassModal';
import { SearchModal } from './components/ui/SearchModal';
import { LoginPage } from './components/auth/LoginPage';

// Workspaces
import { InstitutionWorkspace } from './components/workspaces/InstitutionWorkspace';
import { StudentDataWorkspace } from './components/workspaces/StudentDataWorkspace';
import { ApaarValidationWorkspace } from './components/workspaces/ApaarValidationWorkspace';
import { AdmissionMonitoringWorkspace } from './components/workspaces/AdmissionMonitoringWorkspace';
import { DuplicateDetectionWorkspace } from './components/workspaces/DuplicateDetectionWorkspace';
import { ComplianceCentreWorkspace } from './components/workspaces/ComplianceCentreWorkspace';
import { StudentVerificationWorkspace } from './components/workspaces/StudentVerificationWorkspace';
import { ReportsAnalyticsWorkspace } from './components/workspaces/ReportsAnalyticsWorkspace';
import { AuditSecurityWorkspace } from './components/workspaces/AuditSecurityWorkspace';
import { SystemIntegrationWorkspace } from './components/workspaces/SystemIntegrationWorkspace';

const MainPortalView: React.FC = () => {
  const { user } = useAuth();
  const {
    activeModule,
    isWorkspaceOpen,
    closeWorkspace,
    isReducedMotion,
    scrollProgress,
  } = usePortal();

  const [searchOpen, setSearchOpen] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Global Ctrl+K shortcut for search
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

  const getWorkspaceTitle = () => {
    switch (activeModule) {
      case 'institutions':
        return { title: 'Institution Management', subtitle: 'AICTE Approved Technical Institutions & Programmes' };
      case 'students':
        return { title: 'Student Data Submission', subtitle: 'Academic Ingestion & Smart Bulk Upload Assistant' };
      case 'apaar':
        return { title: 'APAAR ID Validation', subtitle: 'Deterministic Syntax & DigiLocker / ABC Registry Verification' };
      case 'admissions':
        return { title: 'Admission Monitoring', subtitle: 'Approved Intake Sanction vs Actual Enrolment Compliance' };
      case 'duplicates':
        return { title: 'Duplicate Record Detection', subtitle: 'Cross-Institution Concurrent Enrolment & Fuzzy Identity Matches' };
      case 'compliance':
        return { title: 'Compliance Action Centre', subtitle: 'Regulatory Discrepancies & Hearing Work Queue' };
      case 'verification':
        return { title: 'Student Verification Portal', subtitle: 'Authorized Minimal Disclosure & QR Attestation Checking' };
      case 'reports':
        return { title: 'Reports & Analytics', subtitle: 'Data Quality Index & Longitudinal Technical Enrolment Trends' };
      case 'audit':
        return { title: 'Audit & Security', subtitle: 'Tamper-Evident SHA-256 Chained Integrity Logs' };
      case 'integration':
        return { title: 'System Integration Hub', subtitle: 'OpenAPI 3.0 & Government Registry Gateway Status' };
      default:
        return { title: 'AICTE Portal', subtitle: 'Technical Education Data Governance' };
    }
  };

  const renderActiveWorkspace = () => {
    switch (activeModule) {
      case 'institutions':
        return <InstitutionWorkspace />;
      case 'students':
        return <StudentDataWorkspace />;
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
        return null;
    }
  };

  const { title, subtitle } = getWorkspaceTitle();

  if ((!user && !guestMode) || showLoginView) {
    return (
      <LoginPage
        onSuccess={() => {
          setShowLoginView(false);
          setGuestMode(false);
        }}
        onContinueAsGuest={() => {
          setGuestMode(true);
          setShowLoginView(false);
        }}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-midnight select-none">
      {/* Top Navigation */}
      <Navbar onSearchClick={() => setSearchOpen(true)} onOpenLogin={() => setShowLoginView(true)} />

      {/* Main 3D Spatial Canvas or Non-WebGL Accessible Fallback */}
      {isReducedMotion ? (
        <div className="w-full h-full overflow-y-auto">
          <NonWebGLFallback />
        </div>
      ) : (
        <>
          <SpatialCanvas />

          {/* Foreground HUD Cockpit docked at bottom center if not in modal */}
          {!isWorkspaceOpen && activeModule === 'overview' && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-20 pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-300">
              <OverviewHUD />
            </div>
          )}

          {/* Discreet Horizontal Scroll Flight Tracker Bar */}
          <div className="fixed bottom-0 left-0 right-0 h-1 bg-graphite/40 z-30">
            <div
              className="h-full bg-gradient-to-r from-liquid-silver to-platinum transition-all duration-150"
              style={{ width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%` }}
            />
          </div>
        </>
      )}

      {/* Interactive Smoked Glass Workspace Modal */}
      <SmokedGlassModal
        isOpen={isWorkspaceOpen && activeModule !== 'overview'}
        onClose={closeWorkspace}
        title={title}
        subtitle={subtitle}
      >
        {renderActiveWorkspace()}
      </SmokedGlassModal>

      {/* Bottom SIH Guided Demonstration Banner */}
      <DemoWorkflowBanner />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <PortalProvider>
        <MainPortalView />
      </PortalProvider>
    </AuthProvider>
  );
}

export default App;
