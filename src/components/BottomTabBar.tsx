"use client";

type BottomTab = "home" | "history";

interface Props {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
}

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? "#3182F6" : "#ADB5BD";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill={color} />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  const color = active ? "#3182F6" : "#ADB5BD";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 12H3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4.5 8L7.5 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomTabBar({ active, onChange }: Props) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: "calc(24px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 48px)",
        maxWidth: 400,
        display: "flex",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 32,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
        zIndex: 50,
        border: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      {(["home", "history"] as BottomTab[]).map((id) => {
        const isActive = active === id;
        const label = id === "home" ? "홈" : "기록";
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "12px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div
              style={{
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              {id === "home" ? <HomeIcon active={isActive} /> : <HistoryIcon active={isActive} />}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#3182F6" : "#ADB5BD",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export type { BottomTab };
