import { Loader } from "lucide-react";

export default function LoaderFullPage() {
  return (
    <div className="w-[100dvw] h-[100dvh] bg-background flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
