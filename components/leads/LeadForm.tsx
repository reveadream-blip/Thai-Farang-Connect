"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { publicApiUrl } from "@/lib/env/public";

type Props = {
  locale: string;
  /** Si défini, le lead est rattaché à un projet (optional FK côté API). */
  projectId?: string | null;
};

const inputCls =
  "mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5 text-slate-100 placeholder:text-slate-600 focus:border-premium-gold/45 focus:outline-none focus:ring-2 focus:ring-premium-gold/20";

export function LeadForm({ locale, projectId }: Props) {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"investor_thai" | "entrepreneur_farang">(
    "investor_thai",
  );
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
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
          website: website.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setStatus("err");
        if (res.status === 429) {
          setErrMsg(t("leadForm.errorTooManyRequests"));
        } else {
          setErrMsg(data.error ?? t("leadForm.errorGeneric"));
        }
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
    <section className="glass-card rounded-2xl p-6 md:p-8">
      <h2 className="font-hero-title text-lg font-semibold text-slate-50">
        {t("leadForm.title")}
      </h2>
      <p className="mt-2 text-sm text-slate-400">{t("leadForm.subtitle")}</p>

      {status === "ok" ? (
        <p className="mt-6 rounded-xl border border-premium-gold/25 bg-premium-blue/35 px-4 py-3 text-sm text-premium-gold-light">
          {t("leadForm.success")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="relative mt-6 space-y-5">
          <input
            type="text"
            name="company_website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute h-0 w-0 overflow-hidden opacity-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div>
            <label
              htmlFor="lead-email"
              className="block text-sm font-medium text-slate-300"
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
              className={inputCls}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-slate-300">
              {t("leadForm.role")}
            </legend>
            <div className="mt-3 flex flex-wrap gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="radio"
                  name="role"
                  checked={role === "investor_thai"}
                  onChange={() => setRole("investor_thai")}
                  className="border-white/20 text-premium-gold focus:ring-premium-gold/40"
                />
                {t("leadForm.roleInvestor")}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="radio"
                  name="role"
                  checked={role === "entrepreneur_farang"}
                  onChange={() => setRole("entrepreneur_farang")}
                  className="border-white/20 text-premium-gold focus:ring-premium-gold/40"
                />
                {t("leadForm.roleEntrepreneur")}
              </label>
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="lead-message"
              className="block text-sm font-medium text-slate-300"
            >
              {t("leadForm.message")}
            </label>
            <textarea
              id="lead-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              className={inputCls}
            />
          </div>

          {status === "err" && (
            <p className="text-sm text-red-400">{errMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-premium-primary rounded-xl px-6 py-3 text-sm font-semibold text-slate-950 transition disabled:opacity-50"
          >
            {status === "loading" ? t("leadForm.sending") : t("leadForm.submit")}
          </button>
        </form>
      )}
    </section>
  );
}
