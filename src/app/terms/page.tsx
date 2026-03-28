export default function TermsPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px", fontFamily: "sans-serif", color: "#191f28", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>서비스 이용약관</h1>
      <p style={{ fontSize: 13, color: "#6b7684", marginBottom: 40 }}>시행일: 2026년 3월 27일</p>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제1조 (목적)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          본 약관은 디토엑시스(Dito Axis)가 제공하는 랜덤식탁(Random Siktag) 서비스의 이용 조건 및 절차에 관한 사항을 규정합니다.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제2조 (서비스 내용)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          랜덤식탁은 사용자에게 메뉴를 무작위로 추천하는 서비스입니다. 추천된 메뉴는 참고용이며, 실제 음식점·메뉴의 가용 여부와 무관합니다.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제3조 (무료 이용 및 광고)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          서비스는 1일 3회 무료 추천을 제공합니다. 무료 횟수 소진 후에는 광고 시청을 통해 추가 추천을 받을 수 있습니다. 광고 수익은 서비스 운영에 사용됩니다.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제4조 (책임의 한계)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          회사는 서비스 이용으로 발생한 직접적·간접적 손해에 대해 책임을 지지 않습니다. 서비스는 현재 상태 그대로 제공되며, 특정 목적에의 적합성을 보증하지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>제5조 (약관 변경)</h2>
        <p style={{ fontSize: 14, color: "#333" }}>
          회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 안내합니다.
        </p>
      </section>

      <p style={{ fontSize: 13, color: "#6b7684", marginTop: 48 }}>
        문의: help.ditoaxis@gmail.com<br />
        사업자: 디토엑시스(Dito Axis)
      </p>
    </div>
  );
}
