"use client";

import { useEffect, useState } from "react";
import ProgressDashboard from "@/components/progress/ProgressDashboard";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full pt-16">
      <ProgressDashboard />
    </div>
  );
}
