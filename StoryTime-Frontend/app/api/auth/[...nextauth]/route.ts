import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Add error handling for debugging
let handler;

try {
  handler = NextAuth(authOptions)
} catch (error) {
  console.error("NextAuth configuration error:", error)
  throw error
}

export { handler as GET, handler as POST }