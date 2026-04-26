"use client";
import { Category } from "@/lib/menus";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

const CATEGORIES = [
  { id: "all" as const, label: "전체", icon: "/icons/all_new.png" },
  { id: "korean" as const, label: "한식", icon: "/icons/korean_new.png" },
  { id: "chinese" as const, label: "중식", icon: "/icons/chinese_new.png" },
  { id: "japanese" as const, label: "일식", icon: "/icons/japanese_new.png" },
  { id: "western" as const, label: "양식", icon: "/icons/western_new.png" },
  { id: "school" as const, label: "분식", icon: "/icons/bunsik_new.png" },
  { id: "dessert" as const, label: "간식", icon: "/icons/snack_new.png" },
];

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div
      style={{
        background: "var(--toss-card)",
        paddingBottom: 14,
        borderBottom: "1px solid var(--toss-grey-100)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 14,
          width: 48,
          background: "linear-gradient(to right, rgba(255,255,255,0), var(--toss-card))",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "16px 16px 0",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px 8px 12px",
                borderRadius: 100,
                border: active ? "1.5px solid var(--toss-primary)" : "1.5px solid var(--toss-grey-100)",
                background: active ? "var(--toss-primary-light)" : "var(--toss-card)",
                color: active ? "var(--toss-primary)" : "var(--toss-grey-700)",
                fontWeight: active ? 700 : 500,
                fontSize: 15,
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: "inherit",
              }}
            >
              <div 
                style={{ 
                  width: 32, 
                  height: 32, 
                  transform: active ? "scale(1.1)" : "scale(1)", 
                  transition: "transform 0.2s",
                  opacity: active ? 1 : 0.8
                }}
              >
                <img src={cat.icon} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
