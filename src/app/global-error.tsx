"use client";
import { useEffect } from "react";
import { installHistoryBack } from "@/lib/historyBack";
// 앱 전체가 멈추는 오류 대신 원인과 다시 시도를 보여 준다(토스 앱 안에서만 나는 오류 추적용)
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => installHistoryBack(() => false), []);

  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 24, minHeight: "100dvh", boxSizing: "border-box", background: "#F2F4F6", fontFamily: "system-ui, sans-serif", color: "#191F28" }}>
        <style>{`
          .global-error-button {
            width: 100%;
            min-height: 48px;
            margin-top: 16px;
            padding: 12px 20px;
            border-radius: 12px;
            border: 0;
            background: #1B64DA;
            color: #fff;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            transition: transform 80ms ease-out;
          }
          .global-error-button:active:not(:disabled) { transform: scale(.97); }
          .global-error-button:focus-visible,
          .global-error-details summary:focus-visible {
            outline: 3px solid #1B64DA;
            outline-offset: 4px;
          }
          .global-error-details summary {
            min-height: 44px;
            padding: 12px 4px;
            box-sizing: border-box;
            cursor: pointer;
          }
          @media (prefers-reduced-motion: reduce) {
            .global-error-button { transition: none; }
            .global-error-button:active:not(:disabled) { transform: none; }
          }
        `}</style>
        <main style={{ maxWidth: 440, margin: "0 auto", fontSize: 16, lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>화면을 불러오지 못했어요</h1>
          <p style={{ color: "#4E5968", margin: 0 }}>잠시 후 다시 시도해 주세요.</p>
          <button type="button" className="global-error-button" onClick={() => reset()}>다시 시도</button>
          <details className="global-error-details" style={{ marginTop: 24, fontSize: 14, color: "#4E5968" }}>
            <summary>오류 정보 보기</summary>
            <p style={{ margin: "8px 0 0", overflowWrap: "anywhere" }}>{error?.name}: {error?.message}{error?.digest ? ` (${error.digest})` : ""}</p>
          </details>
        </main>
      </body>
    </html>
  );
}
