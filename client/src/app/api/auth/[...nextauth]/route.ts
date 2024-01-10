import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: {},
        name: {},
        nickname: {},
        email: {},
        avatar: {},
        provider: {},
      },
      async authorize(credentials) {
        return {
          id: credentials?.id,
          name: credentials?.name,
          nickname: credentials?.nickname,
          email: credentials?.email,
          avatar: credentials?.avatar,
          provider: credentials?.provider
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      const merged = {
        ...token,
        ...user,
      };
      return {
        id: merged.id,
        name: merged.name,
        email: merged.email,
        nickname: merged.nickname,
        avatar: merged.avatar,
        provider: merged.provider
      };
    },
    session: ({ session, token }: { session: any, token: any }) => {
      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
          nickname: token.nickname,
          avatar: token.avatar,
          provider: token.provider,
        },
      }
    },
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }