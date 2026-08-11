import assert from "node:assert/strict";
import test from "node:test";

import { isEdgeBackGesture, isTopExitScroll } from "./exit-intent.ts";

test("recognizes a horizontal swipe from the browser back edge", () => {
  assert.equal(isEdgeBackGesture({ x: 8, y: 220 }, { x: 100, y: 230 }), true);
  assert.equal(isEdgeBackGesture({ x: 40, y: 220 }, { x: 140, y: 225 }), false);
  assert.equal(isEdgeBackGesture({ x: 8, y: 220 }, { x: 90, y: 300 }), false);
});

test("recognizes a return to the top only after meaningful exploration", () => {
  assert.equal(isTopExitScroll(480, 36, 12), true);
  assert.equal(isTopExitScroll(120, 36, 12), false);
  assert.equal(isTopExitScroll(480, 4, 12), false);
});
