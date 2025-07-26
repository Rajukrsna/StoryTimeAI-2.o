import LoadingSpinner from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 font-sans">
      <Navbar />
      <LoadingSpinner message="Loading books..." />
    </main>
  );
}