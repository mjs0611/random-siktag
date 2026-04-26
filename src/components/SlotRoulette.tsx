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
        background: "var(--toss-card)",
        borderRadius: "var(--toss-border-radius-lg)",
        overflow: "hidden",
        position: "relative",
        boxShadow: "var(--toss-shadow-md)",
        border: "1px solid var(--toss-grey-100)",
      }}
    >
      {/* 선택 하이라이트 */}
      <div
        style={{
          position: "absolute",
          top: ITEM_HEIGHT,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          background: "var(--toss-primary-light)",
          borderTop: "1.5px solid var(--toss-primary)",
          borderBottom: "1.5px solid var(--toss-primary)",
          zIndex: 0,
        }}
      />

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
                fontSize: 24,
                fontWeight: 800,
                color: "var(--toss-grey-900)",
                letterSpacing: "-0.5px",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 페이드 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT,
            background: "linear-gradient(to bottom, var(--toss-card), rgba(255,255,255,0))",
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
            background: "linear-gradient(to top, var(--toss-card), rgba(255,255,255,0))",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
