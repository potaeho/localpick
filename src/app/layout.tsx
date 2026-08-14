import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "LOCAL PICK",
  description:
    "생산자와 생산지를 확인할 수 있는 로컬 특산물 스토어. 전국 각지의 로컬 크리에이터가 만든 상품을 만나보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn("h-full", "antialiased", notoSansKr.variable, "font-sans")}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
