"use client";
import { useState, useCallback } from "react";
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

        {/* 카드 */}
        <div
          style={{
            width: 220,
            height: 300,
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: phase === "done" && cfg ? cfg.bg : "#ffffff",
            border: `2px solid ${phase === "done" && cfg ? cfg.color : "#E5E8EB"}`,
            transition: "all 0.4s ease",
            boxShadow: phase === "done" && result?.rarity === "legend"
              ? "0 0 32px rgba(255,107,53,0.3)"
              : "0 4px 20px rgba(0,0,0,0.06)",
            animation: phase === "done" ? "result-pop 0.4s ease" : undefined,
          }}
        >
          {phase === "idle" && (
            <>
              <img src="/icons/gacha.png" alt="Gacha" style={{ width: 64, height: 64, objectFit: "contain", mixBlendMode: "multiply" }} />
              <p style={{ fontSize: 16, color: "#8B95A1", margin: 0, fontWeight: 600 }}>
                뽑기 버튼을 눌러요
              </p>
            </>
          )}

          {phase === "flipping" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid #E5E8EB",
                  borderTopColor: "#3182F6",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ fontSize: 15, color: "#8B95A1", margin: 0, fontWeight: 600 }}>
                뽑는 중...
              </p>
            </div>
          )}

          {phase === "done" && result && cfg && (
            <>
              {result.rarity === "legend" && (
                <span style={{ fontSize: 28 }}>✨</span>
              )}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1.5px solid ${cfg.color}`,
                  padding: "4px 12px",
                  borderRadius: 100,
                }}
              >
                {cfg.label}
              </span>
              <p
                style={{
                  fontSize: result.rarity === "legend" ? 22 : 24,
                  fontWeight: 800,
                  color: "#191F28",
                  margin: 0,
                  textAlign: "center",
                  padding: "0 16px",
                  letterSpacing: "-0.3px",
                }}
              >
                {result.menu}
              </p>
              {result.rarity === "legend" && (
                <span style={{ fontSize: 24 }}>✨</span>
              )}
            </>
          )}
        </div>

        {/* 확률 안내 */}
        <div style={{ display: "flex", gap: 8 }}>
          {(Object.entries(GACHA_RARITY_CONFIG) as [GachaRarity, typeof GACHA_RARITY_CONFIG[GachaRarity]][]).map(([key, c]) => (
            <div
              key={key}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: c.color,
                background: c.bg,
                padding: "4px 10px",
                borderRadius: 100,
              }}
            >
              {c.label} {Math.round(c.rate * 100)}%
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {freeSpinsLeft > 0 && (
            <p style={{ fontSize: 13, color: "#8B95A1", margin: 0, textAlign: "center" }}>
              무료 뽑기 <strong style={{ color: "#3182F6" }}>{freeSpinsLeft}회</strong> 남음
            </p>
          )}

          {canPull && (
            <Button
              display="full"
              size="xlarge"
              color="primary"
              variant="fill"
              onClick={pull}
            >
              {phase === "done" ? "다시 뽑기" : "메뉴 뽑기"}
            </Button>
          )}

          {needsAd && phase !== "flipping" && (
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
