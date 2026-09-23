export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      {/* Tailwind CSS Spinner */}
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading Sem 5 Notes...</p>
    </div>
  );
}