import { Loader } from "lucide-react";

export default function LoaderFullPage({ className }) {
  return (
    <div className={`w-[100dvw] h-[100dvh] bg-background flex items-center justify-center ${className}`}>
      <Loader className="animate-spin" />
    </div>
  );
}

export function LoaderIcon({ className }) {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <Loader className="text-background-inverse animate-spin" />
    </div>
  );
}
