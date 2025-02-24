import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

interface LinuxDoProfile {
  id: number;
  name?: string;
  username: string;
  trust_level: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      trustLevel: number;
      username: string;
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    trustLevel: number;
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "linuxdo",
      name: "Linux DO",
      type: "oauth",
      authorization: {
        url: "https://connect.linux.do/oauth2/authorize",
        params: {
          response_type: "code",
        },
      },
      token: "https://connect.linux.do/oauth2/token",
      userinfo: "https://connect.linux.do/api/user",
      profile(profile: LinuxDoProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.username,
          username: profile.username,
          trustLevel: profile.trust_level,
        };
      },
      clientId: process.env.LINUXDO_CLIENT_ID!,
      clientSecret: process.env.LINUXDO_CLIENT_SECRET!,
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.trustLevel = (profile as LinuxDoProfile).trust_level;
        token.username = (profile as LinuxDoProfile).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.trustLevel = token.trustLevel;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
