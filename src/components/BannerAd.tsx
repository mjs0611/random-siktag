"use client";
import { TossAds } from "@apps-in-toss/web-framework";
import { useCallback, useEffect, useRef, useState } from "react";

// 광고 그룹 ID는 콘솔에서 발급받은 값으로 교체
const BANNER_AD_GROUP_ID = "ait-ad-test-banner-id";

function useTossAds() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!TossAds.initialize.isSupported()) return;
    TossAds.initialize({
      callbacks: {
        onInitialized: () => setIsInitialized(true),
        onInitializationFailed: (err) => console.error("TossAds init failed", err),
      },
    });
  }, []);

  const attachBanner = useCallback(
    (el: HTMLElement) => {
      if (!isInitialized) return;
      return TossAds.attachBanner(BANNER_AD_GROUP_ID, el, {
        theme: "auto",
        tone: "blackAndWhite",
        variant: "card",
      });
    },
    [isInitialized]
  );

  return { isInitialized, attachBanner };
}

export default function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { isInitialized, attachBanner } = useTossAds();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isInitialized || !containerRef.current) return;
    const attached = attachBanner(containerRef.current);
    return () => attached?.destroy();
  }, [isInitialized, attachBanner]);

  if (!mounted || !TossAds.initialize.isSupported?.()) return null;

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "96px" }}
    />
  );
}
