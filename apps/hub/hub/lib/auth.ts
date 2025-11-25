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

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // Set to true for development
  isLoading: false, // Set to false for development
  user: {
    id: '1',
    name: 'Henry Maobughichi Ugochukwu',
    email: 'henryugochukwu@gmail.com',
    role: 'super_admin',
    assigned_country: 'Global'
  }, // Mock user for development
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  setUser: (user) => set({ user }),
}));

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, setAuthenticated, setLoading, setUser } = useAuthStore();
  return { isAuthenticated, isLoading, user, setAuthenticated, setLoading, setUser };
};