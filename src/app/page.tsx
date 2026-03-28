"use client";
import { useState } from "react";
import { SegmentedControl } from "@toss/tds-mobile";
import RouletteGame from "@/components/RouletteGame";
import GachaGame from "@/components/GachaGame";
import SikpanGame from "@/components/SikpanGame";
import MyPage from "@/components/MyPage";
import BottomTabBar, { BottomTab } from "@/components/BottomTabBar";

type GameTab = "roulette" | "gacha" | "sikpan";

export default function Home() {
  const [bottomTab, setBottomTab] = useState<BottomTab>("home");
  const [gameTab, setGameTab] = useState<GameTab>("roulette");

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
      {bottomTab === "home" && (
        <>
          {/* 게임 탭 선택 */}
          <div
            style={{
              padding: "12px 16px 0",
              background: "#ffffff",
              flexShrink: 0,
            }}
          >
            <SegmentedControl
              value={gameTab}
              onChange={(v) => setGameTab(v as GameTab)}
              size="large"
            >
              <SegmentedControl.Item value="roulette">🎰 룰렛</SegmentedControl.Item>
              <SegmentedControl.Item value="gacha">🎁 가챠</SegmentedControl.Item>
              <SegmentedControl.Item value="sikpan">🍱 식판</SegmentedControl.Item>
            </SegmentedControl>
          </div>

          {/* 게임 콘텐츠 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              paddingBottom: 56,
            }}
          >
            {gameTab === "roulette" && <RouletteGame />}
            {gameTab === "gacha" && <GachaGame />}
            {gameTab === "sikpan" && <SikpanGame />}
          </div>
        </>
      )}

      {bottomTab === "history" && (
        <div style={{ flex: 1, overflow: "hidden", paddingBottom: 56 }}>
          <MyPage />
        </div>
      )}

      <BottomTabBar active={bottomTab} onChange={setBottomTab} />
    </div>
  );
}
