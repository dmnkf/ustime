import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '../lib/auth-client';

interface User {
    id: string;
    email?: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
}

interface Session {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: sessionData, isPending, error } = authClient.useSession();

    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000"
        });
    };

    const signInWithApple = async () => {
        await authClient.signIn.social({
            provider: "apple",
            callbackURL: "http://localhost:3000"
        });
    };

    const signOut = async () => {
        await authClient.signOut();
    };

    return (
        <AuthContext.Provider value={{
            session: sessionData?.session || null,
            user: sessionData?.user || null,
            loading: isPending,
            signInWithGoogle,
            signInWithApple,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
