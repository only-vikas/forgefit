"use client";

import { useEffect, useState } from "react";
import ExerciseLibrary from "@/components/library/ExerciseLibrary";

export default function LibraryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full pt-16">
      <ExerciseLibrary />
    </div>
  );
}
