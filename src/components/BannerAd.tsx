"use client";
import { useEffect, useRef } from "react";
import { useTossBanner } from "@/hooks/useTossBanner";

const AD_GROUP_ID = "ait.v2.live.19ca5011ffb44cfa";

export default function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInitialized, attachBanner } = useTossBanner();

  useEffect(() => {
    if (!isInitialized || !containerRef.current) return;
    const attached = attachBanner(AD_GROUP_ID, containerRef.current, {
      theme: "light",
      tone: "grey",
      variant: "expanded",
    });
    return () => { attached?.destroy(); };
  }, [isInitialized, attachBanner]);

  return <div ref={containerRef} style={{ width: "100%", height: 96, flexShrink: 0 }} />;
}
