"use client";

import { useEffect, useState } from "react";
import WorkoutLogger from "@/components/logger/WorkoutLogger";

export default function LoggerPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <WorkoutLogger />;
}
