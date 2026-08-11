import assert from "node:assert/strict";
import test from "node:test";

import { captureUtm, getUtm, track } from "../../lib/events.ts";

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.get(key) ?? null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }
}

test("keeps first-touch UTM in storage and later event attribution", async () => {
  const requests = [];
  const sessionStorage = new MemoryStorage();

  globalThis.window = {
    location: { search: "?utm_source=first&utm_campaign=launch" },
    matchMedia: () => ({ matches: false }),
    sessionStorage,
  };
  globalThis.fetch = async (_url, init) => {
    requests.push(JSON.parse(init.body));
    return new Response(null, { status: 204 });
  };

  captureUtm();
  window.location.search = "?utm_source=later&utm_campaign=retarget";
  captureUtm();

  assert.deepEqual(getUtm(), {
    utmSource: "first",
    utmCampaign: "launch",
  });

  await track({
    type: "product_view",
    productSlug: "sample",
    utmSource: "later",
    utmCampaign: "retarget",
  });

  assert.equal(requests.length, 1);
  assert.equal(requests[0].utmSource, "first");
  assert.equal(requests[0].utmCampaign, "launch");
});
