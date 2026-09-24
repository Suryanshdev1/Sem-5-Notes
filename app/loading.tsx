export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="nb-card flex flex-col items-center space-y-4 bg-nb-yellow px-10 py-8">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ink border-t-transparent"></div>
        <p className="font-extrabold uppercase tracking-wide">Loading Sem 5 Notes...</p>
      </div>
    </div>
  );
}