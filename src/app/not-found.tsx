import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="font-display text-8xl font-bold text-spartan-gradient">
            404
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold text-spartan-cream mb-4">
          PAGE NOT FOUND
        </h1>

        <p className="text-spartan-cream/70 mb-8">
          This territory has not been conquered yet. Return to base camp and
          regroup.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-spartan px-8 py-3 text-sm">
            RETURN HOME
          </Link>

          <a href="tel:7025093854" className="btn-emerald px-8 py-3 text-sm">
            CALL (702) 509-3854
          </a>
        </div>
      </div>
    </main>
  );
}
