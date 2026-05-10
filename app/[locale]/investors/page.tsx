import type { Metadata } from "next";

import { InvestorsContent } from "@/components/investors/InvestorsContent";

export const metadata: Metadata = {
  title: "Investors",
};

export default function InvestorsPage() {
  return <InvestorsContent />;
}
