import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/utils/apolloClient";
import { GOOGLE_AUTH } from "@/graphql/mutation/GoogleAuth";
import { NextAuthOptions } from "next-auth";
import { headers } from 'next/headers'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile, token) {
        const user = await client.mutate({
          mutation: GOOGLE_AUTH,
          variables: {
            token: token.access_token,
          },
          context: {
            headers: {
              'user-agent': headers().get('user-agent')
            }
          }
        })
        return {
          id: user.data.googleAuth.id,
          name: user.data.googleAuth.name,
          nickname: user.data.googleAuth.nickname,
          email: user.data.googleAuth.email,
          avatar: user.data.googleAuth.avatar,
          provider: user.data.googleAuth.provider,
          roles: user.data.googleAuth.roles,
        }

      }
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
        provider: merged.provider,
        roles: merged.roles
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
        },
      }
    },
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }