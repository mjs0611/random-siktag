"use client";
import { useState, useEffect, useCallback } from "react";
import { dateKey } from "@/lib/dateKey";

const FREE_SPINS_PER_DAY = 3;
const STORAGE_KEY = "randomsiktag_spin_state";

export type GameType = "roulette" | "gacha" | "sikpan";

export interface HistoryRecord {
  game: GameType;
  label: string;
  category?: string;
  rarity?: string;
  ts: number;
}

interface SpinState {
  date: string;
  spinsUsed: Record<GameType, number>;
  history: HistoryRecord[];
}

function todayStr() {
  return dateKey();
}

function defaultState(): SpinState {
  return {
    date: todayStr(),
    spinsUsed: { roulette: 0, gacha: 0, sikpan: 0 },
    history: [],
  };
}

function loadState(): SpinState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed: SpinState = JSON.parse(raw);
    if (parsed.date !== todayStr()) {
      return { ...defaultState(), history: parsed.history };
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

export function useSpinState(game: GameType) {
  const [state, setState] = useState<SpinState>(() => loadState());

  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true); // 현재 화면의 추천은 유지하되 영속 저장 실패를 알린다.
    }
  }, [state]);

  const freeSpinsLeft = Math.max(0, FREE_SPINS_PER_DAY - (state.spinsUsed[game] ?? 0));
  const needsAd = freeSpinsLeft === 0;

  const recordSpin = useCallback((record: Omit<HistoryRecord, "ts">) => {
    setState((prev) => ({
      ...prev,
      spinsUsed: {
        ...prev.spinsUsed,
        [game]: prev.spinsUsed[game] < FREE_SPINS_PER_DAY
          ? prev.spinsUsed[game] + 1
          : prev.spinsUsed[game],
      },
      history: [{ ...record, ts: Date.now() }, ...prev.history].slice(0, 100),
    }));
  }, [game]);

  const grantRewardSpin = useCallback(() => {
    setState((prev) => ({
      ...prev,
      spinsUsed: {
        ...prev.spinsUsed,
        [game]: Math.max(0, prev.spinsUsed[game] - 1),
      },
    }));
  }, [game]);

  const todayHistory = state.history.filter(
    (r) => dateKey(r.ts) === todayStr()
  );

  return { freeSpinsLeft, needsAd, recordSpin, grantRewardSpin, history: state.history, todayHistory, storageError };
}
