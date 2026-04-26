"use client";
import { useCallback, useEffect, useState } from "react";
import { TossAds, type TossAdsAttachBannerOptions } from "@apps-in-toss/web-framework";

let initialized = false;
let initializing = false;
const listeners: Array<() => void> = [];

function initTossAds(onDone: () => void) {
  if (initialized) { onDone(); return; }
  listeners.push(onDone);
  if (initializing) return;
  initializing = true;

  if (!TossAds.initialize.isSupported()) return;

  TossAds.initialize({
    callbacks: {
      onInitialized: () => {
        initialized = true;
        listeners.forEach((fn) => fn());
        listeners.length = 0;
      },
      onInitializationFailed: (error) => {
        console.error("TossAds init failed:", error);
      },
    },
  });
}

export function useTossBanner() {
  const [isInitialized, setIsInitialized] = useState(initialized);

  useEffect(() => {
    if (initialized) { setIsInitialized(true); return; }
    initTossAds(() => setIsInitialized(true));
  }, []);

  const attachBanner = useCallback(
    (adGroupId: string, element: HTMLElement, options?: TossAdsAttachBannerOptions) => {
      if (!isInitialized) return undefined;
      return TossAds.attachBanner(adGroupId, element, options);
    },
    [isInitialized]
  );

  return { isInitialized, attachBanner };
}
