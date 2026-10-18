// "육개장이에요" / "우동이에요" / "밥버거예요" — 마지막 한글 음절의 받침으로 이에요·예요를 고른다
export function copula(word: string): string {
  const code = word.trim().charCodeAt(word.trim().length - 1) - 0xac00;
  const hasFinal = code >= 0 && code <= 11171 && code % 28 !== 0;
  return hasFinal ? "이에요" : "예요";
}
