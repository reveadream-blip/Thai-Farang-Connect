import type { Metadata } from "next";

import { LegalContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = {
  title: "Legal & compliance",
};

export default function LegalPage() {
  return <LegalContent />;
}
