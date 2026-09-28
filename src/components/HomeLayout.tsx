"use client";
import { useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@toss/tds-mobile";
import RouletteGame from "@/components/RouletteGame";
import GachaGame from "@/components/GachaGame";
import SikpanGame from "@/components/SikpanGame";
import MyPage from "@/components/MyPage";
import BottomTabBar, { BottomTab } from "@/components/BottomTabBar";
import { installHistoryBack } from '@/lib/historyBack';

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

  // 토스 내비게이션 바 뒤로가기: 기록 탭 → 홈 탭, 뽑기·식판 → 룰렛, 룰렛이면 미니앱 종료
  // (라우트는 딥링크 진입점일 뿐 앱 안에서 페이지 이동이 없어 탭 상태만 되돌린다)
  const backRef = useRef<() => boolean>(() => false);
  backRef.current = () => {
    if (bottomTab !== "home") { setBottomTab("home"); return true; }
    if (gameTab !== "roulette") { setGameTab("roulette"); return true; }
    return false;
  };

  const historyBackRef = useRef<() => boolean>(() => false);
  historyBackRef.current = () => {
            if (backRef.current()) return true;
            return false;
          };
  useEffect(() => installHistoryBack(() => historyBackRef.current()), []);

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
