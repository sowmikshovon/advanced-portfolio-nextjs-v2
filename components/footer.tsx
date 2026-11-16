import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-600 dark:text-gray-400">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium">
        <Link
          href="/cv"
          className="inline-flex items-center rounded-md px-2.5 py-2 transition hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:hover:text-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          Web CV
        </Link>
        <a
          href="/api/cv"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md px-2.5 py-2 transition hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:hover:text-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          Download CV (PDF)
        </a>
        <a
          href="https://github.com/sowmikshovon"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md px-2.5 py-2 transition hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:hover:text-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/sowmikshovon"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md px-2.5 py-2 transition hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:hover:text-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          LinkedIn
        </a>
      </div>
      <small className="mb-2 block text-xs">
        &copy; 2026 Sowmik Shovon Karmakar. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        Next.js 16 (App Router &amp; Server Actions), React 19, TypeScript,
        Tailwind CSS v4, Framer Motion, React Email, Resend, and Vercel.
      </p>
    </footer>
  );
}
