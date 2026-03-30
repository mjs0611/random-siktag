"use client";
import { useState, useEffect } from "react";
import { SegmentedControl, ConfirmDialog } from "@toss/tds-mobile";
import { graniteEvent, closeView } from "@apps-in-toss/web-framework";
import RouletteGame from "@/components/RouletteGame";
import GachaGame from "@/components/GachaGame";
import SikpanGame from "@/components/SikpanGame";
import MyPage from "@/components/MyPage";
import BottomTabBar, { BottomTab } from "@/components/BottomTabBar";

type GameTab = "roulette" | "gacha" | "sikpan";

export default function Home() {
  const [bottomTab, setBottomTab] = useState<BottomTab>("home");
  const [gameTab, setGameTab] = useState<GameTab>("roulette");
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const unsubscribe = graniteEvent.addEventListener("backEvent", {
      onEvent: () => setShowExitModal(true),
      onError: () => {},
    });
    return () => unsubscribe();
  }, []);

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

      <ConfirmDialog
        open={showExitModal}
        title={<ConfirmDialog.Title>랜덤식탁을 종료할까요?</ConfirmDialog.Title>}
        cancelButton={
          <ConfirmDialog.CancelButton onClick={() => setShowExitModal(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton
            color="primary"
            onClick={() => { closeView(); }}
          >
            종료하기
          </ConfirmDialog.ConfirmButton>
        }
        onClose={() => setShowExitModal(false)}
        closeOnDimmerClick={false}
      />
    </div>
  );
}
