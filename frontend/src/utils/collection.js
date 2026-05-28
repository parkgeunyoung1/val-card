const KEY_COLLECTION  = 'valcard_collection';
const KEY_TOKENS      = 'valcard_tokens';
const KEY_REFILL      = 'valcard_refill_time';
const KEY_FIRST_DONE  = 'valcard_first_done';

export const MAX_TOKENS = 10;
const REFILL_AMOUNT   = 10;
const REFILL_MS       = 30 * 1000; // 30초
export const PULL_COST       = 10;  // 일반 뽑기
export const FIRST_PULL_COST = 20;  // 초회 뽑기
export const FIRST_PULL_COUNT = 20;
export const PULL_COUNT       = 10;

export function isFirstPull() {
  return !localStorage.getItem(KEY_FIRST_DONE);
}
export function markFirstPullDone() {
  localStorage.setItem(KEY_FIRST_DONE, '1');
}

function loadRaw() {
  try {
    const storedTokens = localStorage.getItem(KEY_TOKENS);
    const firstDone = !!localStorage.getItem(KEY_FIRST_DONE);
    const defaultTokens = firstDone ? MAX_TOKENS : FIRST_PULL_COST;
    return {
      collection:  JSON.parse(localStorage.getItem(KEY_COLLECTION) || '{}'),
      tokens:      storedTokens === null ? defaultTokens : Number(storedTokens),
      refillTime:  Number(localStorage.getItem(KEY_REFILL)  || Date.now()),
    };
  } catch {
    return { collection: {}, tokens: MAX_TOKENS, refillTime: Date.now() };
  }
}

// 경과 시간만큼 충전 계산 후 저장
export function getTokens() {
  const { tokens, refillTime } = loadRaw();
  const now = Date.now();
  const intervals = Math.floor((now - refillTime) / REFILL_MS);
  if (intervals <= 0) return tokens;

  const newTokens = Math.min(MAX_TOKENS, tokens + intervals * REFILL_AMOUNT);
  const newRefill = refillTime + intervals * REFILL_MS;
  localStorage.setItem(KEY_TOKENS, newTokens);
  localStorage.setItem(KEY_REFILL, newRefill);
  return newTokens;
}

// 다음 충전까지 남은 ms
export function msUntilNextRefill() {
  const { refillTime } = loadRaw();
  const now = Date.now();
  const intervals = Math.floor((now - refillTime) / REFILL_MS);
  const nextRefill = refillTime + (intervals + 1) * REFILL_MS;
  return Math.max(0, nextRefill - now);
}

export function spendTokens(cost = PULL_COST) {
  const tokens = getTokens();
  if (tokens < cost) return false;
  localStorage.setItem(KEY_TOKENS, tokens - cost);
  if (!localStorage.getItem(KEY_REFILL)) {
    localStorage.setItem(KEY_REFILL, Date.now());
  }
  return true;
}

export function getCollection() {
  return loadRaw().collection;
}

export function addToCollection(cards) {
  const col = loadRaw().collection;
  for (const card of cards) {
    if (!card) continue;
    if (!col[card.id]) col[card.id] = 1;
  }
  localStorage.setItem(KEY_COLLECTION, JSON.stringify(col));
}
