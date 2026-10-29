import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { EnterpriseSidebar } from './EnterpriseSidebar';
import { EnterpriseTopNav } from './EnterpriseTopNav';
import { DemoWorkflowBanner } from '../ui/DemoWorkflowBanner';
import { SearchModal } from '../ui/SearchModal';
import { SpatialCanvas } from '../3d/SpatialCanvas';
import { NonWebGLFallback } from '../3d/NonWebGLFallback';
import { OverviewHUD } from '../ui/OverviewHUD';

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

  // Ctrl+K shortcut listener
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

  // Show 3D Spatial Canvas on opening page (overview) by default, or when in panoramic viewMode
  const show3DSpatial = (activeModule === 'overview' && viewMode !== 'grid') || viewMode === 'panoramic';

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090B] text-[#F1F3F5]">
      {/* Enterprise Left Sidebar */}
      <EnterpriseSidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        {/* Slim Top Navigation */}
        <EnterpriseTopNav
          onSearchClick={() => setSearchOpen(true)}
          onOpenLogin={onOpenLogin}
        />

        {/* Dynamic Canvas: Spatial 3D Environment on Opening Page OR Enterprise Workspaces */}
        {show3DSpatial ? (
          <div className="relative flex-1 w-full h-full overflow-hidden select-none">
            {isReducedMotion ? (
              <NonWebGLFallback />
            ) : (
              <>
                {/* Full, Crystal-Clear 3D Spatial Canvas */}
                <SpatialCanvas />

                {/* Floating Overview HUD docked neatly at bottom */}
                <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-20 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <OverviewHUD />
                </div>

                {/* Horizontal Flight Progress Bar */}
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
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 space-y-4">
            <div className="max-w-7xl mx-auto">
              {renderActiveModuleWorkspace()}
            </div>
          </main>
        )}

        {/* SIH Demonstration Step Workflow Banner docked at bottom */}
        <DemoWorkflowBanner />

        {/* Global Quick Search Modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </div>
  );
};
