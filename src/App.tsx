import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalProvider } from './context/PortalContext';
import { LoginPage } from './components/auth/LoginPage';
import { EnterpriseLayout } from './components/layout/EnterpriseLayout';

const MainPortalView: React.FC = () => {
  const { user } = useAuth();
  const [showLoginView, setShowLoginView] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

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
