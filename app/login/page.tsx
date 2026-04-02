"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/components/auth/LoginPage";

export default function AuthPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full flex items-center justify-center pt-16">
      <LoginPage />
    </div>
  );
}
