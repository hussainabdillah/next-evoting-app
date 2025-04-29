// import NextAuth, { DefaultSession } from 'next-auth';

// declare module 'next-auth' {
//   type UserSession = DefaultSession['user'];
//   interface Session {
//     user: UserSession;
//   }

//   interface CredentialsInputs {
//     email: string;
//     password: string;
//   }
// }
import { Session as NextAuthSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "user" | "admin" 
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin" 
  }

  interface JWT extends NextAuthJWT {
    id: string
    role: "user" | "admin"
  }
}

