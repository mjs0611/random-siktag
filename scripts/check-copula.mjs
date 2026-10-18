// Run: node scripts/check-copula.mjs
import assert from "node:assert/strict";
import { copula } from "../src/lib/copula.ts";

assert.equal(copula("육개장"), "이에요");
assert.equal(copula("우동"), "이에요");
assert.equal(copula("밥버거"), "예요");
assert.equal(copula("오삼불고기"), "예요");
console.log("copula ok");
