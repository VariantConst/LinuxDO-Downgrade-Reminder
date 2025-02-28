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
      id: number;
      trustLevel: number;
      username: string;
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
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
        token.id = (profile as LinuxDoProfile).id;
        token.trustLevel = (profile as LinuxDoProfile).trust_level;
        token.username = (profile as LinuxDoProfile).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
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
