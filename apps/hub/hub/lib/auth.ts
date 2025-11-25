import { create } from 'zustand';

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

export const useAuthStore = create<AuthState>((set, get) => ({
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
}));

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Set authenticated without server verification for now
    useAuthStore.getState().setAuthenticated(true);
  }
  useAuthStore.getState().setLoading(false);
}

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, setAuthenticated, setLoading, setUser } = useAuthStore();
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setAuthenticated(false);
    window.location.href = '/login';
  };
  
  return { isAuthenticated, isLoading, user, setAuthenticated, setLoading, setUser, logout };
};