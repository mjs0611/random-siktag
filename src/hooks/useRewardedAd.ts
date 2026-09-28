"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";

const AD_GROUP_ID = "ait.v2.live.34643c7d394f4d05";

export function useRewardedAd(onReward: () => void) {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loadError, setLoadError] = useState(false);
  const unregisterRef = useRef<(() => void) | undefined>(undefined);
  const loadAd = useCallback(() => {
    unregisterRef.current?.();
    unregisterRef.current = undefined;
    setLoadError(false);
    setIsAdLoaded(false);
    try {
      if (!loadFullScreenAd.isSupported()) { setLoadError(true); setIsLoading(false); return; }
      setIsLoading(true);
      setIsAdLoaded(false);
      const unregister = loadFullScreenAd({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === "loaded") {
            setIsAdLoaded(true);
            setIsLoading(false);
          }
        },
        onError: () => {
          setIsLoading(false);
          setLoadError(true);
        },
      });
      unregisterRef.current = unregister;
    } catch { setIsLoading(false); setIsAdLoaded(false); setLoadError(true); }
  }, []);

  useEffect(() => {
    loadAd();
    return () => { unregisterRef.current?.(); };
  }, [loadAd]);

  const showAd = useCallback(() => {
    if (!isAdLoaded || !showFullScreenAd.isSupported()) return;
    // 표시된 광고든 실패한 광고든 재사용 불가 — 버튼을 '준비 중'으로 돌리고 새로 로드한다.
    const reload = () => {
      setIsAdLoaded(false);
      loadAd();
    };
    showFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === "userEarnedReward") {
          onReward();
        }
        if (event.type === "dismissed" || event.type === "failedToShow") {
          reload();
        }
      },
      onError: reload,
    });
  }, [isAdLoaded, onReward, loadAd]);

  return { isAdLoaded, isLoading, loadError, retryAd: loadAd, showAd };
}
