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
  /*
   * 상대 경로(og:image 등)를 절대 URL로 바꿀 기준 주소.
   * 명시하지 않으면 Vercel이 배포마다 부여하는 VERCEL_URL을 쓰게 되어,
   * 미리보기 배포나 도메인 변경 시 공유 미리보기 이미지가 깨진다.
   */
  metadataBase: new URL("https://localpick-rose.vercel.app"),
  title: "LOCAL PICK",
  description:
    "생산자와 생산지를 확인할 수 있는 로컬 특산물 스토어. 전국 각지의 로컬 크리에이터가 만든 상품을 만나보세요.",
  openGraph: {
    title: "LOCAL PICK",
    description:
      "생산자와 생산지를 확인할 수 있는 로컬 특산물 스토어. 전국 각지의 로컬 크리에이터가 만든 상품을 만나보세요.",
    images: [{ url: "/og-image.png", width: 1254, height: 1254 }],
  },
  twitter: {
    card: "summary",
    title: "LOCAL PICK",
    description:
      "생산자와 생산지를 확인할 수 있는 로컬 특산물 스토어. 전국 각지의 로컬 크리에이터가 만든 상품을 만나보세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn("h-full", "antialiased", notoSansKr.variable, "font-sans")}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
