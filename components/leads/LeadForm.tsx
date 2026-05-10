"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { publicApiUrl } from "@/lib/env/public";

type Props = {
  locale: string;
  /** Si défini, le lead est rattaché à un projet (optional FK côté API). */
  projectId?: string | null;
};

export function LeadForm({ locale, projectId }: Props) {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"investor_thai" | "entrepreneur_farang">(
    "investor_thai",
  );
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrMsg("");
    const base = publicApiUrl.replace(/\/$/, "");
    try {
      const res = await fetch(`${base}/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          locale,
          message: message.trim() || undefined,
          project_id: projectId ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setStatus("err");
        setErrMsg(data.error ?? t("leadForm.errorGeneric"));
        return;
      }
      setStatus("ok");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("err");
      setErrMsg(t("leadForm.errorGeneric"));
    }
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
        {t("leadForm.title")}
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        {t("leadForm.subtitle")}
      </p>

      {status === "ok" ? (
        <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:bg-teal-950/50 dark:text-teal-200">
          {t("leadForm.success")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="lead-email"
              className="block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              {t("leadForm.email")}
            </label>
            <input
              id="lead-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("leadForm.role")}
            </legend>
            <div className="mt-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  checked={role === "investor_thai"}
                  onChange={() => setRole("investor_thai")}
                />
                {t("leadForm.roleInvestor")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  checked={role === "entrepreneur_farang"}
                  onChange={() => setRole("entrepreneur_farang")}
                />
                {t("leadForm.roleEntrepreneur")}
              </label>
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="lead-message"
              className="block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              {t("leadForm.message")}
            </label>
            <textarea
              id="lead-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>

          {status === "err" && (
            <p className="text-sm text-red-600 dark:text-red-400">{errMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            {status === "loading" ? t("leadForm.sending") : t("leadForm.submit")}
          </button>
        </form>
      )}
    </section>
  );
}
