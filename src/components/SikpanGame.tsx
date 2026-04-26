"use client";
import { useState, useCallback, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin } = useSpinState("sikpan");
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

  if (!mounted) return null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--toss-grey-100)" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px",
          gap: 32,
          overflowY: "auto",
        }}
      >
        {/* 식판 트레이 */}
        <div
          className="toss-card"
          style={{
            width: "100%",
            background: "var(--toss-card)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            aspectRatio: "1.4 / 1",
            maxWidth: 400,
            position: "relative",
            margin: "0 auto",
            padding: 24,
            border: "1px solid var(--toss-grey-100)",
          }}
        >
          <div style={{ display: "flex", gap: 12, flex: 1.2 }}>
            <SlotSikpan
              label="메인"
              value={phase === "done" ? result?.main ?? null : null}
              isSpinning={phase === "drawing"}
            />
            <SlotSikpan
              label="국/찌개"
              value={phase === "done" ? result?.soup ?? null : null}
              isSpinning={phase === "drawing"}
            />
          </div>
          <div style={{ display: "flex", gap: 12, flex: 1 }}>
            <SlotSikpan
              label="반찬 1"
              value={phase === "done" ? result?.side1 ?? null : null}
              isSpinning={phase === "drawing"}
            />
            <SlotSikpan
              label="반찬 2"
              value={phase === "done" ? result?.side2 ?? null : null}
              isSpinning={phase === "drawing"}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          {freeSpinsLeft > 0 && (
            <p style={{ fontSize: 14, color: "var(--toss-grey-500)", margin: 0, textAlign: "center", fontWeight: 600 }}>
              무료 뽑기 <strong style={{ color: "var(--toss-primary)" }}>{freeSpinsLeft}회</strong> 남음
            </p>
          )}

          {canDraw && (
            <Button
              display="full"
              size="xlarge"
              color="primary"
              variant="fill"
              onClick={draw}
              style={{ borderRadius: 18 }}
            >
              {phase === "done" ? "다시 뽑기" : "오늘의 식판"}
            </Button>
          )}

          {needsAd && phase !== "drawing" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 14, color: "var(--toss-grey-500)", margin: 0, fontWeight: 500 }}>
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
                style={{ borderRadius: 18 }}
              >
                {isAdLoaded ? "광고 보고 1회 더 뽑기" : "광고 준비 중..."}
              </Button>
            </div>
          )}
        </div>
      </div>

      <BannerAd />
    </div>
  );
}

function SlotSikpan({ label, value, isSpinning }: { label: string; value: string | null; isSpinning: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--toss-grey-50)",
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 8px",
        position: "relative",
        overflow: "hidden",
        minHeight: 80,
        animation: value ? "result-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" : undefined,
        border: "1px solid var(--toss-grey-100)",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--toss-grey-500)", marginBottom: 8, fontWeight: 700 }}>{label}</span>
      {isSpinning ? (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "3px solid var(--toss-grey-200)",
            borderTopColor: "var(--toss-primary)",
            animation: "spin 0.8s linear infinite",
          }}
        />
      ) : value ? (
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--toss-grey-900)",
            textAlign: "center",
            lineHeight: 1.3,
            letterSpacing: "-0.3px",
          }}
        >
          {value}
        </span>
      ) : (
        <span style={{ fontSize: 24, color: "var(--toss-grey-200)", fontWeight: 800 }}>?</span>
      )}
    </div>
  );
}
