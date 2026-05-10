import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investors",
};

export default function InvestorsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
        Investors
      </h1>
      <p className="mt-4 text-stone-600 dark:text-stone-400">
        Thai majority partners (51%) — profile verification and compliant JV
        workflows will appear here.
      </p>
    </div>
  );
}
