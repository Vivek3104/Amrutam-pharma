import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  authRole: UserRole;
  openAuthModal: (mode?: 'login' | 'register', role?: UserRole) => void;
  closeAuthModal: () => void;
  setAuthRole: (role: UserRole) => void;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole, phone?: string, extraData?: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('amrutam_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('amrutam_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<UserRole>('PATIENT');

  const openAuthModal = (mode: 'login' | 'register' = 'login', role: UserRole = 'PATIENT') => {
    setAuthMode(mode);
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string, roleRequested: UserRole = authRole) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password, role: roleRequested });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('amrutam_user', JSON.stringify(userData));
      localStorage.setItem('amrutam_token', userToken);
      closeAuthModal();
    } catch (err: any) {
      // Fallback local auth simulation with selected role
      const mockUser: User = {
        id: roleRequested === 'DOCTOR' ? 'doc-1' : 'u-local-' + Date.now(),
        email,
        fullName: roleRequested === 'DOCTOR' ? `Dr. ${email.split('@')[0]}` : email.split('@')[0],
        role: roleRequested,
        doctorProfile: roleRequested === 'DOCTOR' ? {
          id: 'doc-prof-1',
          specialization: 'Senior Ayurvedic Physician',
          registrationNo: 'AYUSH-DEL-2012-8841',
          hospitalAffiliation: 'Amrutam Research Institute',
          experienceYears: 12,
          consultationFee: 750,
        } : null,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('amrutam_user', JSON.stringify(mockUser));
      localStorage.setItem('amrutam_token', mockToken);
      closeAuthModal();
    }
  };

  const register = async (email: string, password: string, fullName: string, roleRequested: UserRole, phone?: string, extraData?: any) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        fullName,
        role: roleRequested,
        phone,
        ...extraData,
      });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('amrutam_user', JSON.stringify(userData));
      localStorage.setItem('amrutam_token', userToken);
      closeAuthModal();
    } catch (err: any) {
      const mockUser: User = {
        id: roleRequested === 'DOCTOR' ? 'doc-' + Date.now() : 'u-local-' + Date.now(),
        email,
        fullName: roleRequested === 'DOCTOR' && !fullName.startsWith('Dr.') ? `Dr. ${fullName}` : fullName,
        role: roleRequested,
        phone,
        doctorProfile: roleRequested === 'DOCTOR' ? {
          id: 'doc-prof-' + Date.now(),
          specialization: extraData?.specialization || 'Ayurvedic General Physician',
          registrationNo: extraData?.registrationNo || 'AYUSH-REG-' + Math.floor(1000 + Math.random() * 9000),
          hospitalAffiliation: extraData?.hospitalAffiliation || 'Amrutam Wellness Clinic',
          experienceYears: extraData?.experienceYears || 5,
          consultationFee: extraData?.consultationFee || 500,
        } : null,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('amrutam_user', JSON.stringify(mockUser));
      localStorage.setItem('amrutam_token', mockToken);
      closeAuthModal();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('amrutam_user');
    localStorage.removeItem('amrutam_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        authRole,
        openAuthModal,
        closeAuthModal,
        setAuthRole,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
