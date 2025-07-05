"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import AiPageClient from "@/components/AiPageClient";

export default function Page() {
  return (
    <Suspense
  fallback={
    <div className="p-10 flex flex-col items-center justify-center gap-4 text-white">
      <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      <div className="text-lg">Loading AI Page...</div>
    </div>
  }
>
  <AiPageClient />
</Suspense>

  );
}
