"use client";
import { useState, useCallback } from "react";
import { Button } from "@toss/tds-mobile";
import CategoryFilter from "@/components/CategoryFilter";
import SlotRoulette from "@/components/SlotRoulette";
import BannerAd from "@/components/BannerAd";
import { useSpinState } from "@/hooks/useSpinState";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import { pickRandom, Category } from "@/lib/menus";

export default function RouletteGame() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

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
    if (result) recordSpin({ game: "roulette", label: result, category });
  }, [result, category, recordSpin]);

  const canSpin = freeSpinsLeft > 0 && !isSpinning;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CategoryFilter selected={category} onChange={setCategory} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          gap: 24,
        }}
      >
        <SlotRoulette
          result={result}
          category={category}
          isSpinning={isSpinning}
          onDone={handleSpinDone}
        />

        {result && !isSpinning && (
          <div style={{ textAlign: "center", animation: "result-pop 0.4s ease" }}>
            <p style={{ fontSize: 13, color: "#8B95A1", margin: "0 0 4px" }}>오늘의 추천</p>
            <p
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#3182F6",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {result}
            </p>
          </div>
        )}

        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {freeSpinsLeft > 0 && (
            <p style={{ fontSize: 13, color: "#8B95A1", margin: 0 }}>
              무료 추천 <strong style={{ color: "#3182F6" }}>{freeSpinsLeft}회</strong> 남음
            </p>
          )}

          {canSpin && (
            <Button
              display="full"
              size="xlarge"
              color="primary"
              variant="fill"
              onClick={spin}
            >
              {result ? "다시 추천받기" : "메뉴 추천받기"}
            </Button>
          )}

          {needsAd && !isSpinning && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 13, color: "#8B95A1", margin: 0 }}>
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
              >
                {isAdLoaded ? "광고 보고 1회 더 추천받기" : "광고 준비 중..."}
              </Button>
            </div>
          )}

          {isSpinning && (
            <p style={{ fontSize: 15, fontWeight: 600, color: "#8B95A1" }}>추천 중...</p>
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)" }}>
        <BannerAd />
      </div>
    </div>
  );
}
