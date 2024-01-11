import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
    name?: string
    nickname?: string
    email?: string
    avatar?: string
    provider?: string
    roles?: string[]
  }

  interface Session extends NextAuth.Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    name?: string
    nickname?: string
    email?: string
    avatar?: string
    provider?: string
    roles?: string[]
  }
}

