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

  const { storageError, freeSpinsLeft, needsAd, recordSpin, grantRewardSpin } = useSpinState("sikpan");
  const { isAdLoaded, isLoading: adLoading, loadError, retryAd, showAd } = useRewardedAd(grantRewardSpin);

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
    <div className="game-shell">
      <div className="game-scroll">
        {storageError && <p className="storage-alert" role="alert">기기에 기록을 저장하지 못했어요. 앱을 닫으면 이번 추천 기록이 사라질 수 있어요.</p>}
        <div className="game-scene">
          <div className="tray-heading">
            <h1>오늘의 식판을 채워볼까요?</h1>
            <p>밥부터 반찬까지 한 번에 골라드려요</p>
          </div>
          <div className="toss-card sikpan-tray" data-result={phase === "done"}>
            <SlotSikpan label="밥" icon="🍚" value={phase === "done" ? result?.main ?? null : null} isSpinning={phase === "drawing"} />
            <SlotSikpan label="국/찌개" icon="🥣" value={phase === "done" ? result?.soup ?? null : null} isSpinning={phase === "drawing"} />
            <SlotSikpan label="반찬 1" icon="🍳" value={phase === "done" ? result?.side1 ?? null : null} isSpinning={phase === "drawing"} />
            <SlotSikpan label="반찬 2" icon="🥬" value={phase === "done" ? result?.side2 ?? null : null} isSpinning={phase === "drawing"} />
          </div>
          <p className="game-status" role="status" aria-live="polite" aria-atomic="true">
            {phase === "drawing" ? "식판을 채우는 중..." : result ? `${result.main} · ${result.soup} · ${result.side1} · ${result.side2}, 식판이 완성됐어요` : "버튼을 누르면 네 가지 메뉴를 골라드려요"}
          </p>
        </div>
      </div>

      <div className="game-actions">
        <div className="free-count">
          {mounted && freeSpinsLeft > 0 && (
            <p>무료 뽑기 <strong>{freeSpinsLeft}회</strong> 남음</p>
          )}
        </div>
        {(!needsAd || phase === "drawing") && (
          <Button display="full" size="xlarge" color="primary" variant="fill" disabled={!canDraw} onClick={draw} style={{ borderRadius: 18, backgroundColor: "var(--toss-primary-hover)" }}>
            {phase === "drawing" ? "식판 채우는 중" : phase === "done" ? "다시 뽑기" : "식판 채우기"}
          </Button>
        )}
        {needsAd && phase !== "drawing" && (
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

function SlotSikpan({ label, icon, value, isSpinning }: { label: string; icon: string; value: string | null; isSpinning: boolean }) {
  return (
    <div className="sikpan-slot">
      <span className="sikpan-slot-label">{label}</span>
      {isSpinning ? (
        <span className="menu-spinner" aria-hidden="true" />
      ) : value ? (
        <span className="sikpan-slot-value">{value}</span>
      ) : (
        <span className="sikpan-slot-placeholder" aria-hidden="true">{icon}</span>
      )}
    </div>
  );
}
