"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import CollabPage from "@/components/CollabClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading AI Page...</div>}>
      <CollabPage />
    </Suspense>
  );
}
