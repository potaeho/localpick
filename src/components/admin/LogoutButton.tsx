"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="inline-flex h-9 items-center rounded-lg border border-lp-gray-300 px-3 text-sm text-lp-gray-700 hover:bg-lp-gray-100 disabled:opacity-50"
    >
      로그아웃
    </button>
  );
}
