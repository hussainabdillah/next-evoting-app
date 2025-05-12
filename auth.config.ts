// import { NextAuthConfig } from 'next-auth';
// import CredentialProvider from 'next-auth/providers/credentials';
// import GithubProvider from 'next-auth/providers/github';

// const authConfig = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID ?? '',
//       clientSecret: process.env.GITHUB_SECRET ?? ''
//     }),
//     CredentialProvider({
//       credentials: {
//         email: {
//           type: 'email'
//         },
//         password: {
//           type: 'password'
//         }
//       },
//       async authorize(credentials, req) {
//         const user = {
//           id: '1',
//           name: 'John',
//           email: credentials?.email as string
//         };
//         if (user) {
//           // Any object returned will be saved in `user` property of the JWT
//           return user;
//         } else {
//           // If you return null then an error will be displayed advising the user to check their details.
//           return null;

//           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//         }
//       }
//     })
//   ],
//   pages: {
//     signIn: '/' //sigin page
//   }
// } satisfies NextAuthConfig;

// export default authConfig;
// auth.config.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { prisma } from "@/lib/prisma"

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name as string,
          email: user.email,
          role: user.role as "user" | "admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authConfig;
