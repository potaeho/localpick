import type { DeviceType, EventInput, UtmParams } from "./types";

const UTM_KEY = "lp_utm";
const LANDING_KEY = "lp_landing";
const TRACKED_KEY_PREFIX = "lp_tracked:";

// A single browser tab can dispatch effects and click handlers almost at the
// same time. Keeping requests in invocation order makes the JSONL audit trail
// match the participant journey (for example, buy_click before fakedoor_shown).
let eventQueue: Promise<void> = Promise.resolve();

const UTM_FIELDS: Record<string, keyof UtmParams> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
};
const UTM_INPUT_FIELDS = new Set<string>(Object.values(UTM_FIELDS));

/** 프라이빗 모드 등에서 sessionStorage 접근이 막힐 수 있어 감싸둔다 */
function safeSession(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * 광고에서 넘어온 UTM 파라미터를 세션에 저장한다.
 *
 * 상세 페이지에서 생산자 페이지로 넘어가면 URL에서 UTM이 사라지지만, 그 클릭도
 * 같은 광고에서 온 방문으로 집계해야 한다. 그래서 첫 도착 시 한 번 붙잡아
 * 세션 내내 모든 이벤트에 붙인다.
 */
export function captureUtm(fallback: UtmParams = {}): void {
  const store = safeSession();
  if (!store) return;

  // Campaign attribution is first-touch within the anonymous browser session.
  // Later URLs may contain a different campaign while navigating or reopening
  // a link, but must not rewrite the acquisition source already captured.
  try {
    if (store.getItem(UTM_KEY) !== null) return;
  } catch {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const captured: UtmParams = {};

  for (const [param, field] of Object.entries(UTM_FIELDS)) {
    const value = params.get(param) ?? fallback[field];
    if (value) captured[field] = value.slice(0, 120);
  }

  // URL과 서버가 전달한 fallback 모두 비어 있으면 저장하지 않는다.
  if (Object.keys(captured).length === 0) return;

  try {
    store.setItem(UTM_KEY, JSON.stringify(captured));
  } catch {
    /* 저장 실패는 무시 — 이벤트는 UTM 없이 기록된다 */
  }
}

/**
 * 세션의 첫 도착 지점(리퍼러·랜딩 경로)을 한 번만 붙잡아둔다.
 *
 * captureUtm과 같은 first-touch 패턴이다 — 이후 사이트 안에서 이동하면
 * document.referrer는 내부 페이지로 바뀌어버리므로, 외부에서 처음 들어온
 * 순간의 값을 세션 내내 재사용해야 "진짜" 유입 경로가 남는다.
 */
export function captureLanding(): { referrer: string; landingPath: string } | null {
  const store = safeSession();
  if (!store) return null;

  try {
    const raw = store.getItem(LANDING_KEY);
    if (raw) return JSON.parse(raw) as { referrer: string; landingPath: string };
  } catch {
    /* 저장된 값이 깨졌으면 새로 잡는다 */
  }

  const captured = {
    referrer: (document.referrer || "").slice(0, 300),
    landingPath: (window.location.pathname + window.location.search).slice(0, 300),
  };

  try {
    store.setItem(LANDING_KEY, JSON.stringify(captured));
  } catch {
    /* 저장 실패는 무시 — session_start는 그래도 한 번은 나간다 */
  }

  return captured;
}

export function getUtm(): UtmParams {
  const store = safeSession();
  if (!store) return {};

  try {
    const raw = store.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

/** 화면 폭 기준 — 스토어의 md 브레이크포인트와 같은 기준을 쓴다 */
export function getDevice(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

/**
 * 행동 이벤트 전송.
 *
 * 페이지를 떠나는 중에도 전송이 살아남도록 keepalive를 쓴다. 전송 실패는
 * 삼킨다 — 측정 때문에 소비자 경험이 깨지면 안 되기 때문이다.
 */
export async function track(
  input: Omit<EventInput, "device"> & { device?: DeviceType },
): Promise<void> {
  // 여기서 한 번 더 붙잡는다. React는 자식 effect를 부모보다 먼저 실행하므로,
  // 프로바이더의 captureUtm()만 믿으면 상세 페이지에 바로 착지한 첫
  // product_view — 즉 광고에서 막 넘어온 그 이벤트 — 가 UTM을 놓친다.
  const explicitUtm: UtmParams = {
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmContent: input.utmContent,
  };
  captureUtm(explicitUtm);

  // 값이 없는 키는 걸러낸다. 상세 페이지는 URL에서 읽은 UTM을 넘기는데, 광고로
  // 들어온 뒤 두 번째 상품으로 이동하면 그 URL에는 UTM이 없어 undefined가 넘어온다.
  // 그대로 펼치면 세션에 붙잡아둔 UTM을 undefined로 덮어써, 같은 광고에서 온
  // 방문인데도 캠페인 귀속이 끊긴다.
  const provided = Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => value !== undefined && !UTM_INPUT_FIELDS.has(key),
    ),
  );

  const storedUtm = getUtm();
  const attribution =
    Object.keys(storedUtm).length > 0 ? storedUtm : explicitUtm;

  const payload = {
    ...attribution,
    device: getDevice(),
    ...provided,
  };

  const send = async () => {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(payload),
    });
  };

  const queued = eventQueue.then(send);
  // A failed measurement must not prevent the next interaction from being
  // recorded. The caller still receives a resolved promise by design.
  eventQueue = queued.catch(() => undefined);
  await queued.catch(() => undefined);
}

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/** "무엇을 눌렀는지"를 label 하나로 남기는 범용 클릭 기록 — 매번 새로 기록된다 */
export function trackClick(
  label: string,
  extra: Partial<Omit<EventInput, "type" | "device" | "label">> = {},
): void {
  void track({ type: "ui_click", label, clientEventId: randomId(), ...extra });
}

/**
 * 탭을 닫거나 다른 페이지로 이동하는 순간에도 살아남는 전송.
 *
 * track()의 fetch(keepalive)는 대기 중인 큐를 거치는데, 페이지가 사라지는
 * 순간에는 그 대기가 끝까지 실행된다는 보장이 없다. sendBeacon은 브라우저가
 * 페이지 언로드 이후에도 전송을 이어가도록 설계된 API라 이탈 신호에는
 * 이쪽이 더 안전하다.
 */
export function trackBeacon(
  input: Omit<EventInput, "device"> & { device?: DeviceType },
): void {
  if (typeof navigator === "undefined") return;

  const explicitUtm: UtmParams = {
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmContent: input.utmContent,
  };
  captureUtm(explicitUtm);

  const provided = Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => value !== undefined && !UTM_INPUT_FIELDS.has(key),
    ),
  );
  const storedUtm = getUtm();
  const attribution =
    Object.keys(storedUtm).length > 0 ? storedUtm : explicitUtm;

  const payload = {
    ...attribution,
    device: getDevice(),
    ...provided,
  };

  try {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    const sent = navigator.sendBeacon?.("/api/events", blob);
    if (!sent) {
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify(payload),
      }).catch(() => undefined);
    }
  } catch {
    /* 이탈 측정 실패가 페이지 이탈 자체를 막으면 안 된다 */
  }
}

/**
 * Records an interaction at most once per browser session. This specifically
 * protects effect-driven events from React StrictMode and rapid repeat taps.
 */
export async function trackOnce(
  key: string,
  input: Omit<EventInput, "device"> & { device?: DeviceType },
): Promise<void> {
  const store = safeSession();
  const storageKey = `${TRACKED_KEY_PREFIX}${key}`;

  if (store?.getItem(storageKey) === "1") return;

  try {
    store?.setItem(storageKey, "1");
  } catch {
    // Server-side deduplication remains the fallback when storage is blocked.
  }

  await track(input);
}
