import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalProvider } from './context/PortalContext';
import { LoginPage } from './components/auth/LoginPage';
import { EnterpriseLayout } from './components/layout/EnterpriseLayout';

const MainPortalView: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showLoginView, setShowLoginView] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center spatial-ambient-bg select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading CREDEN...</span>
        </div>
      </div>
    );
  }

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

  return <EnterpriseLayout onOpenLogin={() => setShowLoginView(true)} />;
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
