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

  const { storageError, freeSpinsLeft, needsAd, recordSpin, grantRewardSpin } = useSpinState("gacha");
  const { isAdLoaded, isLoading: adLoading, loadError, retryAd, showAd } = useRewardedAd(grantRewardSpin);

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
    <div className="game-shell">
      <div className="game-scroll">
        {storageError && <p className="storage-alert" role="alert">기기에 기록을 저장하지 못했어요. 앱을 닫으면 이번 추천 기록이 사라질 수 있어요.</p>}
        <div className="game-scene">
          <div className="toss-card gacha-card" data-phase={phase} style={{ background: cfg?.bg ?? "var(--toss-card)" }}>
            {phase === "idle" && (
              <div className="recommendation-empty">
                <img src="/icons/gacha.png" alt="" width={80} height={80} />
                <h1>어떤 메뉴가 나올까요?</h1>
                <p>카드를 뽑아 메뉴를 확인해 보세요</p>
              </div>
            )}
            {phase === "flipping" && (
              <div className="recommendation-empty" aria-hidden="true">
                <img src="/icons/gacha.png" alt="" width={80} height={80} />
                <p>뽑는 중...</p>
              </div>
            )}
            {phase === "done" && result && cfg && (
              <>
                {result.rarity === "legend" && <span className="legend-gift" aria-hidden="true">🎁</span>}
                <span className="rarity-label" data-rarity={result.rarity}>{cfg.label}</span>
                <h1 className="gacha-menu">{result.menu}</h1>
              </>
            )}
          </div>

          <p className="game-status" role="status" aria-live="polite" aria-atomic="true">
            {phase === "flipping" ? "메뉴를 뽑는 중..." : result && cfg ? `${cfg.label}, ${result.menu} 메뉴를 뽑았어요` : "버튼을 누르면 카드가 열려요"}
          </p>
          <div className="rarity-rates" aria-label="메뉴 등급별 확률">
            {(Object.entries(GACHA_RARITY_CONFIG) as [GachaRarity, typeof GACHA_RARITY_CONFIG[GachaRarity]][]).map(([key, c]) => (
              <span key={key}>{c.label} {Math.round(c.rate * 100)}%</span>
            ))}
          </div>
        </div>
      </div>

      <div className="game-actions">
        <div className="free-count">
          {mounted && freeSpinsLeft > 0 && (
            <p>무료 뽑기 <strong>{freeSpinsLeft}회</strong> 남음</p>
          )}
        </div>
        {(!needsAd || phase === "flipping") && (
          <Button display="full" size="xlarge" color="primary" variant="fill" disabled={!canPull} onClick={pull} style={{ borderRadius: 18, backgroundColor: "var(--toss-primary-hover)" }}>
            {phase === "flipping" ? "메뉴 뽑는 중" : phase === "done" ? "다시 뽑기" : "메뉴 뽑기"}
          </Button>
        )}
        {needsAd && phase !== "flipping" && (
          <div className="ad-actions">
            <p>오늘 무료 뽑기를 모두 사용했어요</p>
            <Button display="full" size="xlarge" color="dark" variant="fill" disabled={!isAdLoaded && !loadError} loading={adLoading} onClick={loadError ? retryAd : showAd} style={{ borderRadius: 18 }}>
              {isAdLoaded ? "광고 보고 1회 더 뽑기" : loadError ? "광고를 불러오지 못했어요 · 다시 시도" : "광고 준비 중..."}
            </Button>
          </div>
        )}
      </div>
      <BannerAd />
    </div>
  );
}
