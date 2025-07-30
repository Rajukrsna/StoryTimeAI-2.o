import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { login } from "@/api/login"

// Extend the User type to include token and id
declare module "next-auth" {
  interface User {
    token?: string;
    id?: string;
  }
  interface Session {
    accessToken?: string;
    userId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const result = await login(credentials.email, credentials.password)
          
          if (result.success && result.token) {
            return {
              id: result._id,
              email: credentials.email,
              token: result.token,
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("Google sign-in initiated for user:", user.email);
        try {
          // Send Google user data to your backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/api/users/google-auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              profilePicture: user.image,
            })
          })
          console.log("response:", response);
          if (response.ok) {
            const data = await response.json()
           
            user.token = data.token
            user.id = data.user.id
            return true
          }
          return false
        } catch (error) {
          console.error("Google auth backend error:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.userId = token.userId as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
}