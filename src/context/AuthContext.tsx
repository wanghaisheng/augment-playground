import React, { createContext, useContext, ReactNode, useMemo } from 'react';

interface User {
  id: string;
  name?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: () => void; // Placeholder
  logout: () => void; // Placeholder
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // This is a placeholder. Replace with actual authentication logic.
  const currentUser: User | null = { id: 'current-user', name: 'Placeholder User' }; // Mocked user
  const isLoading = false;

  const login = () => console.log('Login action triggered (placeholder)');
  const logout = () => console.log('Logout action triggered (placeholder)');

  const value = useMemo(() => ({
    currentUser,
    isLoading,
    login,
    logout,
  }), [currentUser, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 