"use client";
import { CATEGORIES, Category } from "@/lib/menus";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

const ALL = { id: "all" as const, label: "전체", iconPath: "/icons/history.png" };

export default function CategoryFilter({ selected, onChange }: Props) {
  const items = [ALL, ...CATEGORIES];

  return (
    <div
      style={{
        background: "#ffffff",
        paddingBottom: 12,
        borderBottom: "1px solid #F2F4F6",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* 오른쪽 스크롤 힌트 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 40,
          background: "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
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
              <img src={cat.iconPath} alt={cat.label} style={{ width: 16, height: 16, objectFit: "contain", mixBlendMode: "multiply", opacity: active ? 1 : 0.6 }} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
