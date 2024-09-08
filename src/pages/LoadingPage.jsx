import { Loader2 } from "lucide-react";

export function LoadingPage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </main>
  );
}
