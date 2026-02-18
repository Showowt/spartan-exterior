"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-spartan-gold/10 border border-spartan-gold/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-spartan-gold"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-bold text-spartan-cream mb-4">
          BATTLE INTERRUPTED
        </h1>

        <p className="text-spartan-cream/70 mb-8">
          Something went wrong on our end. Our Spartan warriors are working to
          fix this.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-spartan px-8 py-3 text-sm"
            type="button"
          >
            TRY AGAIN
          </button>

          <a href="tel:7025093854" className="btn-emerald px-8 py-3 text-sm">
            CALL (702) 509-3854
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-spartan-cream/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
