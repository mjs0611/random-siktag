"use client";
import { useState } from "react";
import { Category } from "@/lib/menus";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
  disabled?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "전체", icon: "/icons/all_new.png" },
  { id: "korean", label: "한식", icon: "/icons/korean_new.png" },
  { id: "chinese", label: "중식", icon: "/icons/chinese_new.png" },
  { id: "japanese", label: "일식", icon: "/icons/japanese_new.png" },
  { id: "western", label: "양식", icon: "/icons/western_new.png" },
  { id: "bunsik", label: "분식", icon: "/icons/bunsik_new.png" },
  { id: "snack", label: "간식", icon: "/icons/snack_new.png" },
] satisfies { id: Category | "all"; label: string; icon: string }[];

export default function CategoryFilter({ selected, onChange, disabled = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const current = CATEGORIES.find((cat) => cat.id === selected)!;

  return (
    <section className="category-filter" aria-label="음식 분류">
      <button
        type="button"
        className="category-toggle"
        aria-expanded={expanded}
        aria-controls="food-categories"
        disabled={disabled}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="category-current">
          <img src={current.icon} alt="" width={32} height={32} />
          <span>음식 분류 <strong>{current.label}</strong></span>
        </span>
        <span className="category-toggle-label">
          {expanded ? "접기" : "바꾸기"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="category-chevron">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div id="food-categories" className="category-options" hidden={!expanded} role="group" aria-label="추천할 음식 분류 선택">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="category-option"
            aria-pressed={selected === cat.id}
            disabled={disabled}
            onClick={() => onChange(cat.id)}
          >
            <img src={cat.icon} alt="" width={28} height={28} />
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
