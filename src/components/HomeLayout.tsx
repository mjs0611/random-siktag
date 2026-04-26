"use client";
import { useState } from "react";
import { SegmentedControl } from "@toss/tds-mobile";
import RouletteGame from "@/components/RouletteGame";
import GachaGame from "@/components/GachaGame";
import SikpanGame from "@/components/SikpanGame";
import MyPage from "@/components/MyPage";
import BottomTabBar, { BottomTab } from "@/components/BottomTabBar";

type GameTab = "roulette" | "gacha" | "sikpan";

interface HomeLayoutProps {
  initialBottomTab?: BottomTab;
  initialGameTab?: GameTab;
}

export default function HomeLayout({
  initialBottomTab = "home",
  initialGameTab = "roulette",
}: HomeLayoutProps) {
  const [bottomTab, setBottomTab] = useState<BottomTab>(initialBottomTab);
  const [gameTab, setGameTab] = useState<GameTab>(initialGameTab);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "var(--toss-grey-100)",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {bottomTab === "home" && (
        <>
          {/* 게임 탭 선택 */}
          <div
            style={{
              padding: "20px 16px 14px",
              background: "var(--toss-card)",
              flexShrink: 0,
              zIndex: 10,
              boxShadow: "0 1px 0 0 var(--toss-grey-100)",
            }}
          >
            <SegmentedControl
              value={gameTab}
              onChange={(v) => setGameTab(v as GameTab)}
              size="large"
            >
              <SegmentedControl.Item value="roulette">룰렛</SegmentedControl.Item>
              <SegmentedControl.Item value="gacha">뽑기</SegmentedControl.Item>
              <SegmentedControl.Item value="sikpan">식판</SegmentedControl.Item>
            </SegmentedControl>
          </div>

          {/* 게임 콘텐츠 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              paddingBottom: "calc(96px + env(safe-area-inset-bottom))",
            }}
          >
            {gameTab === "roulette" && <RouletteGame />}
            {gameTab === "gacha" && <GachaGame />}
            {gameTab === "sikpan" && <SikpanGame />}
          </div>
        </>
      )}

      {bottomTab === "history" && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingBottom: "calc(96px + env(safe-area-inset-bottom))" }}>
          <MyPage />
        </div>
      )}

      <BottomTabBar active={bottomTab} onChange={setBottomTab} />
    </div>
  );
}
