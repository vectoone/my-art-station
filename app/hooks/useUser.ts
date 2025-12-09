
'use client';

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

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

    const user = session?.user ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatarUrl: session.user.image || `https://picsum.photos/seed/user/200/200`,
        // @ts-ignore
        credits: session.user.credits || 0,
        // @ts-ignore
        plan: session.user.plan || 'free',
        id: session.user.id || "",
    } : null;

    const login = (provider: 'google' | 'microsoft') => {
        // Map 'microsoft' to 'microsoft-entra-id' if that's the provider ID
        const providerId = provider === 'microsoft' ? 'microsoft-entra-id' : provider;
        signIn(providerId);
    };

    const logoutUser = () => {
        signOut();
    }

    const deductCredits = async (amount: number) => {
        // Optimistic update or refetch session
        // For now, we rely on the API call to update the DB, then we trigger session update
        await update();
    };

    return {
        user,
        isLoggedIn: status === "authenticated",
        isLoading: status === "loading",
        login,
        logout: logoutUser,
        deductCredits,
    };
}
