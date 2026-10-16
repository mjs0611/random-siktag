"use client";
// SDK 3.x: TDS는 @toss/tds-mobile-ait의 TDSMobileAITProvider로 감싸야 토스 앱 안에서 동작한다
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { installHistoryBack } from "@/lib/historyBack";

const ROUTE_ENTRY = "__randomSiktagRouteEntry";

export default function TDSProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const visits = useRef<string[]>([]);

  useEffect(() => {
    // Next의 history state를 보존하며 이 앱에서 방문한 경로만 식별한다.
    const state = window.history.state;
    const entry = state?.[ROUTE_ENTRY];
    const index = visits.current.findIndex((visit) => visit === entry);
    if (index >= 0) {
      visits.current.length = index + 1;
    } else {
      const nextEntry = `${Date.now()}-${Math.random()}`;
      visits.current.push(nextEntry);
      window.history.replaceState({ ...state, [ROUTE_ENTRY]: nextEntry }, "");
    }

    return installHistoryBack(() => {
      if (visits.current.length > 1) {
        router.back();
        return true;
      }
      if (pathname === "/terms" || pathname === "/privacy") {
        // replace는 새 방문이 아니다. 홈을 첫 화면으로 삼아 다음 뒤로가기는 종료한다.
        visits.current.length = 0;
        router.replace("/");
        return true;
      }
      return false;
    }, { route: true });
  }, [pathname, router]);

  return <TDSMobileAITProvider>{children}</TDSMobileAITProvider>;
}
