export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px", fontFamily: "sans-serif", color: "#191f28", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>개인정보 처리방침</h1>
      <p style={{ fontSize: 13, color: "#6b7684", marginBottom: 40 }}>시행일: 2026년 3월 27일</p>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제1조 (개인정보 수집 여부)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          랜덤식탁(Random Siktag)는 사용자의 개인정보를 수집하지 않습니다. 메뉴 추천 기록은 사용자의 기기 내에서만 저장·관리되며, 회사의 서버로 전송되거나 저장되지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제2조 (로컬 데이터 저장)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          서비스는 사용자의 기기 내 로컬 저장소(localStorage)에 다음 정보를 저장합니다.
        </p>
        <ul style={{ fontSize: 14, color: "#333", paddingLeft: 20, marginTop: 8 }}>
          <li>메뉴 추천 기록 (메뉴명, 카테고리, 시각 — 개인 식별 불가)</li>
          <li>일일 무료 추천 사용 횟수 (숫자값)</li>
        </ul>
        <p style={{ fontSize: 14, color: "#333", marginTop: 8 }}>
          해당 데이터는 기기 외부로 전송되지 않으며, 앱 데이터를 삭제하면 함께 삭제됩니다.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제3조 (제3자 광고 서비스)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          서비스 내 광고는 아래 제3자 광고 플랫폼을 통해 제공됩니다. 각 플랫폼은 광고 제공 목적으로 기기 식별자 등 제한적인 정보를 수집할 수 있으며, 이는 각 플랫폼의 개인정보 처리방침을 따릅니다.
        </p>
        <ul style={{ fontSize: 14, color: "#333", paddingLeft: 20, marginTop: 8 }}>
          <li>토스애즈 (TossAds) — 토스 개인정보 처리방침 적용</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제4조 (개인정보 보호책임자)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>개인정보 처리와 관련한 문의는 아래로 연락해 주세요.</p>
        <ul style={{ fontSize: 14, color: "#333", paddingLeft: 20, marginTop: 8 }}>
          <li>사업자명: 디토엑시스(Dito Axis)</li>
          <li>이메일: help.ditoaxis@gmail.com</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제5조 (방침 변경)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          본 방침은 관련 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.
        </p>
      </section>

      <p style={{ fontSize: 13, color: "#6b7684", marginTop: 48 }}>
        문의: help.ditoaxis@gmail.com<br />
        사업자: 디토엑시스(Dito Axis)
      </p>
    </div>
  );
}
