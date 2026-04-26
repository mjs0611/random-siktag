"use client";
import { useCallback, useEffect, useState } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";

const AD_GROUP_ID = "ait.v2.live.34643c7d394f4d05";

export function useRewardedAd(onReward: () => void) {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    return unregister;
  }, []);

  useEffect(() => {
    const unregister = loadAd();
    return () => { unregister?.(); };
  }, [loadAd]);

  const showAd = useCallback(() => {
    if (!isAdLoaded || !showFullScreenAd.isSupported()) return;
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
      onError: () => {},
    });
  }, [isAdLoaded, onReward, loadAd]);

  return { isAdLoaded, isLoading, showAd };
}
