"use client";
import { useState, useCallback } from "react";
import { Button } from "@toss/tds-mobile";
import { drawSikpan, SikpanResult } from "@/lib/menus";
import { haptic } from "@/lib/bridge";
import { useSpinState } from "@/hooks/useSpinState";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import BannerAd from "@/components/BannerAd";

type Phase = "idle" | "drawing" | "done";

export default function SikpanGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<SikpanResult | null>(null);

  const { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin, todayHistory } = useSpinState("sikpan");
  const { isAdLoaded, isLoading: adLoading, showAd } = useRewardedAd(grantRewardSpin);

  const draw = useCallback(() => {
    if (phase === "drawing") return;
    setPhase("drawing");
    setResult(null);

    const drawn = drawSikpan();
    setTimeout(() => {
      setResult(drawn);
      setPhase("done");
      const label = `${drawn.main} · ${drawn.soup} · ${drawn.side1} · ${drawn.side2}`;
      recordSpin({ game: "sikpan", label });
      haptic("success");
    }, 1000);
  }, [phase, recordSpin]);

  const canDraw = freeSpinsLeft > 0 && phase !== "drawing";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          gap: 28,
        }}
      >

        {/* 식판 트레이 */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            background: "#EFF6EC",
            borderRadius: 20,
            padding: 16,
            border: "3px solid #C8DEBF",
          }}
        >
          {/* 주식 + 국 */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <TrayCell label="주식" value={phase === "done" && result ? result.main : null} phase={phase} flex={1.5} />
            <TrayCell label="국" value={phase === "done" && result ? result.soup : null} phase={phase} flex={1} />
          </div>
          {/* 반찬 */}
          <div style={{ display: "flex", gap: 10 }}>
            <TrayCell label="반찬 1" value={phase === "done" && result ? result.side1 : null} phase={phase} flex={1} />
            <TrayCell label="반찬 2" value={phase === "done" && result ? result.side2 : null} phase={phase} flex={1} />
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {freeSpinsLeft > 0 && (
            <p style={{ fontSize: 13, color: "#8B95A1", margin: 0, textAlign: "center" }}>
              무료 뽑기 <strong style={{ color: "#3182F6" }}>{freeSpinsLeft}회</strong> 남음
            </p>
          )}

          {canDraw && (
            <Button
              display="full"
              size="xlarge"
              color="primary"
              variant="fill"
              onClick={draw}
            >
              {phase === "done" ? "다시 뽑기" : "오늘의 식판"}
            </Button>
          )}

          {needsAd && phase !== "drawing" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 13, color: "#8B95A1", margin: 0 }}>
                오늘 무료 뽑기를 모두 사용했어요
              </p>
              <Button
                display="full"
                size="xlarge"
                color="dark"
                variant="fill"
                disabled={!isAdLoaded}
                loading={adLoading}
                onClick={showAd}
              >
                {isAdLoaded ? "광고 보고 1회 더 뽑기" : "광고 준비 중..."}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)" }}>
        <BannerAd />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function TrayCell({
  label, value, phase, flex,
}: {
  label: string;
  value: string | null;
  phase: Phase;
  flex: number;
}) {
  return (
    <div
      style={{
        flex,
        background: "#ffffff",
        borderRadius: 12,
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minHeight: 80,
        border: "1.5px solid #D8EDD0",
        animation: phase === "done" && value ? "result-pop 0.4s ease" : undefined,
      }}
    >
      <span style={{ fontSize: 11, color: "#8B95A1", fontWeight: 600 }}>{label}</span>
      {phase === "drawing" ? (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid #E5E8EB",
            borderTopColor: "#3182F6",
            animation: "spin 0.8s linear infinite",
          }}
        />
      ) : value ? (
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#191F28",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {value}
        </span>
      ) : (
        <span style={{ fontSize: 22 }}>?</span>
      )}
    </div>
  );
}
