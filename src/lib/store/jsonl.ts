import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import type {
  InterviewConsent,
  SurveyResponse,
  TrackedEvent,
} from "@/lib/types";
import type { StorageAdapter } from "./index";

const DATA_DIR = path.join(process.cwd(), ".data");

const FILES = {
  events: path.join(DATA_DIR, "events.jsonl"),
  surveys: path.join(DATA_DIR, "surveys.jsonl"),
  consents: path.join(DATA_DIR, "consents.jsonl"),
} as const;

/**
 * 한 줄에 레코드 하나씩 덧붙이는(append-only) JSONL 저장.
 *
 * JSON 배열 파일을 매번 다시 쓰는 방식은 동시 요청이 겹칠 때 서로의 쓰기를
 * 덮어쓸 수 있다. 광고 트래픽이 몰리는 순간이 정확히 그 상황이라, 덧붙이기만
 * 하는 형식을 택했다.
 */
async function append(file: string, record: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
}

async function readAll<T>(file: string): Promise<T[]> {
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    // 아직 한 건도 수집되지 않은 상태
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const records: T[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed) as T);
    } catch {
      // 쓰다 만 줄 하나 때문에 전체 집계가 멈추지는 않게 한다
      continue;
    }
  }
  return records;
}

export const jsonlAdapter: StorageAdapter = {
  appendEvent: (event) => append(FILES.events, event),
  readEvents: () => readAll<TrackedEvent>(FILES.events),

  async saveSurvey(response) {
    await append(FILES.surveys, response);
    return response.id;
  },
  readSurveys: () => readAll<SurveyResponse>(FILES.surveys),
  async findSurveyForConsent(surveyId, sessionId) {
    return (await readAll<SurveyResponse>(FILES.surveys)).find(
      (survey) => survey.id === surveyId && survey.sessionId === sessionId,
    ) ?? null;
  },

  async saveConsent(consent) {
    await append(FILES.consents, consent);
    return true;
  },
  readConsents: () => readAll<InterviewConsent>(FILES.consents),

  // JSONL is deliberately append-only for local development. Privacy deletion
  // must run against the production Supabase store; do not silently claim a
  // local file was erased when raw records still exist on disk.
  deleteParticipant: async () => {
    throw new Error("Participant deletion requires the Supabase production adapter");
  },
  purgeBefore: async () => {
    throw new Error("Retention purge requires the Supabase production adapter");
  },
};
