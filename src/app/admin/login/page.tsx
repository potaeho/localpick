"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/store/Logo";

export default function AdminLoginPage() {
  const router = useRouter(); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); setError(""); const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); if (response.ok) { router.replace("/admin"); router.refresh(); return; } const data = (await response.json().catch(() => null)) as { error?: string } | null; setError(data?.error ?? "로그인할 수 없습니다."); setPending(false); }
  return <main className="grid min-h-screen place-items-center bg-lp-cream px-4"><form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-lp-gray-300 bg-white p-7 shadow-sm"><Logo /><h1 className="mt-6 text-2xl font-bold">관리자 로그인</h1><p className="mt-2 text-sm text-lp-gray-700">실험 데이터와 인터뷰 동의 정보는 승인된 담당자만 볼 수 있습니다.</p><label className="mt-6 block text-sm font-bold" htmlFor="password">비밀번호</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-lp-gray-300 px-3" required /><button type="submit" disabled={pending} className="mt-5 min-h-11 w-full rounded-lg bg-lp-green font-bold text-white hover:bg-lp-green-dark disabled:opacity-60">{pending ? "확인 중…" : "로그인"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</form></main>;
}
