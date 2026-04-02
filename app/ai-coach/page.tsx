"use client";

import { useEffect, useState } from "react";
import AICoach from "@/components/ai-coach/AICoach";

export default function AICoachPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full pt-16">
      <AICoach />
    </div>
  );
}
