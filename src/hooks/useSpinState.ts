"use client";
import { useState, useEffect, useCallback } from "react";

const FREE_SPINS_PER_DAY = 3;
const STORAGE_KEY = "meokja_spin_state";

interface SpinRecord {
  menu: string;
  category: string;
  ts: number;
}

interface SpinState {
  date: string;          // "YYYY-MM-DD"
  freeSpinsUsed: number; // 오늘 사용한 무료 횟수
  history: SpinRecord[];
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): SpinState {
  if (typeof window === "undefined") {
    return { date: todayStr(), freeSpinsUsed: 0, history: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayStr(), freeSpinsUsed: 0, history: [] };
    const parsed: SpinState = JSON.parse(raw);
    // 날짜가 바뀌면 무료 횟수 초기화
    if (parsed.date !== todayStr()) {
      return { date: todayStr(), freeSpinsUsed: 0, history: parsed.history };
    }
    return parsed;
  } catch {
    return { date: todayStr(), freeSpinsUsed: 0, history: [] };
  }
}

export function useSpinState() {
  const [state, setState] = useState<SpinState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const freeSpinsLeft = Math.max(0, FREE_SPINS_PER_DAY - state.freeSpinsUsed);
  const needsAd = freeSpinsLeft === 0;

  const recordSpin = useCallback((menu: string, category: string) => {
    setState((prev) => ({
      ...prev,
      freeSpinsUsed: prev.freeSpinsUsed < FREE_SPINS_PER_DAY
        ? prev.freeSpinsUsed + 1
        : prev.freeSpinsUsed,
      history: [{ menu, category, ts: Date.now() }, ...prev.history].slice(0, 50),
    }));
  }, []);

  // 광고 시청 후 1회 추가 지급: freeSpinsUsed를 1 감소시켜 1회 확보
  const grantRewardSpin = useCallback(() => {
    setState((prev) => ({
      ...prev,
      freeSpinsUsed: Math.max(0, prev.freeSpinsUsed - 1),
    }));
  }, []);

  const todayHistory = state.history.filter(
    (r) => new Date(r.ts).toISOString().slice(0, 10) === todayStr()
  );

  return { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin, history: state.history, todayHistory };
}
