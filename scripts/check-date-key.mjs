// Run: TZ=Asia/Seoul node scripts/check-date-key.mjs
import assert from "node:assert/strict";
import { dateKey } from "../src/lib/dateKey.ts";

// 2026-09-27 08:59 KST (= 09-26 23:59 UTC) must already be the 27th.
assert.equal(dateKey(Date.UTC(2026, 8, 26, 23, 59)), "2026-09-27");
// 2026-09-27 00:00 KST (= 09-26 15:00 UTC) starts the 27th; one minute earlier is the 26th.
assert.equal(dateKey(Date.UTC(2026, 8, 26, 15, 0)), "2026-09-27");
assert.equal(dateKey(Date.UTC(2026, 8, 26, 14, 59)), "2026-09-26");
console.log("dateKey ok");
