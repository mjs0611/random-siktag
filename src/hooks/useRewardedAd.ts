"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";

const AD_GROUP_ID = "ait.v2.live.34643c7d394f4d05";
const AD_LOAD_TIMEOUT_MS = 15000;

export function useRewardedAd(onReward: () => void) {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loadError, setLoadError] = useState(false);
  const unregisterRef = useRef<(() => void) | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loadAd = useCallback(() => {
    unregisterRef.current?.();
    unregisterRef.current = undefined;
    clearTimeout(timeoutRef.current);
    setLoadError(false);
    setIsAdLoaded(false);
    try {
      if (!loadFullScreenAd.isSupported()) { setLoadError(true); setIsLoading(false); return; }
      setIsLoading(true);
      setIsAdLoaded(false);
      // loaded 콜백이 영영 안 오는 경우가 있어 15초 뒤엔 실패로 돌려 "다시 불러오기"를 열어준다
      timeoutRef.current = setTimeout(() => {
        unregisterRef.current?.();
        unregisterRef.current = undefined;
        setIsLoading(false);
        setLoadError(true);
      }, AD_LOAD_TIMEOUT_MS);
      const unregister = loadFullScreenAd({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === "loaded") {
            clearTimeout(timeoutRef.current);
            setIsAdLoaded(true);
            setIsLoading(false);
          }
        },
        onError: () => {
          clearTimeout(timeoutRef.current);
          setIsLoading(false);
          setLoadError(true);
        },
      });
      unregisterRef.current = unregister;
    } catch { clearTimeout(timeoutRef.current); setIsLoading(false); setIsAdLoaded(false); setLoadError(true); }
  }, []);

  useEffect(() => {
    loadAd();
    return () => { unregisterRef.current?.(); clearTimeout(timeoutRef.current); };
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
