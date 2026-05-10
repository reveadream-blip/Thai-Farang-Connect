import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & compliance",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
        Legal compliance
      </h1>
      <p className="mt-4 text-stone-600 dark:text-stone-400">
        MOU, joint-venture agreements, and shareholder pacts — tracked with
        strict status workflows for Thai and foreign signatories.
      </p>
    </div>
  );
}
