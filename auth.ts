// auth.ts
// import NextAuth from "next-auth"
// import authConfig from "./auth.config"

// export const { auth, handlers, signIn, signOut } = NextAuth(authConfig)

// auth.ts
import { getServerSession } from "next-auth"
import authConfig from "./auth.config"

export const auth = () => getServerSession(authConfig)
