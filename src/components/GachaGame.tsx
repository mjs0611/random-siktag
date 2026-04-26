"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@toss/tds-mobile";
import { drawGacha, GACHA_RARITY_CONFIG, GachaRarity } from "@/lib/menus";
import { haptic } from "@/lib/bridge";
import { useSpinState } from "@/hooks/useSpinState";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import BannerAd from "@/components/BannerAd";

type Phase = "idle" | "flipping" | "done";

export default function GachaGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<{ menu: string; rarity: GachaRarity } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin, todayHistory } = useSpinState("gacha");
  const { isAdLoaded, isLoading: adLoading, showAd } = useRewardedAd(grantRewardSpin);

  const pull = useCallback(() => {
    if (phase === "flipping") return;
    setPhase("flipping");
    setResult(null);

    const drawn = drawGacha();

    setTimeout(() => {
      setResult(drawn);
      setPhase("done");
      recordSpin({ game: "gacha", label: drawn.menu, rarity: drawn.rarity });
      haptic(drawn.rarity === "legend" ? "confetti" : "success");
    }, 1200);
  }, [phase, recordSpin]);

  const cfg = result ? GACHA_RARITY_CONFIG[result.rarity] : null;
  const canPull = freeSpinsLeft > 0 && phase !== "flipping";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--toss-grey-100)" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "24px 20px",
          gap: 24,
          overflowY: "auto",
        }}
      >
        {/* 카드 */}
        <div
          className="toss-card"
          style={{
            width: 240,
            height: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: phase === "done" && cfg ? cfg.bg : "var(--toss-card)",
            border: `2px solid ${phase === "done" && cfg ? cfg.color : "var(--toss-grey-100)"}`,
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: phase === "done" && result?.rarity === "legend"
              ? "0 0 40px rgba(49,130,246,0.4)"
              : "var(--toss-shadow-lg)",
            animation: phase === "done" ? "result-pop 0.5s ease" : undefined,
            padding: 24,
          }}
        >
          {phase === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--toss-grey-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
              <p style={{ fontSize: 16, color: "var(--toss-grey-500)", margin: 0, fontWeight: 700 }}>
                메뉴를 뽑아보세요
              </p>
            </div>
          )}

          {phase === "flipping" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "4px solid var(--toss-grey-100)",
                  borderTopColor: "var(--toss-primary)",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ fontSize: 16, color: "var(--toss-grey-500)", margin: 0, fontWeight: 700 }}>
                뽑는 중...
              </p>
            </div>
          )}

          {phase === "done" && result && cfg && (
            <>
              {result.rarity === "legend" && (
                <span style={{ fontSize: 48, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>🎁</span>
              )}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1.5px solid ${cfg.color}`,
                  padding: "4px 14px",
                  borderRadius: 100,
                  textTransform: "uppercase",
                }}
              >
                {cfg.label}
              </span>
              <p
                style={{
                  fontSize: result.rarity === "legend" ? 24 : 26,
                  fontWeight: 800,
                  color: "var(--toss-grey-900)",
                  margin: 0,
                  textAlign: "center",
                  padding: "0 10px",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.3,
                }}
              >
                {result.menu}
              </p>
            </>
          )}
        </div>

        {/* 확률 안내 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {(Object.entries(GACHA_RARITY_CONFIG) as [GachaRarity, typeof GACHA_RARITY_CONFIG[GachaRarity]][]).map(([key, c]) => (
            <div
              key={key}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: c.color,
                background: c.bg,
                padding: "6px 12px",
                borderRadius: 100,
                border: `1px solid ${c.color}22`,
              }}
            >
              {c.label} {Math.round(c.rate * 100)}%
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          {mounted && freeSpinsLeft > 0 && (
            <p style={{ fontSize: 14, color: "var(--toss-grey-500)", margin: 0, textAlign: "center", fontWeight: 600 }}>
              무료 뽑기 <strong style={{ color: "var(--toss-primary)" }}>{freeSpinsLeft}회</strong> 남음
            </p>
          )}

          {canPull && (
            <Button
              display="full"
              size="xlarge"
              color="primary"
              variant="fill"
              onClick={pull}
              style={{ borderRadius: 18 }}
            >
              {phase === "done" ? "다시 뽑기" : "메뉴 뽑기"}
            </Button>
          )}

          {needsAd && phase !== "flipping" && (
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
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
