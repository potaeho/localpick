import type { ReactNode } from "react";

import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { MobileTabBar } from "@/components/store/MobileTabBar";
import { ExperimentProvider } from "@/components/experiment/ExperimentProvider";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <ExperimentProvider>
      <Header />
      {/* 모바일 하단 탭바·구매 바에 콘텐츠가 가리지 않도록 여백을 둔다 */}
      <main className="flex-1 pb-safe-mobile-tab md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </ExperimentProvider>
  );
}
