"use client";

import { useEffect, useState } from "react";
import AchievementsGrid from "@/components/achievements/AchievementsGrid";

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full pt-16">
      <AchievementsGrid />
    </div>
  );
}
