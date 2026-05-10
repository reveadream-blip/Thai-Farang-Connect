"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type Props = {
  locale: string;
};

export function AdminRegisterForm({ locale }: Props) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          nationality,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? t("adminPage.errorGeneric"));
        setLoading(false);
        return;
      }
      router.push(`/${locale}/admin/projects`);
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
      <p className="text-sm text-stone-600 dark:text-stone-400">
        {t("adminPage.registerHint")}
      </p>
      <div>
        <label
          htmlFor="reg-email"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {t("leadForm.email")}
        </label>
        <input
          id="reg-email"
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
          htmlFor="reg-password"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {t("adminPage.passwordMin")}
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-950"
        />
      </div>
      <div>
        <label
          htmlFor="reg-name"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {t("adminPage.fullName")}
        </label>
        <input
          id="reg-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-950"
        />
      </div>
      <div>
        <label
          htmlFor="reg-nationality"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {t("adminPage.nationality")}
        </label>
        <input
          id="reg-nationality"
          type="text"
          required
          placeholder="e.g. French"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
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
        {loading ? t("leadForm.sending") : t("adminPage.registerSubmit")}
      </button>
    </form>
  );
}
