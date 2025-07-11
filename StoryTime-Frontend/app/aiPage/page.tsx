// StoryTime-Frontend/app/aiPage/page.tsx
"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import AiPageClient from "@/components/AiPageClient";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import the LoadingSpinner

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading AI page..." />}>
      <AiPageClient />
    </Suspense>
  );
}
