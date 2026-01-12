'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type PlanType = 'inicial' | 'pro' | 'premium';

interface User {
    email: string;
    name: string;
    plan: PlanType;
    avatar?: string;
    multiSession?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    checkPermission: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('ac_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (!pathname.includes('/login')) {
            router.push('/login');
        }
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        // Mock Authentication Logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API

        let mockUser: User | null = null;

        if ((email === 'admin@premium.com') || (email === 'suitmaxi@premium.com' && pass === 'maxi54321')) {
            mockUser = {
                email: 'suitmaxi@premium.com',
                name: 'Maxi (Creador)',
                plan: 'premium',
                avatar: 'https://i.pravatar.cc/150?u=maxi',
                multiSession: true
            };
            // NOTE: In a real backend, we would validate the session token here.
            // Creators like Maxi allow multiple active tokens.
            // Regular users would invalidate previous tokens upon new login.
        } else if (email === 'contador@pro.com') {
            mockUser = { email, name: 'Juan Contador', plan: 'pro', avatar: 'https://i.pravatar.cc/150?u=juan', multiSession: false };
        } else if (email === 'usuario@inicial.com') {
            mockUser = { email, name: 'Usuario Nuevo', plan: 'inicial', avatar: 'https://i.pravatar.cc/150?u=new', multiSession: false };
        } else {
            return false;
        }

        setUser(mockUser);
        localStorage.setItem('ac_user', JSON.stringify(mockUser));
        router.push('/dashboard');
        return true;
    };

    const loginWithGoogle = async () => {
        // Mock Google Login -> Defaults to Initial Plan for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockUser: User = {
            email: 'google.user@gmail.com',
            name: 'Google User',
            plan: 'inicial',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };
        setUser(mockUser);
        localStorage.setItem('ac_user', JSON.stringify(mockUser));
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ac_user');
        router.push('/login');
    };

    const checkPermission = (feature: string): boolean => {
        if (!user) return false;

        switch (feature) {
            case 'ai_unlimited':
                return user.plan === 'premium';
            case 'advanced_audit':
                return user.plan === 'pro' || user.plan === 'premium';
            case 'financial_planning':
                return true; // All plans
            default:
                return true;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout, checkPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
