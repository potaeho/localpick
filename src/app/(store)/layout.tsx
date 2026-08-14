import type { ReactNode } from "react";

import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ExperimentProvider } from "@/components/experiment/ExperimentProvider";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <ExperimentProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ExperimentProvider>
  );
}
