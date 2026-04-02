"use client";

import { useEffect, useState } from "react";
import SessionComplete from "@/components/session/SessionComplete";

export default function SessionCompletePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full pt-16">
      <SessionComplete />
    </div>
  );
}
