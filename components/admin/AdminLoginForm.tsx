"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

type Props = {
  locale: string;
};

export function AdminLoginForm({ locale }: Props) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? t("adminPage.errorGeneric"));
        setLoading(false);
        return;
      }
      const next =
        searchParams.get("next") ?? `/${locale}/admin/projects`;
      router.push(next);
      router.refresh();
    } catch {
      setErr(t("adminPage.errorGeneric"));
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-8 max-w-md space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900"
    >
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {t("leadForm.email")}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-950"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {t("adminPage.password")}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-950"
        />
      </div>
      {err ? (
        <p className="text-sm text-red-600 dark:text-red-400">{err}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? t("leadForm.sending") : t("adminPage.loginSubmit")}
      </button>
    </form>
  );
}
