import type { Metadata, Viewport } from "next";
import "./globals.css";
import TDSProvider from "@/components/TDSProvider";

export const metadata: Metadata = {
  title: "랜덤식탁",
  description: "오늘 뭐 먹지? 랜덤식탁에서 메뉴 추천받기",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B35",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <TDSProvider>{children}</TDSProvider>
      </body>
    </html>
  );
}
