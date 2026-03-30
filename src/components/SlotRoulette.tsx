"use client";
import { useEffect, useRef, useState } from "react";
import { getSlotSequence, Category } from "@/lib/menus";

interface Props {
  result: string | null;
  category: Category | "all";
  isSpinning: boolean;
  onDone: () => void;
}

const ITEM_HEIGHT = 72;
const SPIN_DURATION = 1800;

export default function SlotRoulette({ result, category, isSpinning, onDone }: Props) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!isSpinning || !result) return;
    const seq = getSlotSequence(result, category);
    setSequence(seq);
    setOffset(0);
    doneRef.current = false;
    setAnimating(false);

    const raf = requestAnimationFrame(() => {
      setAnimating(true);
      setOffset(-(seq.length - 1) * ITEM_HEIGHT);
    });

    const timer = setTimeout(() => {
      setAnimating(false);
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, SPIN_DURATION + 100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning, result]);

  const displayItems = sequence.length > 0 ? sequence : result ? [result] : ["?"];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 340,
        background: "#ffffff",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* 선택 하이라이트 — 아이템보다 아래 (zIndex: 0) */}
      <div
        style={{
          position: "absolute",
          top: ITEM_HEIGHT,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          background: "#FFF0EB",
          borderTop: "1.5px solid #FF6B35",
          borderBottom: "1.5px solid #FF6B35",
          zIndex: 0,
        }}
      />

      {/* 슬롯 트랙 — 스태킹 컨텍스트(zIndex:1)로 하이라이트 위에 표시 */}
      <div style={{ height: ITEM_HEIGHT * 3, overflow: "hidden", position: "relative", zIndex: 1 }}>
        <div
          style={{
            transform: `translateY(${ITEM_HEIGHT + offset}px)`,
            transition: animating
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
              : "none",
          }}
        >
          {displayItems.map((item, i) => (
            <div
              key={i}
              style={{
                height: ITEM_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#191F28",
                letterSpacing: "-0.3px",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 페이드 — 트랙 안에서 텍스트 마스킹 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT,
            background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT,
            background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
