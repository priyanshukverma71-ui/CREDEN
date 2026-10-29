import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModuleId, NotificationItem } from '../types';
import { useAuth } from './AuthContext';

interface PortalContextType {
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;
  isWorkspaceOpen: boolean;
  openWorkspace: (mod: ModuleId) => void;
  closeWorkspace: () => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  cameraTargetX: number;
  setCameraTargetX: (x: number) => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  sihStep: number;
  setSihStep: (step: number) => void;
  advanceSihStep: () => void;
}

// Module coordinates mapped horizontally along X axis
export const MODULE_COORDINATES: Record<ModuleId, number> = {
  overview: 0,
  institutions: -18,
  students: -14,
  apaar: -10,
  admissions: -6,
  duplicates: -2,
  compliance: 2,
  verification: 6,
  reports: 10,
  audit: 14,
  integration: 18,
  settings: 0,
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0.5); // centered at overview initially
  const [cameraTargetX, setCameraTargetX] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [sihStep, setSihStep] = useState<number>(1);
  const { token } = useAuth();

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

  const openWorkspace = (mod: ModuleId) => {
    setActiveModule(mod);
    const targetX = MODULE_COORDINATES[mod] ?? 0;
    setCameraTargetX(targetX);
    setIsWorkspaceOpen(true);
  };

  const closeWorkspace = () => {
    setIsWorkspaceOpen(false);
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
        scrollProgress,
        setScrollProgress,
        cameraTargetX,
        setCameraTargetX,
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
