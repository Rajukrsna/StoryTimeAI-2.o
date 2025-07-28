// StoryTime-Frontend/app/auth/error/page.tsx
'use client';

import { Suspense } from 'react';
import AuthErrorContent from '@/components/AuthErrorContent'; // Import your error content component
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading error details..." />}>
      <AuthErrorContent />
    </Suspense>
  );
}
