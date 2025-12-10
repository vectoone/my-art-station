
'use client';

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { handleSignOut } from "@/app/actions";

export interface User {
    name: string;
    email: string;
    avatarUrl: string;
    credits: number;
    plan: 'free' | 'pro';
    id: string;
}

export function useUser() {
    const { data: session, status, update } = useSession();

    // MOCK MODE CONFIG
    const MOCK_MODE = false; // process.env.NODE_ENV === 'development' && !session;

    // Default Mock User
    const mockUser: User = {
        name: "Guest Artist",
        email: "guest@example.com",
        avatarUrl: "https://picsum.photos/seed/guest/200/200",
        credits: 3,
        plan: 'free',
        id: "mock-user-id"
    };

    const [localCredits, setLocalCredits] = useState(mockUser.credits);

    const user = MOCK_MODE ? { ...mockUser, credits: localCredits } : (session?.user ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatarUrl: session.user.image || `https://picsum.photos/seed/user/200/200`,
        // @ts-ignore
        credits: session.user.credits || 0,
        // @ts-ignore
        plan: session.user.plan || 'free',
        id: session.user.id || "",
    } : null);

    const login = (provider: 'google' | 'microsoft') => {
        // Map 'microsoft' to 'microsoft-entra-id' if that's the provider ID
        const providerId = provider === 'microsoft' ? 'microsoft-entra-id' : provider;
        console.log(`[useUser] Logging in with ${providerId}...`);
        signIn(providerId);
    };

    const logoutUser = async () => {
        console.log("[useUser] Logging out...");
        await handleSignOut();
    }

    const deductCredits = async (amount: number) => {
        if (MOCK_MODE) {
            setLocalCredits(prev => Math.max(0, prev - amount));
            return;
        }
        // Optimistic update or refetch session
        // For now, we rely on the API call to update the DB, then we trigger session update
        await update();
    };

    return {
        user,
        isLoggedIn: status === "authenticated" || MOCK_MODE,
        isLoading: status === "loading" && !MOCK_MODE,
        login,
        logout: logoutUser,
        deductCredits,
    };
}
