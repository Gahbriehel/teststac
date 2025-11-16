"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-sm border rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Welcome to TestStat
        </h1>

       

        <Link
          href="/merchants"
          className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Go to Merchant Login
        </Link>
      </div>
    </main>
  );
}
