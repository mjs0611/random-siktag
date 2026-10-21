"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@toss/tds-mobile";
import CategoryFilter from "@/components/CategoryFilter";
import SlotRoulette from "@/components/SlotRoulette";
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

  // 메뉴는 누르는 순간 정해지고 바로 보여준다. 슬롯 연출은 짧은 장식일 뿐 결과를 가리지 않는다.
  const spin = useCallback(() => {
    if (isSpinning) return;
    const picked = pickRandom(category);
    setResult(picked);
    setIsSpinning(true);
    recordSpin({ game: "roulette", label: picked, category });
    haptic("success");
  }, [isSpinning, category, recordSpin]);

  const handleSpinDone = useCallback(() => setIsSpinning(false), []);

  const canSpin = freeSpinsLeft > 0 && !isSpinning;

  return (
    <div className="game-shell">
      <div className="game-scroll">
        {storageError && <p className="storage-alert" role="alert">기기에 기록을 저장하지 못했어요. 앱을 닫으면 이번 추천 기록이 사라질 수 있어요.</p>}
        <CategoryFilter selected={category} onChange={setCategory} disabled={isSpinning} />
        <div className="game-scene">
          <SlotRoulette result={result} category={category} isSpinning={isSpinning} onDone={handleSpinDone} />
          <p className="game-status" role="status" aria-live="polite" aria-atomic="true">
            {result ? <>오늘의 추천 메뉴는 <strong>{result}</strong>{copula(result)}</> : "버튼을 누르면 메뉴를 골라드려요"}
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
              {isAdLoaded ? "광고 보고 1회 더 추천받기" : loadError ? "광고 다시 불러오기" : "광고 준비 중..."}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
