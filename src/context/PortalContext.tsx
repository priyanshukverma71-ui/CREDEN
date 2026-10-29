import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModuleId, NotificationItem } from '../types';
import { useAuth } from './AuthContext';

export type ViewMode = 'enterprise' | 'panoramic' | 'grid';

interface PortalContextType {
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;
  isWorkspaceOpen: boolean;
  openWorkspace: (mod: ModuleId) => void;
  closeWorkspace: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  cameraTargetX: number;
  setCameraTargetX: (x: number) => void;
  carouselIndex: number;
  setCarouselIndex: (idx: number) => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  sihStep: number;
  setSihStep: (step: number) => void;
  advanceSihStep: () => void;
}

export const CAROUSEL_MODULES_LIST: {
  id: ModuleId;
  category: string;
  title: string;
  subtitle: string;
}[] = [
  { id: 'trustgraph', category: 'Intelligence & Graph AI', title: 'CREDEN TrustGraph', subtitle: 'Interactive 3D entity relationship map, duplicate radar & record provenance' },
  { id: 'institutions', category: 'Institutional Oversight', title: 'Institution Management', subtitle: 'Approved technical institutions, programmes & statutory capacity' },
  { id: 'submissions', category: 'Student Data Ops', title: 'Student Data Submission', subtitle: 'Batch CSV ingestion, Verhoeff checksum & quota pre-check' },
  { id: 'apaar', category: 'Verification & Integrity', title: 'APAAR ID Validation', subtitle: '12-digit Verhoeff structural verification & ABC gateway' },
  { id: 'admissions', category: 'Institutional Oversight', title: 'Admission Monitoring', subtitle: 'Approved capacity sanctions vs real-time actual student enrolments' },
  { id: 'duplicates', category: 'Verification & Integrity', title: 'Duplicate Record Detection', subtitle: 'Cross-institution concurrent enrolment & fuzzy identity conflicts' },
  { id: 'compliance', category: 'Regulatory Compliance', title: 'Compliance Monitoring', subtitle: 'APH 2024-25 regulatory discrepancies, hearings & sanctions' },
  { id: 'verification', category: 'Attestation Bureau', title: 'Student Record Verification', subtitle: 'Zero-knowledge verification & SHA-256 QR attestation checking' },
  { id: 'reports', category: 'Assurance & Integration', title: 'Reports and Analytics', subtitle: 'National data quality index & longitudinal enrolment analytics' },
  { id: 'audit', category: 'Security Assurance', title: 'Audit and Security', subtitle: 'Cryptographically chained SHA-256 tamper-evident security ledger' },
  { id: 'integration', category: 'System Gateways', title: 'System Integration', subtitle: 'Government registry gateways (DigiLocker, ABC) & API specs' },
];

// Module coordinates mapped horizontally along X axis with generous negative space
export const MODULE_COORDINATES: Record<ModuleId, number> = {
  overview: 0,
  trustgraph: -22,
  institutions: -18,
  submissions: -14,
  apaar: -10,
  admissions: -6,
  duplicates: -2,
  compliance: 2,
  verification: 6,
  reports: 10,
  audit: 14,
  integration: 18,
  students: -14,
  settings: 0,
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('enterprise');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0.5); // centered at overview initially
  const [cameraTargetX, setCameraTargetX] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndexState] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [sihStep, setSihStep] = useState<number>(1);
  const { token } = useAuth();

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'panoramic' || (activeModule === 'overview' && prev !== 'grid') ? 'grid' : 'panoramic'));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.warn('Could not load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [token]);

  const setCarouselIndex = (idx: number) => {
    const total = CAROUSEL_MODULES_LIST.length;
    const normalized = ((idx % total) + total) % total;
    setCarouselIndexState(normalized);
  };

  const openWorkspace = (mod: ModuleId) => {
    setActiveModule(mod);
    const foundIdx = CAROUSEL_MODULES_LIST.findIndex((m) => m.id === mod);
    if (foundIdx !== -1) {
      setCarouselIndexState(foundIdx);
    }
    const targetX = MODULE_COORDINATES[mod] ?? 0;
    setCameraTargetX(targetX);
    setIsWorkspaceOpen(mod !== 'overview');
  };

  const closeWorkspace = () => {
    setIsWorkspaceOpen(false);
    setActiveModule('overview');
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion((prev) => !prev);
  };

  const markNotificationsAsRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.warn('Could not mark read');
    }
  };

  const advanceSihStep = () => {
    setSihStep((prev) => (prev < 11 ? prev + 1 : 1));
  };

  return (
    <PortalContext.Provider
      value={{
        activeModule,
        setActiveModule,
        isWorkspaceOpen,
        openWorkspace,
        closeWorkspace,
        viewMode,
        setViewMode,
        toggleViewMode,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        scrollProgress,
        setScrollProgress,
        cameraTargetX,
        setCameraTargetX,
        carouselIndex,
        setCarouselIndex,
        isReducedMotion,
        toggleReducedMotion,
        notifications,
        unreadNotificationCount: unreadCount,
        markNotificationsAsRead,
        sihStep,
        setSihStep,
        advanceSihStep,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) throw new Error('usePortal must be used within a PortalProvider');
  return context;
};
