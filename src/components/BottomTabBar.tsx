"use client";

type BottomTab = "home" | "history";

interface Props {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
}

const TABS = [
  { id: "home" as const, label: "홈", iconPath: "/icons/home.png" },
  { id: "history" as const, label: "기록", iconPath: "/icons/history.png" },
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
              color: isActive ? "#3182F6" : "#8B95A1",
              fontFamily: "inherit",
            }}
          >
            <img
              src={tab.iconPath}
              alt={tab.label}
              style={{ width: 24, height: 24, objectFit: "contain", mixBlendMode: "multiply", opacity: isActive ? 1 : 0.4 }}
            />

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
