"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { ApiManageProject } from "@/lib/api/types";

type Props =
  | { locale: string; mode: "create" }
  | { locale: string; mode: "edit"; project: ApiManageProject };

const STATUSES = ["draft", "published", "funded", "archived"] as const;

export function ProjectForm(props: Props) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const p = isEdit ? props.project : null;

  const [titleEn, setTitleEn] = useState(p?.title_en ?? "");
  const [titleTh, setTitleTh] = useState(p?.title_th ?? "");
  const [descEn, setDescEn] = useState(p?.description_en ?? "");
  const [descTh, setDescTh] = useState(p?.description_th ?? "");
  const [industry, setIndustry] = useState(p?.industry ?? "");
  const [location, setLocation] = useState(p?.location ?? "Bangkok");
  const [raise, setRaise] = useState(
    p?.required_investment != null ? String(p.required_investment) : "",
  );
  const [equity, setEquity] = useState(
    p?.equity_offered != null ? String(p.equity_offered) : "51",
  );
  const [status, setStatus] = useState(
    (p?.status && STATUSES.includes(p.status as (typeof STATUSES)[number])
      ? p.status
      : "draft") as string,
  );
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const required_investment =
      raise.trim() === "" ? null : Number.parseFloat(raise);
    const equity_offered = Number.parseFloat(equity);
    if (
      required_investment != null &&
      (Number.isNaN(required_investment) || required_investment < 0)
    ) {
      setErr(t("adminPage.invalidNumber"));
      setLoading(false);
      return;
    }
    if (Number.isNaN(equity_offered) || equity_offered <= 0 || equity_offered > 100) {
      setErr(t("adminPage.invalidEquity"));
      setLoading(false);
      return;
    }

    const payload: Record<string, unknown> = {
      title_en: titleEn.trim(),
      title_th: titleTh.trim(),
      description_en: descEn.trim(),
      description_th: descTh.trim(),
      industry: industry.trim(),
      location: location.trim() || "Bangkok",
      required_investment,
      equity_offered,
    };

    try {
      if (props.mode === "create") {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          project?: { id?: string };
        };
        if (!res.ok) {
          setErr(data.error ?? t("adminPage.errorGeneric"));
          setLoading(false);
          return;
        }
        const id = data.project?.id;
        if (id) {
          router.push(`/${props.locale}/admin/projects/${id}/edit`);
        } else {
          router.push(`/${props.locale}/admin/projects`);
        }
        router.refresh();
        return;
      }

      payload.status = status;
      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(props.project.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? t("adminPage.errorGeneric"));
        setLoading(false);
        return;
      }
      router.push(`/${props.locale}/admin/projects`);
      router.refresh();
    } catch {
      setErr(t("adminPage.errorGeneric"));
      setLoading(false);
    }
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-950";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl space-y-4 px-4 pb-16"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">{t("adminPage.titleEn")}</label>
          <input
            required
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">{t("adminPage.titleTh")}</label>
          <input
            required
            value={titleTh}
            onChange={(e) => setTitleTh(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">{t("adminPage.descEn")}</label>
          <textarea
            required
            rows={5}
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">{t("adminPage.descTh")}</label>
          <textarea
            required
            rows={5}
            value={descTh}
            onChange={(e) => setDescTh(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t("projectsPage.cardLocation")}</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t("adminPage.industry")}</label>
          <input
            required
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t("projectsPage.cardRaise")} (THB)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder={t("adminPage.optional")}
            value={raise}
            onChange={(e) => setRaise(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t("projectsPage.cardEquity")}</label>
          <input
            type="text"
            inputMode="decimal"
            required
            value={equity}
            onChange={(e) => setEquity(e.target.value)}
            className={inputCls}
          />
        </div>
        {isEdit ? (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">{t("adminPage.status")}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`adminPage.status.${s}`)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {err ? (
        <p className="text-sm text-red-600 dark:text-red-400">{err}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? t("leadForm.sending") : isEdit ? t("adminPage.save") : t("adminPage.create")}
        </button>
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm dark:border-stone-600"
          onClick={() => router.push(`/${props.locale}/admin/projects`)}
        >
          {t("adminPage.cancel")}
        </button>
      </div>
    </form>
  );
}
