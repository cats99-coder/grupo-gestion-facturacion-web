"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    router.push(pathname ?? "");
  }, [pathname, searchParams, router]);

  return null;
}
