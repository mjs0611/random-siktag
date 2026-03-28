export type Category = "korean" | "chinese" | "japanese" | "western" | "bunsik" | "snack";

export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "korean",   label: "한식",  emoji: "🍚" },
  { id: "chinese",  label: "중식",  emoji: "🥡" },
  { id: "japanese", label: "일식",  emoji: "🍣" },
  { id: "western",  label: "양식",  emoji: "🍝" },
  { id: "bunsik",   label: "분식",  emoji: "🍜" },
  { id: "snack",    label: "간식",  emoji: "🧁" },
];

export const MENUS: Record<Category, string[]> = {
  korean: [
    "김치찌개", "된장찌개", "순두부찌개", "부대찌개", "삼겹살",
    "불고기", "비빔밥", "돌솥비빔밥", "갈비탕", "설렁탕",
    "콩나물국밥", "순대국밥", "해장국", "삼계탕", "닭볶음탕",
    "제육볶음", "오삼불고기", "낙지볶음", "쭈꾸미볶음", "갈비찜",
    "장어구이", "생선구이", "냉면", "물냉면", "비빔냉면",
    "보쌈", "족발", "수육국밥", "파전", "김치전",
  ],
  chinese: [
    "짜장면", "짬뽕", "탕수육", "마파두부", "깐풍기",
    "유산슬", "팔보채", "볶음밥", "양장피", "고추잡채",
    "동파육", "마라탕", "훠궈", "딤섬", "마라샹궈",
    "마라면", "짬뽕밥", "짜장밥", "물만두", "군만두",
  ],
  japanese: [
    "초밥", "사시미", "라멘", "우동", "소바",
    "카츠동", "오야코동", "규동", "텐동", "나베",
    "타코야키", "오코노미야키", "야키토리", "스키야키", "샤브샤브",
    "돈카츠", "가라아게", "오니기리", "냉우동", "츠케멘",
  ],
  western: [
    "파스타", "스테이크", "피자", "리조또", "뇨키",
    "카르보나라", "알리오 올리오", "봉골레", "크림파스타", "토마토파스타",
    "버거", "치킨버거", "샐러드", "수프", "샌드위치",
    "그라탱", "오믈렛", "에그베네딕트", "클럽샌드위치", "타코",
  ],
  bunsik: [
    "떡볶이", "순대", "어묵", "라볶이", "쫄면",
    "김밥", "참치김밥", "치즈김밥", "충무김밥", "도시락",
    "핫도그", "튀김", "오뎅탕", "치즈떡볶이", "로제떡볶이",
    "불닭볶음면", "컵라면", "라면", "만두", "국물떡볶이",
  ],
  snack: [
    "아이스크림", "케이크", "마카롱", "크로플", "와플",
    "버블티", "탕후루", "크레페", "도넛", "빙수",
    "떡", "약과", "호떡", "붕어빵", "계란빵",
    "치즈케이크", "티라미수", "초콜릿", "쿠키", "빵",
  ],
};

export function pickRandom(category: Category | "all"): string {
  if (category === "all") {
    const all = Object.values(MENUS).flat();
    return all[Math.floor(Math.random() * all.length)];
  }
  const list = MENUS[category];
  return list[Math.floor(Math.random() * list.length)];
}

export function getSlotSequence(result: string, category: Category | "all"): string[] {
  const pool = category === "all" ? Object.values(MENUS).flat() : MENUS[category];
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 12);
  const filtered = shuffled.filter((m) => m !== result).slice(0, 11);
  return [...filtered, result];
}

// ─── 가챠 ───────────────────────────────────────────────
export type GachaRarity = "normal" | "rare" | "legend";

export const GACHA_MENUS: Record<GachaRarity, string[]> = {
  normal: [
    "김치찌개", "된장찌개", "라면", "김밥", "떡볶이",
    "순대", "짜장면", "짬뽕", "볶음밥", "비빔밥",
    "우동", "칼국수", "샌드위치", "핫도그", "컵라면",
    "제육볶음", "돈카츠", "파스타", "피자", "버거",
  ],
  rare: [
    "삼겹살", "불고기", "갈비찜", "보쌈", "족발",
    "스테이크", "초밥", "라멘", "마라탕", "훠궈",
    "탕수육", "깐풍기", "삼계탕", "갈비탕", "부대찌개",
    "카르보나라", "리조또", "오마카세 코스", "샤브샤브", "스키야키",
  ],
  legend: [
    "🦞 랍스터 코스",
    "🥩 와규 오마카세",
    "🍣 스시 오마카세",
    "🦀 킹크랩",
    "🥂 파인다이닝",
    "🦆 베이징 오리",
    "🍖 바베큐 플래터",
    "🫕 트러플 리조또",
  ],
};

export const GACHA_RARITY_CONFIG = {
  normal:  { label: "일반",   color: "#8B95A1", bg: "#F2F4F6", rate: 0.60 },
  rare:    { label: "레어",   color: "#3182F6", bg: "#EBF3FF", rate: 0.30 },
  legend:  { label: "레전드", color: "#FF6B35", bg: "#FFF0EB", rate: 0.10 },
};

export function drawGacha(): { menu: string; rarity: GachaRarity } {
  const r = Math.random();
  let rarity: GachaRarity;
  if (r < 0.10) rarity = "legend";
  else if (r < 0.40) rarity = "rare";
  else rarity = "normal";

  const pool = GACHA_MENUS[rarity];
  const menu = pool[Math.floor(Math.random() * pool.length)];
  return { menu, rarity };
}

// ─── 식판 ───────────────────────────────────────────────
export const SIKPAN = {
  main: [
    "쌀밥", "잡곡밥", "흑미밥", "현미밥", "보리밥",
    "볶음밥", "비빔밥", "콩나물밥", "버섯밥", "김치볶음밥",
  ],
  soup: [
    "된장국", "미역국", "김치찌개", "순두부찌개", "콩나물국",
    "시금치국", "북어국", "계란국", "무국", "부대찌개",
  ],
  side1: [
    "김치", "깍두기", "열무김치", "배추김치", "오이소박이",
    "파김치", "총각김치", "깻잎장아찌", "무장아찌", "갓김치",
  ],
  side2: [
    "계란말이", "멸치볶음", "시금치나물", "콩나물무침", "잡채",
    "두부조림", "감자조림", "어묵볶음", "고사리나물", "호박볶음",
  ],
};

export type SikpanResult = {
  main: string;
  soup: string;
  side1: string;
  side2: string;
};

export function drawSikpan(): SikpanResult {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  return {
    main:  pick(SIKPAN.main),
    soup:  pick(SIKPAN.soup),
    side1: pick(SIKPAN.side1),
    side2: pick(SIKPAN.side2),
  };
}
