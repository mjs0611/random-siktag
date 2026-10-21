"use client";
import { useEffect, useRef, useState } from "react";
import { getSlotSequence, Category } from "@/lib/menus";
import { mountTurntable } from "@/lib/turntable";

interface Props {
  result: string | null;
  category: Category | "all";
  isSpinning: boolean;
  onDone: () => void;
}

const ITEM_HEIGHT = 72;
const SPIN_DURATION = 600; // 결과는 이미 상태 문구에 보이므로 연출은 짧게

function BibimbapBowl() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => (ref.current ? mountTurntable(ref.current, { sprite: "/hero/siktag-spin.webp", still: "/hero/siktag-spin-still.webp" }) : undefined), []);
  return <span ref={ref} className="hero-bowl" />;
}

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

  const displayItems = sequence.length > 0 ? sequence : result ? [result] : [];

  return (
    <div className="slot-roulette" data-spinning={isSpinning} data-result={!!result && !isSpinning}>
      {!result ? (
        <div className="recommendation-empty">
          <BibimbapBowl />
          <h1>오늘 뭐 먹을까요?</h1>
          <p>분류를 고르거나 바로 추천받아 보세요</p>
        </div>
      ) : (
        <>
          <div className="slot-highlight" aria-hidden="true" />
          <div className="slot-window" aria-hidden="true">
            <div
              className="slot-track"
              style={{
                transform: `translateY(${ITEM_HEIGHT + offset}px)`,
                transition: animating ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : "none",
              }}
            >
              {displayItems.map((item, i) => <div className="slot-item" key={i}>{item}</div>)}
            </div>
            <div className="slot-fade slot-fade-top" />
            <div className="slot-fade slot-fade-bottom" />
          </div>
          <p className="reduced-motion-status" aria-hidden="true">추천 메뉴를 고르는 중...</p>
        </>
      )}
    </div>
  );
}
