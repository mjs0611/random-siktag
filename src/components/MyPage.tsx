"use client";
import { ListRow, ListHeader } from "@toss/tds-mobile";
import { useSpinState, HistoryRecord, GameType } from "@/hooks/useSpinState";
import BannerAd from "@/components/BannerAd";

const GAME_CONFIG: Record<GameType, { label: string; iconPath: string }> = {
  roulette: { label: "룰렛", iconPath: "/icons/roulette.png" },
  gacha:    { label: "뽑기", iconPath: "/icons/gacha.png" },
  sikpan:   { label: "식판", iconPath: "/icons/sikpan.png" },
};


const RARITY_COLOR: Record<string, string> = {
  normal: "#8B95A1",
  rare:   "#3182F6",
  legend: "#2143B3",
};

const RARITY_LABEL: Record<string, string> = {
  normal: "일반",
  rare:   "레어",
  legend: "레전드",
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (isToday) return "오늘";
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default function MyPage() {
  // Any game returns the shared full history
  const { history } = useSpinState("roulette");

  if (history.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          gap: 12,
          height: "100%",
        }}
      >
        <img src="/icons/history_new.png" alt="Empty" style={{ width: 64, height: 64, objectFit: "contain" }} />
        <p style={{ fontSize: 17, fontWeight: 700, color: "#191F28", margin: 0 }}>
          아직 기록이 없어요
        </p>
        <p style={{ fontSize: 14, color: "#8B95A1", textAlign: "center", margin: 0 }}>
          메뉴를 추천받으면 여기에 쌓여요
        </p>
      </div>
    );
  }

  // 게임별 통계
  const gameCounts = (["roulette", "gacha", "sikpan"] as GameType[]).map((g) => ({
    ...GAME_CONFIG[g],
    game: g,
    count: history.filter((h) => h.game === g).length,
  }));

  // 날짜별 그룹핑
  const grouped = history.reduce<Record<string, HistoryRecord[]>>((acc, record) => {
    const key = formatDate(record.ts);
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {});

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
      {/* 통계 카드 */}
      <div
        style={{
          margin: "16px 16px 8px",
          background: "#ffffff",
          borderRadius: 16,
          padding: "20px 16px",
        }}
      >
        <p style={{ fontSize: 14, color: "#8B95A1", marginBottom: 12, marginTop: 0 }}>
          총 <strong style={{ color: "#3182F6" }}>{history.length}회</strong> 뽑았어요
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {gameCounts
            .filter((g) => g.count > 0)
            .map((g) => (
              <div
                key={g.game}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 100,
                  background: "#F2F4F6",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#191F28",
                }}
              >
                <img src={g.iconPath} alt={g.label} style={{ width: 20, height: 20, objectFit: "contain" }} />
                <span>{g.label}</span>
                <span style={{ color: "#3182F6", marginLeft: 2 }}>{g.count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* 날짜별 기록 */}
      {Object.entries(grouped).map(([date, records]) => (
        <div key={date} style={{ marginBottom: 8 }}>
          <ListHeader
            title={
              <ListHeader.TitleParagraph
                typography="t7"
                color="#8B95A1"
                fontWeight="bold"
              >
                {date}
              </ListHeader.TitleParagraph>
            }
          />
          <div style={{ background: "#ffffff" }}>
            {records.map((r, i) => {
              const game = GAME_CONFIG[r.game];
              const subLabel = r.rarity
                ? `${game.label} · ${RARITY_LABEL[r.rarity] ?? r.rarity}`
                : game.label;
              return (
                <ListRow
                  key={r.ts}
                  border={i === 0 ? "none" : "indented"}
                  left={
                    <img src={game.iconPath} alt={game.label} style={{ width: 28, height: 28, objectFit: "contain" }} />
                  }
                  contents={
                    <ListRow.Texts
                      type="2RowTypeA"
                      top={r.label}
                      bottom={subLabel}
                    />
                  }
                  right={
                    <ListRow.Texts
                      type="Right1RowTypeA"
                      top={formatTime(r.ts)}
                    />
                  }
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
    <BannerAd />
    </div>
  );
}
