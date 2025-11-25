import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  assigned_country?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(subscribeWithSelector((set, get) => ({
  isAuthenticated: true,
  isLoading: false,
  user: {
    id: '1',
    name: 'Henry Maobughichi Ugochukwu',
    email: 'ugochukwuhenry16@gmail.com',
    username: 'ugochukwuhenry',
    role: 'super_admin',
    assigned_country: 'Global'
  },
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
})));

// Initialize auth state with performance optimization
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for non-critical initialization
  const initAuth = () => {
    useAuthStore.getState().setLoading(false);
  };
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAuth);
  } else {
    setTimeout(initAuth, 0);
  }
}

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, setAuthenticated, setLoading, setUser } = useAuthStore();
  
  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    window.location.href = '/login';
  };
  
  return { isAuthenticated, isLoading, user, setAuthenticated, setLoading, setUser, logout };
};