"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import ReadPage from "@/components/ReadClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading AI Page...</div>}>
      <ReadPage />
    </Suspense>
  );
}
