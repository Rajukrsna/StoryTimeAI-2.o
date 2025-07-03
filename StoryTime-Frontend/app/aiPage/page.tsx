// app/aiPage/page.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AiPageClient = dynamic(() => import("@/components/AiPageClient"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading AI Page...</div>}>
      <AiPageClient />
    </Suspense>
  );
}
