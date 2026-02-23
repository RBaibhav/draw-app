export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-100 border-r-neutral-300 animate-spin"></div>
      </div>
      <span className="ml-4 text-gray-300 text-lg font-semibold">
        Loading...
      </span>
    </div>
  );
}
