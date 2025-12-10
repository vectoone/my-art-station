
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import { prisma } from "@/app/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        MicrosoftEntraId
    ],
    callbacks: {
        async session({ session, user }) {
            // Append user credits and plan to the session
            if (session.user) {
                session.user.id = user.id;
                // @ts-ignore // Extending session type manually or ignoring for speed
                session.user.credits = user.credits;
                // @ts-ignore
                session.user.plan = user.plan;
            }
            return session;
        },
        // The default signIn callback handles checking if user exists implicitly via the Adapter.
        // If we want specific logic (like awarding free credits on FIRST creation), PrismaAdapter handles creation.
        // However, our schema sets default credits to 3, so new users automatically get 3 credits!
        // We don't need custom signIn logic for that.
    },
    pages: {
        // signIn: '/auth/signin', // Default is fine for now
    }
});
