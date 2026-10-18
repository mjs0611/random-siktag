"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@toss/tds-mobile";
import CategoryFilter from "@/components/CategoryFilter";
import SlotRoulette from "@/components/SlotRoulette";
import BannerAd from "@/components/BannerAd";
import { useSpinState } from "@/hooks/useSpinState";
import { copula } from "@/lib/copula";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import { pickRandom, Category } from "@/lib/menus";
import { haptic } from "@/lib/bridge";

export default function RouletteGame() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { storageError, freeSpinsLeft, needsAd, recordSpin, grantRewardSpin } = useSpinState("roulette");
  const { isAdLoaded, isLoading: adLoading, loadError, retryAd, showAd } = useRewardedAd(grantRewardSpin);

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
    <div className="game-shell">
      <div className="game-scroll">
        {storageError && <p className="storage-alert" role="alert">기기에 기록을 저장하지 못했어요. 앱을 닫으면 이번 추천 기록이 사라질 수 있어요.</p>}
        <CategoryFilter selected={category} onChange={setCategory} disabled={isSpinning} />
        <div className="game-scene">
          <SlotRoulette result={result} category={category} isSpinning={isSpinning} onDone={handleSpinDone} />
          <p className="game-status" role="status" aria-live="polite" aria-atomic="true">
            {isSpinning ? "추천 메뉴를 고르는 중..." : result ? <>오늘의 추천 메뉴는 <strong>{result}</strong>{copula(result)}</> : "버튼을 누르면 메뉴를 골라드려요"}
          </p>
        </div>
      </div>

      <div className="game-actions">
        <div className="free-count">
          {mounted && freeSpinsLeft > 0 && (
            <p>무료 추천 <strong>{freeSpinsLeft}회</strong> 남음</p>
          )}
        </div>
        {(!needsAd || isSpinning) && (
          <Button display="full" size="xlarge" color="primary" variant="fill" disabled={!canSpin} onClick={spin} style={{ borderRadius: 18, backgroundColor: "var(--toss-primary-hover)" }}>
            {isSpinning ? "메뉴 고르는 중" : result ? "다시 추천받기" : "메뉴 추천받기"}
          </Button>
        )}
        {needsAd && !isSpinning && (
          <div className="ad-actions">
            <p>오늘 무료 추천을 모두 사용했어요</p>
            <Button display="full" size="xlarge" color="dark" variant="fill" disabled={!isAdLoaded && !loadError} loading={adLoading} onClick={loadError ? retryAd : showAd} style={{ borderRadius: 18 }}>
              {isAdLoaded ? "광고 보고 1회 더 추천받기" : loadError ? "광고를 불러오지 못했어요 · 다시 시도" : "광고 준비 중..."}
            </Button>
          </div>
        )}
      </div>
      <BannerAd />
    </div>
  );
}
