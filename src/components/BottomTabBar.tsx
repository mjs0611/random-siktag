"use client";

type BottomTab = "home" | "history";

interface Props {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
}

const TABS = [
  { id: "home" as const, label: "홈", icon: "🏠" },
  { id: "history" as const, label: "기록", icon: "📋" },
];

export default function BottomTabBar({ active, onChange }: Props) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        display: "flex",
        background: "#ffffff",
        borderTop: "1px solid #E5E8EB",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 50,
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              padding: "10px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? "#FF6B35" : "#8B95A1",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export type { BottomTab };
