"use client";

import Link from "next/link";
import { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Link href={"/merchants"} className="text-red-800 text-center">
        Go to GetStat merchant
      </Link>
    </div>
  );
}
