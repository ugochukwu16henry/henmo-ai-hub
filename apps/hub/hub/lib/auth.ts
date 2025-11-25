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
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Verify token with server
    import('./api').then(({ default: api }) => {
      api.get('/secure-auth/me')
        .then(response => {
          useAuthStore.getState().setUser(response.data.data.user);
          useAuthStore.getState().setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          useAuthStore.getState().setLoading(false);
        });
    });
  } else {
    useAuthStore.getState().setLoading(false);
  }
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