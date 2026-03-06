import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const allowed = await prisma.allowedEmail.findUnique({
        where: { email: user.email },
      });
      return !!allowed;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          (session.user as { role?: string }).role = dbUser.role;
          (session.user as { id?: string }).id = dbUser.id;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user?.email) {
        const allowed = await prisma.allowedEmail.findUnique({
          where: { email: user.email },
        });
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name, image: user.image as string | undefined },
          create: {
            email: user.email,
            name: user.name,
            image: user.image as string | undefined,
            role: allowed?.role || 'staff',
          },
        });
      }
      return token;
    },
  },
  cookies: {
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
