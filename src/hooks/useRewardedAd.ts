"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";

// 광고 그룹 ID는 콘솔에서 발급받은 값으로 교체
const AD_GROUP_ID = "ait.v2.live.34643c7d394f4d05";

export function useRewardedAd(onReward: () => void) {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const unregisterRef = useRef<(() => void) | null>(null);

  const loadAd = useCallback(() => {
    if (!loadFullScreenAd.isSupported()) return;
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
      },
    });
    unregisterRef.current = unregister;
  }, []);

  useEffect(() => {
    loadAd();
    return () => unregisterRef.current?.();
  }, [loadAd]);

  const showAd = useCallback(() => {
    if (!showFullScreenAd.isSupported() || !isAdLoaded) return;

    showFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === "userEarnedReward") {
          onReward();
        }
        if (event.type === "dismissed") {
          setIsAdLoaded(false);
          loadAd();
        }
      },
      onError: () => {
        loadAd();
      },
    });
  }, [isAdLoaded, loadAd, onReward]);

  return { isAdLoaded, isLoading, showAd };
}
