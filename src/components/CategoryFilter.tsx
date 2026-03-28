"use client";
import { CATEGORIES, Category } from "@/lib/menus";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

const ALL = { id: "all" as const, label: "전체", emoji: "🍽️" };

export default function CategoryFilter({ selected, onChange }: Props) {
  const items = [ALL, ...CATEGORIES];

  return (
    <div
      style={{
        background: "#ffffff",
        paddingBottom: 12,
        borderBottom: "1px solid #F2F4F6",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "12px 16px 0",
          scrollbarWidth: "none",
        }}
      >
        {items.map((cat) => {
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
                borderRadius: 100,
                border: active ? "2px solid #FF6B35" : "1.5px solid #E5E8EB",
                background: active ? "#FFF0EB" : "#ffffff",
                color: active ? "#FF6B35" : "#8B95A1",
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 15 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
