"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@toss/tds-mobile";
import CategoryFilter from "@/components/CategoryFilter";
import SlotRoulette from "@/components/SlotRoulette";
import BannerAd from "@/components/BannerAd";
import { useSpinState } from "@/hooks/useSpinState";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import { pickRandom, Category } from "@/lib/menus";
import { haptic } from "@/lib/bridge";

export default function RouletteGame() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin, todayHistory } = useSpinState("roulette");
  const { isAdLoaded, isLoading: adLoading, showAd } = useRewardedAd(grantRewardSpin);

  const spin = useCallback(() => {
    if (isSpinning) return;
    const picked = pickRandom(category);
    setResult(picked);
    setIsSpinning(true);
  }, [isSpinning, category]);

  const handleSpinDone = useCallback(() => {
    setIsSpinning(false);
    if (result) {
      recordSpin({ game: "roulette", label: result, category });
      haptic("success");
    }
  }, [result, category, recordSpin]);

  const canSpin = freeSpinsLeft > 0 && !isSpinning;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--toss-grey-100)" }}>
      <CategoryFilter selected={category} onChange={setCategory} />

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
        <SlotRoulette
          result={result}
          category={category}
          isSpinning={isSpinning}
          onDone={handleSpinDone}
        />

        {result && !isSpinning && (
          <div style={{ textAlign: "center", animation: "result-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", width: "100%" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--toss-grey-600)", marginBottom: 12 }}>오늘의 추천 메뉴</p>
            <div className="toss-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 100,
                width: "100%",
                background: "var(--toss-card)",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--toss-grey-900)", letterSpacing: "-0.5px" }}>
                {result}
              </span>
            </div>
          </div>
        )}

        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {mounted && freeSpinsLeft > 0 && (
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--toss-grey-500)", margin: 0 }}>
              무료 추천 <strong style={{ color: "var(--toss-primary)" }}>{freeSpinsLeft}회</strong> 남음
            </p>
          )}

          {canSpin && (
            <Button
              display="full"
              size="xlarge"
              color="primary"
              variant="fill"
              onClick={spin}
              style={{ borderRadius: 18 }}
            >
              {result ? "다시 추천받기" : "메뉴 추천받기"}
            </Button>
          )}

          {needsAd && !isSpinning && (
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--toss-grey-500)", margin: 0, textAlign: "center" }}>
                오늘 무료 추천을 모두 사용했어요
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
                {isAdLoaded ? "광고 보고 1회 더 추천받기" : "광고 준비 중..."}
              </Button>
            </div>
          )}

          {isSpinning && (
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--toss-grey-400)", animation: "pulse 1.5s infinite" }}>추천 메뉴를 고르는 중...</p>
          )}
        </div>
      </div>

      <BannerAd />
    </div>
  );
}
