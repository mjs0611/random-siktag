"use client";
import { ListRow, ListHeader, adaptive } from "@toss/tds-mobile";
import { CATEGORIES } from "@/lib/menus";

interface HistoryRecord {
  menu: string;
  category: string;
  ts: number;
}

interface Props {
  history: HistoryRecord[];
}

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

function getCategoryInfo(id: string) {
  if (id === "all") return { label: "전체", emoji: "🍽️" };
  return CATEGORIES.find((c) => c.id === id) ?? { label: id, emoji: "🍽️" };
}

export default function MyPage({ history }: Props) {
  const stats = CATEGORIES.map((cat) => ({
    ...cat,
    count: history.filter((h) => h.category === cat.id).length,
  })).sort((a, b) => b.count - a.count);

  const totalSpins = history.length;

  if (totalSpins === 0) {
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
        <span style={{ fontSize: 52 }}>🍽️</span>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#191F28", margin: 0 }}>
          아직 기록이 없어요
        </p>
        <p style={{ fontSize: 14, color: "#8B95A1", textAlign: "center", margin: 0 }}>
          메뉴를 추천받으면 여기에 쌓여요
        </p>
      </div>
    );
  }

  // 날짜별 그룹핑
  const grouped = history.reduce<Record<string, HistoryRecord[]>>((acc, record) => {
    const key = formatDate(record.ts);
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {});

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 40 }}>
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
          총{" "}
          <strong style={{ color: "#FF6B35" }}>{totalSpins}회</strong>{" "}
          추천받았어요
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {stats
            .filter((s) => s.count > 0)
            .map((s) => (
              <div
                key={s.id}
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
                <span>{s.emoji}</span>
                <span>{s.label}</span>
                <span style={{ color: "#FF6B35", marginLeft: 2 }}>{s.count}</span>
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
                color={adaptive.grey600}
                fontWeight="bold"
              >
                {date}
              </ListHeader.TitleParagraph>
            }
          />
          <div style={{ background: "#ffffff" }}>
            {records.map((r, i) => {
              const catInfo = getCategoryInfo(r.category);
              return (
                <ListRow
                  key={r.ts}
                  border={i === 0 ? "none" : "indented"}
                  left={
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{catInfo.emoji}</span>
                  }
                  contents={
                    <ListRow.Texts
                      type="2RowTypeA"
                      top={r.menu}
                      bottom={catInfo.label}
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
  );
}
