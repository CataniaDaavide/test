"use client";

import { Spinner } from "@/components/ui/spinner"; // Shadcn Spinner
import { useLoader } from "@/context/LoaderContext";

export default function Loader() {
  const { isLoaderActive } = useLoader();

  if (!isLoaderActive) return null;

  return (
    <div className="fixed inset-0 z-999 bg-black/60 flex items-center justify-center">
      <Spinner className="w-12 h-12 text-white dark:text-white" />
    </div>
  );
}
