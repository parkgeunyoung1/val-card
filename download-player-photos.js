// node download-player-photos.js   (프로젝트 루트에서 실행)
const fs    = require('fs');
const path  = require('path');
const https = require('https');
const zlib  = require('zlib');

const CSV_PATH    = path.join(__dirname, 'valorant_global_master_roster.csv');
const OUTPUT_DIR  = path.join(__dirname, 'frontend/public/photos/players');
const MAPPING_OUT = path.join(__dirname, 'frontend/src/data/player-photos.js');
const DELAY_MS    = 600;   // Liquipedia API 요청 간격
const MIN_BYTES   = 3000;

const API_HEADERS = {
  'User-Agent':      'VALCARD-FanProject/1.0 (rmsdud3847@gmail.com)',
  'Accept':          'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const IMG_HEADERS = {
  'User-Agent':      'VALCARD-FanProject/1.0 (rmsdud3847@gmail.com)',
  'Accept':          'image/*,*/*;q=0.8',
  'Accept-Encoding': 'identity',
  'Referer':         'https://liquipedia.net/',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── CSV 파싱 ──────────────────────────────────────────
function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = [];
    let inQ = false, cur = '';
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    vals.push(cur.trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
  });
}

// ── HTTP GET (리다이렉트 지원, 압축 처리) ────────────
function get(url, binary = false, customHeaders = API_HEADERS, depth = 0) {
  if (depth > 5) return Promise.reject(new Error('too many redirects'));
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get(
      { hostname: u.hostname, path: u.pathname + u.search, headers: customHeaders },
      res => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
          res.resume();
          const loc = res.headers.location || '';
          const next = loc.startsWith('http') ? loc : `https://liquipedia.net${loc}`;
          return get(next, binary, customHeaders, depth + 1).then(resolve).catch(reject);
        }
        const enc = res.headers['content-encoding'];
        if (binary) {
          let stream = res;
          if (enc === 'gzip')    stream = res.pipe(zlib.createGunzip());
          else if (enc === 'deflate') stream = res.pipe(zlib.createInflate());
          else if (enc === 'br') stream = res.pipe(zlib.createBrotliDecompress());
          const chunks = [];
          stream.on('data', c => chunks.push(c));
          stream.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
          stream.on('error', reject);
        } else {
          let stream = res;
          if (enc === 'gzip')    stream = res.pipe(zlib.createGunzip());
          else if (enc === 'deflate') stream = res.pipe(zlib.createInflate());
          else if (enc === 'br') stream = res.pipe(zlib.createBrotliDecompress());
          let body = '';
          stream.on('data', c => body += c);
          stream.on('end', () => resolve({ status: res.statusCode, body }));
          stream.on('error', reject);
        }
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── 이미지 파일명 필터 ────────────────────────────────
const SKIP_MODE  = /allmode|lightmode|darkmode/i;
const SKIP_NAMES = /No_?image|NoImage|Question_mark|Silhouette|placeholder|Unknown|Flag_|icon|logo|std\.png|hd\.png|Infobox/i;
const IS_PLAYER_PHOTO = /\.(jpg|jpeg|png)$/i;

// ── Liquipedia API: 선수 페이지 이미지 목록 조회 ──────
async function fetchPlayerImages(nickname) {
  const enc = encodeURIComponent(nickname);
  const apiUrl = `https://liquipedia.net/valorant/api.php?action=query&titles=${enc}&prop=images&imlimit=50&format=json&formatversion=2&redirects=1`;
  const { status, body } = await get(apiUrl);
  if (status !== 200) return [];
  const data = JSON.parse(body);
  const page = data.query?.pages?.[0];
  if (!page || page.missing) return [];
  return page.images || [];
}

// ── 이미지 파일 URL 조회 ──────────────────────────────
async function fetchImageUrl(fileTitle) {
  const enc = encodeURIComponent(fileTitle);
  const apiUrl = `https://liquipedia.net/valorant/api.php?action=query&titles=${enc}&prop=imageinfo&iiprop=url&format=json&formatversion=2`;
  const { status, body } = await get(apiUrl);
  if (status !== 200) return null;
  const data = JSON.parse(body);
  const page = data.query?.pages?.[0];
  return page?.imageinfo?.[0]?.url || null;
}

// ── 최적 선수 사진 선택 ───────────────────────────────
function pickBestPhoto(images, nickname) {
  const nick = nickname.toLowerCase();
  // 필터: 아이콘/로고/모드 이미지 제외, 이미지 파일만
  const candidates = images.filter(img => {
    const t = img.title;
    if (!IS_PLAYER_PHOTO.test(t)) return false;
    if (SKIP_MODE.test(t) || SKIP_NAMES.test(t)) return false;
    return true;
  });
  if (!candidates.length) return null;
  // 1순위: 닉네임 포함
  const byName = candidates.filter(c => c.title.toLowerCase().includes(nick));
  return (byName.length ? byName[byName.length - 1] : candidates[candidates.length - 1]).title;
}

// ── 파일 다운로드 ─────────────────────────────────────
async function downloadFile(url, dest) {
  const res = await get(url, true, IMG_HEADERS);
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  if (res.body.length < MIN_BYTES) throw new Error(`too small (${res.body.length}B)`);
  fs.writeFileSync(dest, res.body);
  return res.body.length;
}

// ── 메인 ─────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const rows  = parseCSV(fs.readFileSync(CSV_PATH, 'utf8'));
  const names = [...new Set(rows.map(r => r['닉네임']).filter(Boolean))];
  const total = names.length;

  console.log(`선수 ${total}명 처리 시작 (예상 ${Math.ceil(total * DELAY_MS * 2 / 60000)}분)\n`);

  const mapping = {};
  if (fs.existsSync(MAPPING_OUT)) {
    const prev = fs.readFileSync(MAPPING_OUT, 'utf8');
    for (const [, k, v] of prev.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) mapping[k] = v;
  }

  let ok = 0, skip = 0, noPhoto = 0, fail = 0;

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const dest = path.join(OUTPUT_DIR, `${name}.png`);
    const tag  = `[${String(i + 1).padStart(3)}/${total}]`;

    if (fs.existsSync(dest)) {
      mapping[name] = `/photos/players/${name}.png`;
      skip++;
      console.log(`  ${tag} SKIP     ${name}`);
      continue;
    }

    try {
      // 1. 선수 페이지의 이미지 목록 조회
      const images = await fetchPlayerImages(name);
      await sleep(300);

      // 2. 최적 사진 선택
      const bestTitle = pickBestPhoto(images, name);
      if (!bestTitle) {
        console.log(`  ${tag} NO_PHOTO ${name}`);
        noPhoto++;
        await sleep(DELAY_MS);
        continue;
      }

      // 3. 이미지 URL 조회
      const imgUrl = await fetchImageUrl(bestTitle);
      await sleep(300);

      if (!imgUrl) {
        console.log(`  ${tag} NO_URL   ${name} (${bestTitle})`);
        noPhoto++;
        await sleep(DELAY_MS);
        continue;
      }

      // 4. 다운로드
      const bytes = await downloadFile(imgUrl, dest);
      mapping[name] = `/photos/players/${name}.png`;
      console.log(`  ${tag} OK       ${name} (${(bytes/1024).toFixed(0)}KB)`);
      ok++;

    } catch (e) {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.log(`  ${tag} FAIL     ${name} — ${e.message}`);
      fail++;
    }

    if ((i + 1) % 50 === 0) saveMappingFile(mapping);
    await sleep(DELAY_MS);
  }

  saveMappingFile(mapping);
  console.log(`\n=== 완료: OK ${ok} / SKIP ${skip} / NO_PHOTO ${noPhoto} / FAIL ${fail} ===`);
  console.log(`매핑 파일 저장: ${MAPPING_OUT}`);
}

function saveMappingFile(mapping) {
  const entries = Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');
  fs.writeFileSync(
    MAPPING_OUT,
    `// 자동 생성 — node download-player-photos.js\nconst PLAYER_PHOTOS = {\n${entries}\n};\nexport default PLAYER_PHOTOS;\n`,
    'utf8'
  );
}

main().catch(console.error);
