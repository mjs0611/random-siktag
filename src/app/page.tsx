"use client";
import { useState, useCallback } from "react";
import { Button, SegmentedControl } from "@toss/tds-mobile";
import CategoryFilter from "@/components/CategoryFilter";
import SlotRoulette from "@/components/SlotRoulette";
import BannerAd from "@/components/BannerAd";
import MyPage from "@/components/MyPage";
import { useSpinState } from "@/hooks/useSpinState";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import { pickRandom, Category } from "@/lib/menus";

type Tab = "roulette" | "history";

export default function Home() {
  const [tab, setTab] = useState<Tab>("roulette");
  const [category, setCategory] = useState<Category | "all">("all");
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin, history, todayHistory } =
    useSpinState();

  const handleReward = useCallback(() => grantRewardSpin(), [grantRewardSpin]);
  const { isAdLoaded, isLoading: adLoading, showAd } = useRewardedAd(handleReward);

  const spin = useCallback(() => {
    if (isSpinning) return;
    const picked = pickRandom(category);
    setResult(picked);
    setIsSpinning(true);
  }, [isSpinning, category]);

  const handleSpinDone = useCallback(() => {
    setIsSpinning(false);
    if (result) recordSpin(result, category);
  }, [result, category, recordSpin]);

  const canSpin = freeSpinsLeft > 0 && !isSpinning;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#F2F4F6",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* 상단 탭 */}
      <div
        style={{
          padding: "12px 16px 0",
          background: "#ffffff",
          flexShrink: 0,
        }}
      >
        <SegmentedControl
          value={tab}
          onChange={(v) => setTab(v as Tab)}
          size="large"
        >
          <SegmentedControl.Item value="roulette">🎰 룰렛</SegmentedControl.Item>
          <SegmentedControl.Item value="history">📋 기록</SegmentedControl.Item>
        </SegmentedControl>
      </div>

      {/* 홈 탭 */}
      {tab === "roulette" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* 카테고리 필터 */}
          <CategoryFilter selected={category} onChange={setCategory} />

          {/* 메인 콘텐츠 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              gap: 24,
            }}
          >
            {/* 오늘 추천 횟수 */}
            <p style={{ fontSize: 13, color: "#8B95A1", margin: 0 }}>
              오늘{" "}
              <strong style={{ color: "#191F28" }}>{todayHistory.length}번</strong>{" "}
              추천받았어요
            </p>

            {/* 슬롯 */}
            <SlotRoulette
              result={result}
              category={category}
              isSpinning={isSpinning}
              onDone={handleSpinDone}
            />

            {/* 결과 */}
            {result && !isSpinning && (
              <div style={{ textAlign: "center", animation: "result-pop 0.4s ease" }}>
                <p style={{ fontSize: 13, color: "#8B95A1", margin: "0 0 4px" }}>
                  오늘의 추천
                </p>
                <p
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: "#FF6B35",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {result}
                </p>
              </div>
            )}

            {/* 버튼 영역 */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {freeSpinsLeft > 0 && (
                <p style={{ fontSize: 13, color: "#8B95A1", margin: 0 }}>
                  무료 추천{" "}
                  <strong style={{ color: "#FF6B35" }}>{freeSpinsLeft}회</strong> 남음
                </p>
              )}

              {canSpin && (
                <Button
                  display="full"
                  size="xlarge"
                  color="primary"
                  variant="fill"
                  onClick={spin}
                  style={{
                    "--button-background-color": "#FF6B35",
                    "--button-color": "#ffffff",
                  } as React.CSSProperties}
                >
                  {result ? "다시 추천받기" : "메뉴 추천받기 🎰"}
                </Button>
              )}

              {needsAd && !isSpinning && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 13, color: "#8B95A1", margin: 0 }}>
                    오늘 무료 추천을 모두 사용했어요
                  </p>
                  <Button
                    display="full"
                    size="xlarge"
                    color="dark"
                    variant="fill"
                    disabled={!isAdLoaded}
                    loading={adLoading}
                    onClick={showAd}
                  >
                    {isAdLoaded ? "광고 보고 1회 더 추천받기 🎁" : "광고 준비 중..."}
                  </Button>
                </div>
              )}

              {isSpinning && (
                <p style={{ fontSize: 15, fontWeight: 600, color: "#8B95A1" }}>
                  추천 중...
                </p>
              )}
            </div>
          </div>

          {/* 배너 광고 */}
          <div style={{ flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)" }}>
            <BannerAd />
          </div>
        </div>
      )}

      {/* 기록 탭 */}
      {tab === "history" && (
        <div style={{ flex: 1, overflow: "hidden" }}>
          <MyPage history={history} />
        </div>
      )}
    </div>
  );
}
