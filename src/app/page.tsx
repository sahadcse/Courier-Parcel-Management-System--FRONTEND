// Home Page.tsx
// src/app/page.tsx
import Link from 'next/link';
import TestComponent from '@/components/TestComponent';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <TestComponent />
      <div className="mt-8 flex gap-4">
        <Link href="/login" className="bg-secondary-500 text-white px-6 py-2 rounded hover:bg-secondary-700">
          Login
        </Link>
        <Link href="/register" className="border border-primary-500 text-primary-500 px-6 py-2 rounded hover:bg-primary-50">
          Register
        </Link>
      </div>
    </main>
  );
}