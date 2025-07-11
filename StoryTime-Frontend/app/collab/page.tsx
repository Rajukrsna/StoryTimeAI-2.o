// StoryTime-Frontend/app/collab/page.tsx
"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import CollabPage from "@/components/CollabClient";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import the LoadingSpinner

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading collaboration page..." />}>
      <CollabPage />
    </Suspense>
  );
}
