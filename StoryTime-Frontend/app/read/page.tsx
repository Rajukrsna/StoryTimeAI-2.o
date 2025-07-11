// StoryTime-Frontend/app/read/page.tsx
"use client"; // 👈 THIS IS CRUCIAL

import { Suspense } from "react";
import ReadPage from "@/components/ReadClient";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import the LoadingSpinner

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading chapter..." />}>
      <ReadPage />
    </Suspense>
  );
}
