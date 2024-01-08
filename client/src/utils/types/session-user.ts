import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string | null
    name?: string | null
    nickname?: string | null
    email?: string | null
    avatar?: string | null
    provider?: string | null
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}