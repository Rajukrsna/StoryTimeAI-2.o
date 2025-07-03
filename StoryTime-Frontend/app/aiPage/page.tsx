"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import AiPageClient from "@/components/AiPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading AI Page...</div>}>
      <AiPageClient />
    </Suspense>
  );
}
