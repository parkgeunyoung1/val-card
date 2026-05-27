// node update-csv-stats.js
// VLR.gg 9개 대회 스탯 스크래핑 → valorant_global_master_roster.csv 포지션/등급 업데이트
const fs   = require('fs');
const path = require('path');
const https = require('https');
const zlib  = require('zlib');

const CSV_PATH = path.join(__dirname, 'valorant_global_master_roster.csv');
const DELAY_MS = 1200;

// ── 대상 대회 (VLR.gg 슬러그는 리다이렉트 처리되므로 근사값 사용) ──
const EVENTS = [
  // ── 2023 ──
  { id:1188, slug:'champions-tour-2023-lock-in-sao-paulo',   csvName:'Champions Tour 2023: LOCK//IN São Paulo' },
  { id:1189, slug:'champions-tour-2023-americas-league',     csvName:'Champions Tour 2023: Americas League' },
  { id:1190, slug:'champions-tour-2023-emea-league',         csvName:'Champions Tour 2023: EMEA League' },
  { id:1191, slug:'champions-tour-2023-pacific-league',      csvName:'Champions Tour 2023: Pacific League' },
  { id:1494, slug:'champions-tour-2023-masters-tokyo',       csvName:'Champions Tour 2023: Masters Tokyo' },
  { id:1657, slug:'valorant-champions-2023',                 csvName:'Valorant Champions 2023' },
  // ── 2024 ──
  { id:1921, slug:'champions-tour-2024-masters-madrid',      csvName:'Champions Tour 2024: Masters Madrid' },
  { id:1923, slug:'champions-tour-2024-americas-kickoff',    csvName:'Champions Tour 2024: Americas Kickoff' },
  { id:1924, slug:'champions-tour-2024-pacific-kickoff',     csvName:'Champions Tour 2024: Pacific Kickoff' },
  { id:1925, slug:'champions-tour-2024-emea-kickoff',        csvName:'Champions Tour 2024: EMEA Kickoff' },
  { id:1926, slug:'champions-tour-2024-china-kickoff',       csvName:'Champions Tour 2024: China Kickoff' },
  { id:1998, slug:'champions-tour-2024-emea-stage-1',        csvName:'Champions Tour 2024: EMEA Stage 1' },
  { id:1999, slug:'champions-tour-2024-masters-shanghai',    csvName:'Champions Tour 2024: Masters Shanghai' },
  { id:2002, slug:'champions-tour-2024-pacific-stage-1',     csvName:'Champions Tour 2024: Pacific Stage 1' },
  { id:2004, slug:'champions-tour-2024-americas-stage-1',    csvName:'Champions Tour 2024: Americas Stage 1' },
  { id:2005, slug:'champions-tour-2024-pacific-stage-2',     csvName:'Champions Tour 2024: Pacific Stage 2' },
  { id:2006, slug:'champions-tour-2024-china-stage-1',       csvName:'Champions Tour 2024: China Stage 1' },
  { id:2094, slug:'champions-tour-2024-emea-stage-2',        csvName:'Champions Tour 2024: EMEA Stage 2' },
  { id:2095, slug:'champions-tour-2024-americas-stage-2',    csvName:'Champions Tour 2024: Americas Stage 2' },
  { id:2096, slug:'champions-tour-2024-china-stage-2',       csvName:'Champions Tour 2024: China Stage 2' },
  { id:2097, slug:'valorant-champions-2024',                 csvName:'Valorant Champions 2024' },
  // ── 2025 ──
  { id:2274, slug:'vct-2025-americas-kickoff',               csvName:'VCT 2025: Americas Kickoff' },
  { id:2275, slug:'vct-2025-china-kickoff',                  csvName:'VCT 2025: China Kickoff' },
  { id:2276, slug:'vct-2025-emea-kickoff',                   csvName:'VCT 2025: EMEA Kickoff' },
  { id:2277, slug:'vct-2025-pacific-kickoff',                csvName:'VCT 2025: Pacific Kickoff' },
  { id:2281, slug:'valorant-masters-bangkok-2025',           csvName:'Valorant Masters Bangkok 2025' },
  { id:2347, slug:'vct-2025-americas-stage-1',               csvName:'VCT 2025: Americas Stage 1' },
  { id:2359, slug:'vct-2025-china-stage-1',                  csvName:'VCT 2025: China Stage 1' },
  { id:2379, slug:'vct-2025-pacific-stage-1',                csvName:'VCT 2025: Pacific Stage 1' },
  { id:2380, slug:'vct-2025-emea-stage-1',                   csvName:'VCT 2025: EMEA Stage 1' },
  { id:2282, slug:'valorant-masters-toronto-2025',           csvName:'Valorant Masters Toronto 2025' },
  { id:2498, slug:'vct-2025-emea-stage-2',                   csvName:'VCT 2025: EMEA Stage 2' },
  { id:2499, slug:'vct-2025-china-stage-2',                  csvName:'VCT 2025: China Stage 2' },
  { id:2500, slug:'vct-2025-pacific-stage-2',                csvName:'VCT 2025: Pacific Stage 2' },
  { id:2501, slug:'vct-2025-americas-stage-2',               csvName:'VCT 2025: Americas Stage 2' },
  { id:2283, slug:'valorant-champions-2025',                 csvName:'Valorant Champions 2025' },
  // ── 2026 ──
  { id:2682, slug:'vct-2026-americas-kickoff',               csvName:'VCT 2026: Americas Kickoff' },
  { id:2683, slug:'vct-2026-pacific-kickoff',                csvName:'VCT 2026: Pacific Kickoff' },
  { id:2684, slug:'vct-2026-emea-kickoff',                   csvName:'VCT 2026: EMEA Kickoff' },
  { id:2685, slug:'vct-2026-china-kickoff',                  csvName:'VCT 2026: China Kickoff' },
  { id:2760, slug:'valorant-masters-santiago-2026',          csvName:'Valorant Masters Santiago 2026' },
  { id:2775, slug:'vct-2026-pacific-stage-1',                csvName:'VCT 2026: Pacific Stage 1' },
  { id:2860, slug:'vct-2026-americas-stage-1',               csvName:'VCT 2026: Americas Stage 1' },
  { id:2863, slug:'vct-2026-emea-stage-1',                   csvName:'VCT 2026: EMEA Stage 1' },
  { id:2864, slug:'vct-2026-china-stage-1',                  csvName:'VCT 2026: China Stage 1' },
];

// ── 에이전트 → 역할 분류 ──────────────────────────────────
const AGENT_ROLE = {
  jett:'DUELIST', reyna:'DUELIST', phoenix:'DUELIST', neon:'DUELIST',
  iso:'DUELIST', waylay:'DUELIST', raze:'DUELIST', yoru:'DUELIST',
  sova:'INITIATOR', breach:'INITIATOR', skye:'INITIATOR', kayo:'INITIATOR',
  fade:'INITIATOR', gekko:'INITIATOR', tejo:'INITIATOR',
  brimstone:'CONTROLLER', omen:'CONTROLLER', viper:'CONTROLLER',
  astra:'CONTROLLER', harbor:'CONTROLLER', clove:'CONTROLLER',
  sage:'SENTINEL', killjoy:'SENTINEL', cypher:'SENTINEL',
  chamber:'SENTINEL', deadlock:'SENTINEL', vyse:'SENTINEL',
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function get(url, depth = 0) {
  if (depth > 3) return Promise.reject(new Error('too many redirects'));
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({ hostname: u.hostname, path: u.pathname + u.search, headers: HEADERS }, res => {
      if ([301, 302, 303].includes(res.statusCode)) {
        res.resume();
        const loc = res.headers.location || '';
        return get(loc.startsWith('http') ? loc : 'https://www.vlr.gg' + loc, depth + 1).then(resolve).catch(reject);
      }
      const enc = res.headers['content-encoding'];
      let stream = res;
      if (enc === 'gzip')    stream = res.pipe(zlib.createGunzip());
      else if (enc === 'deflate') stream = res.pipe(zlib.createInflate());
      else if (enc === 'br') stream = res.pipe(zlib.createBrotliDecompress());
      let body = '';
      stream.on('data', c => body += c);
      stream.on('end', () => resolve({ status: res.statusCode, body }));
      stream.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── HTML 셀 텍스트 추출 ───────────────────────────────────
function cellText(td) {
  return td.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

// ── 에이전트 이름 추출 ────────────────────────────────────
function parseAgents(td) {
  const matches = [...td.matchAll(/\/agents\/([a-z]+)\.png/gi)];
  return matches.map(m => m[1].toLowerCase());
}

// ── 역할 결정 (40% 미만이면 FLEX) ────────────────────────
function determineRole(agents) {
  if (!agents.length) return 'FLEX';
  const roleCounts = {};
  for (const a of agents) {
    if (a === 'viper') {
      roleCounts['CONTROLLER'] = (roleCounts['CONTROLLER'] || 0) + 0.5;
      roleCounts['SENTINEL']   = (roleCounts['SENTINEL']   || 0) + 0.5;
    } else {
      const r = AGENT_ROLE[a] || null;
      if (r) roleCounts[r] = (roleCounts[r] || 0) + 1;
    }
  }
  const total = Object.values(roleCounts).reduce((s, v) => s + v, 0);
  if (!total) return 'FLEX';
  const sorted = Object.entries(roleCounts).sort(([, a], [, b]) => b - a);
  const [topRole, topCount] = sorted[0];
  return (topCount / total) >= 0.50 ? topRole : 'FLEX';
}

// ── VLR.gg 스탯 페이지 파싱 ──────────────────────────────
async function scrapeEvent(event) {
  const url = `https://www.vlr.gg/event/stats/${event.id}/${event.slug}`;
  console.log(`  Fetching: ${url}`);
  const { body } = await get(url);

  const tbody = body.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] || '';
  const rows  = tbody.match(/<tr[\s\S]*?<\/tr>/g) || [];

  const players = [];
  for (const row of rows) {
    const tds = row.match(/<td[\s\S]*?<\/td>/g);
    if (!tds || tds.length < 7) continue;

    // 선수 이름
    const nameMatch = tds[0].match(/class="text-of">([^<]+)</);
    if (!nameMatch) continue;
    const name = nameMatch[1].trim();

    // 팀
    const teamMatch = tds[0].match(/stats-player-country">([^<]+)</);
    const team = teamMatch ? teamMatch[1].trim() : '';

    // 에이전트 → 역할
    const agents = parseAgents(tds[1]);
    const role   = determineRole(agents);

    // 수치 파싱 (Rating, ACS, KAST)
    const rating = parseFloat(cellText(tds[3])) || 0;
    const acs    = parseFloat(cellText(tds[4])) || 0;
    const kastStr = cellText(tds[6]).replace('%', '');
    const kast   = parseFloat(kastStr) || 0;

    players.push({ name, team, role, rating, acs, kast, agents });
  }
  return players;
}

// ── 등급 계산 (퍼센타일 기반 A/B/C/D) ────────────────────
function assignGrades(allPlayers) {
  // 복합 스코어: Rating 50% + ACS 30% + KAST 20%
  const scored = allPlayers.map(p => {
    const score = p.rating * 50 + (p.acs / 10) * 30 + p.kast * 20;
    return { ...p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const n = scored.length;

  return scored.map((p, i) => {
    const pct = i / n;
    const grade = pct < 0.20 ? 'A' : pct < 0.50 ? 'B' : pct < 0.90 ? 'C' : 'D';
    return { ...p, grade };
  });
}

// ── CSV 파싱 ──────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const header = lines[0];
  const rows = lines.slice(1).map(line => {
    const cols = [];
    let inQ = false, cur = '';
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    return cols;
  });
  return { header, rows };
}

// ── 메인 ─────────────────────────────────────────────────
async function main() {
  // 1. 모든 이벤트 스크래핑
  const eventData = {};  // csvName → players[]
  const allPlayers = []; // 전체 선수 목록 (등급 계산용)

  for (const event of EVENTS) {
    console.log(`\n[${event.csvName}]`);
    try {
      const players = await scrapeEvent(event);
      eventData[event.csvName] = players;
      allPlayers.push(...players);
      console.log(`  → ${players.length}명 파싱 완료`);
    } catch (e) {
      console.log(`  → ERROR: ${e.message}`);
      eventData[event.csvName] = [];
    }
    await sleep(DELAY_MS);
  }

  // 2. 대회별 개별 등급 계산 + 역할 맵
  const eventGradeMap = {};
  const eventRoleMap  = {};

  let totalA=0, totalB=0, totalC=0, totalD=0;
  for (const [csvName, players] of Object.entries(eventData)) {
    if (!players.length) continue;
    const graded = assignGrades(players);
    for (const p of graded) {
      const key = `${csvName}|${p.name.toLowerCase()}`;
      eventGradeMap[key] = p.grade;
      eventRoleMap[key]  = p.role;
    }
    totalA += graded.filter(p=>p.grade==='A').length;
    totalB += graded.filter(p=>p.grade==='B').length;
    totalC += graded.filter(p=>p.grade==='C').length;
    totalD += graded.filter(p=>p.grade==='D').length;
  }

  const totalRecords = totalA+totalB+totalC+totalD;
  console.log(`\n총 ${totalRecords}개 선수-대회 레코드, 대회별 등급 계산 완료`);
  console.log(`A: ${totalA} / B: ${totalB} / C: ${totalC} / D: ${totalD}`);

  // 3. CSV 업데이트
  const raw = fs.readFileSync(CSV_PATH, 'utf8');
  const { header, rows } = parseCSV(raw);

  const targetSeasons = new Set(EVENTS.map(e => e.csvName));
  let updated = 0, notFound = 0;

  const newRows = rows.map(cols => {
    if (cols.length < 3) return cols;
    const season  = cols[0]?.trim();
    const nick    = cols[2]?.trim();

    if (!targetSeasons.has(season) || !nick) return cols;

    const eventKey = `${season}|${nick.toLowerCase()}`;
    const role  = eventRoleMap[eventKey]  || '';
    const grade = eventGradeMap[eventKey] || '';

    if (!role && !grade) { notFound++; return cols; }

    const newCols = [...cols];
    newCols[4] = role;   // 포지션
    newCols[5] = grade;  // 등급
    updated++;
    return newCols;
  });

  // 4. CSV 재조립 (BOM 포함)
  const bom = raw.startsWith('﻿') ? '﻿' : '';
  const output = bom + header + '\n' + newRows.map(cols => cols.join(',')).join('\n');
  fs.writeFileSync(CSV_PATH, output, 'utf8');

  console.log(`\n=== CSV 업데이트 완료 ===`);
  console.log(`업데이트: ${updated}행 / 미매칭: ${notFound}행`);
  console.log(`저장: ${CSV_PATH}`);
}

main().catch(console.error);
