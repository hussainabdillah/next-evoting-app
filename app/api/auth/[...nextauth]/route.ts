import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        // Check if the user is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in.');
        }

        return {
          id: user.id,
          name: user.name as string,
          email: user.email,
          role: user.role as "admin" | "user",
          status: user.status as "Verified" | "Not Verified",
          hasVoted: user.hasVoted
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role // Menyimpan role pada JWT
        token.status = user.status // Menyimpan status pada JWT
        token.hasVoted = user.hasVoted
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "user" | "admin" // Menyinkronkan tipe role
        session.user.status = token.status as "Verified" | "Not Verified" // Menyimpan ke session
        session.user.hasVoted = token.hasVoted as boolean
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
})

export { handler as GET, handler as POST }
