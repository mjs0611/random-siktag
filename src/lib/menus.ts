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
  // 마지막에 result가 오도록
  const filtered = shuffled.filter((m) => m !== result).slice(0, 11);
  return [...filtered, result];
}
