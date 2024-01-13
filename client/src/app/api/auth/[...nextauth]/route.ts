
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile, token) {
        return {
          id: profile.sub,
          token: token.access_token
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        return {
          id: credentials?.id,
          name: credentials?.name,
          nickname: credentials?.nickname,
          email: credentials?.email,
          avatar: credentials?.avatar,
          provider: credentials?.provider,
          roles: credentials?.roles
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update") {
        token.id = session.id ? session.id : token.id
        token.name = session.name ? session.name : token.name
        token.email = session.email ? session.email : token.email
        token.nickname = session.nickname ? session.nickname : token.nickname
        token.avatar = session.avatar ? session.avatar : token.avatar
        token.provider = session.provider ? session.provider : token.provider
        token.roles = session.roles ? session.roles : token.roles
        token.token = session.token
      }
      const merged = {
        ...user,
        ...token,
      };
      return {
        id: merged.id,
        name: merged.name,
        email: merged.email,
        nickname: merged.nickname,
        avatar: merged.avatar,
        provider: merged.provider,
        roles: merged.roles,
        token: merged.token
      };
    },
    session: ({ session, token }: { session: any, token: any }) => {
      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
          roles: token.roles,
          nickname: token.nickname,
          avatar: token.avatar,
          provider: token.provider,
          token: token.token
        },
      }
    },
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }