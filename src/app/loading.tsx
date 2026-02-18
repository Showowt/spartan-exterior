export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-spartan-gold/20 animate-pulse" />
          {/* Inner ring */}
          <div className="absolute inset-2 border-2 border-spartan-gold/40 animate-pulse" />
          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-spartan-gold/20 animate-ping" />
          </div>
        </div>

        <p className="font-display text-spartan-gold text-lg tracking-widest animate-pulse">
          LOADING
        </p>
      </div>
    </main>
  );
}
