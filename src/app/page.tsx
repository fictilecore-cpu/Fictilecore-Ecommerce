// app/page.tsx  (or wherever your root page file is)

import { Suspense } from 'react';
import HomePage from './components/HomePage';   // adjust path if needed

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <HomePage />
      </Suspense>
    </main>
  );
}