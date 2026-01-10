import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    email: string;
    displayName: string;
    token: string;
    roles: string[];
}

interface AuthStore {
    user: User | null;
    fullProfile: any | null;
    isAuthenticated: boolean;
    profileUpdateTick: number;
    login: (user: User) => void;
    logout: () => void;
    setUserDetails: (details: any) => void;
    refreshProfileUI: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            fullProfile: null,
            isAuthenticated: false,
            profileUpdateTick: Date.now(),
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => {
                set({ user: null, fullProfile: null, isAuthenticated: false });
                localStorage.removeItem('auth-storage'); // Explicitly clear on logout
            },
            setUserDetails: (details) => set({ fullProfile: details }),
            refreshProfileUI: () => set({ profileUpdateTick: Date.now() }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
