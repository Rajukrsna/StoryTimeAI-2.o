"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export function NextAuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null; // use proper type instead of 'any'
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
