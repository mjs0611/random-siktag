"use client";
import { useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@toss/tds-mobile";
import RouletteGame from "@/components/RouletteGame";
import GachaGame from "@/components/GachaGame";
import SikpanGame from "@/components/SikpanGame";
import MyPage from "@/components/MyPage";
import BannerAd from "@/components/BannerAd";
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

  useEffect(() => installHistoryBack(() => backRef.current()), []);

  return (
    <div
      className="app-shell"
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
        <main
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingBottom: "calc(112px + env(safe-area-inset-bottom))",
          }}
        >
          {/* 기본은 "메뉴 추천받기" 한 버튼. 방식(룰렛·뽑기·식판) 바꾸기는 보조라 아래에 둔다 */}
          {gameTab === "roulette" && <RouletteGame />}
          {gameTab === "gacha" && <GachaGame />}
          {gameTab === "sikpan" && <SikpanGame />}
          <div role="group" aria-label="추천 방식 바꾸기" className="game-mode-row">
            <span>추천 방식</span>
            <SegmentedControl value={gameTab} onChange={(v) => setGameTab(v as GameTab)} size="small">
              <SegmentedControl.Item value="roulette">룰렛</SegmentedControl.Item>
              <SegmentedControl.Item value="gacha">뽑기</SegmentedControl.Item>
              <SegmentedControl.Item value="sikpan">식판</SegmentedControl.Item>
            </SegmentedControl>
          </div>
          <BannerAd />
        </main>
      )}

      {bottomTab === "history" && (
        <main style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", paddingBottom: "calc(112px + env(safe-area-inset-bottom))" }}>
          <MyPage onRecommend={() => setBottomTab("home")} />
        </main>
      )}

      <BottomTabBar active={bottomTab} onChange={setBottomTab} />
    </div>
  );
}
