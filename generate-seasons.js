// node generate-seasons.js
// 실행 결과: frontend/src/data/generated-players.js 생성
const fs = require('fs');
const path = require('path');

// ── CSV 시즌명 → seasonId 매핑 ──────────────────────────
const SEASON_ID_MAP = {
  'Champions Tour 2023: LOCK//IN São Paulo': 'lock-in-sao-paulo-23',
  'Champions Tour 2023: Americas League':    'americas-league-23',
  'Champions Tour 2023: EMEA League':        'emea-league-23',
  'Champions Tour 2023: Pacific League':     'pacific-league-23',
  'Champions Tour 2023: Masters Tokyo':      'masters-tokyo-23',
  'Valorant Champions 2023':                 'champions-los-angeles-23',
  'Champions Tour 2024: Americas Kickoff':   'americas-kickoff-24',
  'Champions Tour 2024: EMEA Kickoff':       'emea-kickoff-24',
  'Champions Tour 2024: Pacific Kickoff':    'pacific-kickoff-24',
  'Champions Tour 2024: China Kickoff':      'china-kickoff-24',
  'Champions Tour 2024: Masters Madrid':     'masters-madrid-24',
  'Champions Tour 2024: Americas Stage 1':   'americas-stage1-24',
  'Champions Tour 2024: EMEA Stage 1':       'emea-stage1-24',
  'Champions Tour 2024: Pacific Stage 1':    'pacific-stage1-24',
  'Champions Tour 2024: China Stage 1':      'china-stage1-24',
  'Champions Tour 2024: Masters Shanghai':   'masters-shanghai-24',
  'Champions Tour 2024: Americas Stage 2':   'americas-stage2-24',
  'Champions Tour 2024: EMEA Stage 2':       'emea-stage2-24',
  'Champions Tour 2024: Pacific Stage 2':    'pacific-stage2-24',
  'Champions Tour 2024: China Stage 2':      'china-stage2-24',
  'Valorant Champions 2024':                 'champions-seoul-24',
  'VCT 2025: Americas Kickoff':              'americas-kickoff-25',
  'VCT 2025: EMEA Kickoff':                  'emea-kickoff-25',
  'VCT 2025: Pacific Kickoff':               'pacific-kickoff-25',
  'VCT 2025: China Kickoff':                 'china-kickoff-25',
  'Valorant Masters Bangkok 2025':           'masters-bangkok-25',
  'VCT 2025: Americas Stage 1':              'americas-stage1-25',
  'VCT 2025: EMEA Stage 1':                  'emea-stage1-25',
  'VCT 2025: Pacific Stage 1':               'pacific-stage1-25',
  'VCT 2025: China Stage 1':                 'china-stage1-25',
  'VCT 2025: Americas Stage 2':              'americas-stage2-25',
  'VCT 2025: EMEA Stage 2':                  'emea-stage2-25',
  'VCT 2025: Pacific Stage 2':               'pacific-stage2-25',
  'VCT 2025: China Stage 2':                 'china-stage2-25',
  'Valorant Masters Toronto 2025':           'masters-toronto-25',
  'Valorant Champions 2025':                 'champions-paris-25',
  'VCT 2026: Americas Kickoff':              'americas-kickoff-26',
  'VCT 2026: EMEA Kickoff':                  'emea-kickoff-26',
  'VCT 2026: Pacific Kickoff':               'pacific-kickoff-26',
  'VCT 2026: China Kickoff':                 'china-kickoff-26',
  'Valorant Masters Santiago 2026':          'masters-santiago-26',
  'VCT 2026: Americas Stage 1':              'americas-stage1-26',
  'VCT 2026: EMEA Stage 1':                  'emea-stage1-26',
  'VCT 2026: Pacific Stage 1':              'pacific-stage1-26',
  'VCT 2026: China Stage 1':                 'china-stage1-26',
};

// ── 선수 포지션 (알려진 선수 기준) ─────────────────────
const PLAYER_ROLES = {
  // DUELIST
  TenZ:'DUELIST', Aspas:'DUELIST', cNed:'DUELIST', Derke:'DUELIST',
  Rb:'DUELIST', Victor:'DUELIST', ScreaM:'DUELIST', Cryo:'DUELIST',
  Asuna:'DUELIST', Demon1:'DUELIST', Tex:'DUELIST', Genghsta:'DUELIST',
  yay:'DUELIST', Jinggg:'DUELIST', 'f0rsakeN':'DUELIST', Meteor:'DUELIST',
  CHICHOO:'DUELIST', whzy:'DUELIST', AAAAY:'DUELIST', leaf:'DUELIST',
  FengF:'DUELIST', Nicc:'DUELIST', cb:'DUELIST', Abo:'DUELIST',
  BeYN:'DUELIST', mwzera:'DUELIST', dgzin:'DUELIST', frz:'DUELIST',
  Spring:'DUELIST', Lakia:'DUELIST', jkuro:'DUELIST', Ninebody:'DUELIST',
  Rarga:'DUELIST', Genkai:'DUELIST', kamo:'DUELIST',
  // INITIATOR
  Zekken:'INITIATOR', jawgemo:'INITIATOR', Sacy:'INITIATOR',
  Less:'INITIATOR', Shao:'INITIATOR', Bang:'INITIATOR',
  Nukkye:'INITIATOR', Mistic:'INITIATOR', Sylvan:'INITIATOR',
  nobody:'INITIATOR', trent:'INITIATOR', Flashback:'INITIATOR',
  HeiB:'INITIATOR', Knight:'INITIATOR', autumn:'INITIATOR',
  Alfajer:'INITIATOR', Ethan:'INITIATOR', xand:'INITIATOR',
  'vo0kashu':'INITIATOR', 'o0o0o':'INITIATOR', K1ra:'INITIATOR',
  Yuicaw:'INITIATOR', stew:'INITIATOR', happywei:'INITIATOR',
  paTiTek:'INITIATOR', trexx:'INITIATOR', Reita:'INITIATOR',
  sh1n:'INITIATOR', Nivera:'INITIATOR', Emman:'INITIATOR',
  // FLEX
  Crashies:'FLEX', Zellsis:'FLEX', Xeta:'FLEX', Funn1k:'FLEX',
  SUYGETSU:'FLEX', BuZz:'FLEX', valyn:'FLEX', ZmjjKK:'FLEX',
  Boostio:'FLEX', SpiritZ1:'FLEX', OBONE:'FLEX', TZH:'FLEX',
  SiuFatBB:'FLEX', YoU:'FLEX', Levius:'FLEX', Life:'FLEX',
  Haodong:'FLEX', Kai:'FLEX', 'Z1Yan':'FLEX', kamyk:'FLEX',
  // SENTINEL
  Chronicle:'SENTINEL', Shyy:'SENTINEL', Klaus:'SENTINEL',
  Icy:'SENTINEL', iZu:'SENTINEL', Smoggy:'SENTINEL',
  nephh:'SENTINEL', N4RRATE:'SENTINEL', free1ng:'SENTINEL',
  Johnqt:'SENTINEL', HYUNMIN:'SENTINEL', yosemite:'SENTINEL',
  Cangshu:'SENTINEL', GuanG:'SENTINEL', Lysoar:'SENTINEL',
  XiYiJi:'SENTINEL', CoCo:'SENTINEL', coconut:'SENTINEL',
  Babyblue:'SENTINEL', '5CM':'SENTINEL', nAts:'SENTINEL',
  LuoK1ng:'SENTINEL', Kicks:'SENTINEL', JonahP:'SENTINEL',
  // CONTROLLER
  Leo:'CONTROLLER', FNS:'CONTROLLER', Marved:'CONTROLLER',
  Pancada:'CONTROLLER', Mako:'CONTROLLER', Noodlz:'CONTROLLER',
  stax:'CONTROLLER', Jieni7:'CONTROLLER', rushia:'CONTROLLER',
  Shr1mp:'CONTROLLER', Biank:'CONTROLLER', Flex1n:'CONTROLLER',
  Ezeir:'CONTROLLER', juicy:'CONTROLLER', Septem7:'CONTROLLER',
  TvirusLuke:'CONTROLLER', Viva:'CONTROLLER', Link7:'CONTROLLER',
  waituu:'CONTROLLER', S1Mon:'CONTROLLER', keiko:'CONTROLLER',
  Boaster:'CONTROLLER', Ange1:'CONTROLLER', kiNgg:'CONTROLLER',
  Redgar:'CONTROLLER', Sayf:'CONTROLLER',
};

// ── 대회별 상위 팀 (rarity 결정) ────────────────────────
// legend: 우승/준우승, rare: 3~4위 or 상위권, common: 나머지
const EVENT_TIERS = {
  // ── 2023 ──
  'lock-in-sao-paulo-23':    { legend:['LOUD','Fnatic'],                      rare:['NRG','NaVi','Evil Geniuses','Paper Rex'] },
  'americas-league-23':      { legend:['Evil Geniuses','NRG'],                 rare:['Sentinels','LOUD','100 Thieves'] },
  'emea-league-23':          { legend:['Fnatic','NaVi'],                       rare:['Team Liquid','Team Vitality','BBL Esports'] },
  'pacific-league-23':       { legend:['Paper Rex','DRX'],                     rare:['ZETA DIVISION','T1','Global Esports'] },
  'masters-tokyo-23':        { legend:['Paper Rex','Evil Geniuses'],           rare:['NRG','LOUD','Fnatic','DRX'] },
  'champions-los-angeles-23':{ legend:['Evil Geniuses','NRG'],                 rare:['LOUD','Fnatic','Paper Rex','Team Liquid'] },
  // ── 2024 ──
  'americas-kickoff-24':     { legend:['Sentinels','NRG'],                     rare:['Evil Geniuses','LOUD','100 Thieves'] },
  'emea-kickoff-24':         { legend:['Fnatic','Team Liquid'],                rare:['Team Vitality','NaVi','BBL Esports'] },
  'pacific-kickoff-24':      { legend:['T1','Paper Rex'],                      rare:['DRX','ZETA DIVISION','Gen.G'] },
  'china-kickoff-24':        { legend:['EDward Gaming','FunPlus Phoenix'],     rare:['Bilibili Gaming','Trace Esports'] },
  'masters-madrid-24':       { legend:['Team Liquid','Sentinels'],             rare:['Fnatic','NRG','Paper Rex','EDward Gaming'] },
  'americas-stage1-24':      { legend:['Sentinels','Evil Geniuses'],           rare:['NRG','LOUD','100 Thieves'] },
  'emea-stage1-24':          { legend:['Team Vitality','Fnatic'],              rare:['Team Liquid','NaVi','BBL Esports'] },
  'pacific-stage1-24':       { legend:['DRX','T1'],                            rare:['ZETA DIVISION','Paper Rex','Gen.G'] },
  'china-stage1-24':         { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix','Trace Esports'] },
  'masters-shanghai-24':     { legend:['EDward Gaming','Team Liquid'],         rare:['Sentinels','Paper Rex','Fnatic','LOUD'] },
  'americas-stage2-24':      { legend:['Sentinels','LOUD'],                    rare:['NRG','Evil Geniuses','100 Thieves'] },
  'emea-stage2-24':          { legend:['Team Vitality','Fnatic'],              rare:['Team Liquid','NaVi','BBL Esports'] },
  'pacific-stage2-24':       { legend:['DRX','ZETA DIVISION'],                 rare:['T1','Paper Rex','Gen.G'] },
  'china-stage2-24':         { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix','Trace Esports','Dragon Ranger Gaming'] },
  'champions-seoul-24':      { legend:['EDward Gaming','Sentinels'],           rare:['Team Liquid','Fnatic','LOUD','Paper Rex'] },
  // ── 2025 ──
  'americas-kickoff-25':     { legend:['Sentinels','LOUD'],                    rare:['NRG','Evil Geniuses','G2 Esports'] },
  'emea-kickoff-25':         { legend:['Team Vitality','Fnatic'],              rare:['Team Liquid','NaVi','BBL Esports'] },
  'pacific-kickoff-25':      { legend:['T1','DRX'],                            rare:['ZETA DIVISION','Paper Rex','Gen.G'] },
  'china-kickoff-25':        { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix','Trace Esports'] },
  'masters-bangkok-25':      { legend:['T1','G2 Esports'],                     rare:['EDward Gaming','Team Vitality','Sentinels','Trace Esports'] },
  'americas-stage1-25':      { legend:['Sentinels','G2 Esports'],              rare:['NRG','LOUD','Evil Geniuses'] },
  'emea-stage1-25':          { legend:['Team Vitality','Fnatic'],              rare:['Team Liquid','NaVi','BBL Esports'] },
  'pacific-stage1-25':       { legend:['T1','DRX'],                            rare:['ZETA DIVISION','Paper Rex','Gen.G'] },
  'china-stage1-25':         { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix','Trace Esports','Dragon Ranger Gaming'] },
  'americas-stage2-25':      { legend:['LOUD','Sentinels'],                    rare:['NRG','G2 Esports','Evil Geniuses'] },
  'emea-stage2-25':          { legend:['Fnatic','Team Vitality'],              rare:['Team Liquid','NaVi','BBL Esports'] },
  'pacific-stage2-25':       { legend:['T1','ZETA DIVISION'],                  rare:['DRX','Paper Rex','Gen.G'] },
  'china-stage2-25':         { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix','Trace Esports'] },
  'masters-toronto-25':      { legend:['LOUD','Fnatic'],                       rare:['T1','Sentinels','NRG','Team Vitality'] },
  'champions-paris-25':      { legend:['T1','Team Vitality'],                  rare:['Fnatic','LOUD','EDward Gaming','Sentinels'] },
  // ── 2026 ──
  'americas-kickoff-26':     { legend:['Sentinels','LOUD'],                    rare:['NRG','G2 Esports'] },
  'emea-kickoff-26':         { legend:['Team Vitality','Fnatic'],              rare:['Team Liquid','NaVi'] },
  'pacific-kickoff-26':      { legend:['T1','DRX'],                            rare:['ZETA DIVISION','Gen.G'] },
  'china-kickoff-26':        { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix','Trace Esports'] },
  'masters-santiago-26':     { legend:['T1','Sentinels'],                      rare:['LOUD','Team Vitality','EDward Gaming'] },
  'americas-stage1-26':      { legend:['Sentinels','G2 Esports'],              rare:['NRG','LOUD'] },
  'emea-stage1-26':          { legend:['Fnatic','Team Vitality'],              rare:['Team Liquid','NaVi'] },
  'pacific-stage1-26':       { legend:['T1','DRX'],                            rare:['ZETA DIVISION','Gen.G'] },
  'china-stage1-26':         { legend:['EDward Gaming','Bilibili Gaming'],     rare:['FunPlus Phoenix'] },
};

function getRarity(seasonId, team) {
  const tier = EVENT_TIERS[seasonId];
  if (!tier) return 'common';
  if (tier.legend.includes(team)) return 'legend';
  if (tier.rare.includes(team)) return 'rare';
  return 'common';
}

// 팀별 포지션 라운드로빈 (모르는 선수 대체용)
const ROLES_ORDER = ['DUELIST','INITIATOR','FLEX','SENTINEL','CONTROLLER'];
const teamRoleCounters = {};
function getRoleRoundRobin(team) {
  if (!teamRoleCounters[team]) teamRoleCounters[team] = 0;
  const role = ROLES_ORDER[teamRoleCounters[team] % 5];
  teamRoleCounters[team]++;
  return role;
}

const GRADE_TO_RANK = { A:'RADIANT', B:'IMMORTAL', C:'ASCENDANT', D:'DIAMOND' };

// ── CSV 파싱 ────────────────────────────────────────────
const csvPath = path.join(__dirname, 'valorant_global_master_roster.csv');
const raw = fs.readFileSync(csvPath, 'utf8').replace(/^﻿/, '');
const lines = raw.split('\n').slice(1).filter(l => l.trim());

const bySeasonId = {};

for (const line of lines) {
  const cols = line.split(',');
  if (cols.length < 3) continue;
  const [seasonName, team, ign, nat, csvRole, csvGrade] = cols.map(c => c.trim());
  if (!ign) continue;

  const seasonId = SEASON_ID_MAP[seasonName];
  if (!seasonId) { console.warn(`Unknown season: "${seasonName}"`); continue; }

  if (!bySeasonId[seasonId]) bySeasonId[seasonId] = [];

  const role   = csvRole   || PLAYER_ROLES[ign] || getRoleRoundRobin(team);
  const rank   = GRADE_TO_RANK[csvGrade] || '';
  const rarity = getRarity(seasonId, team);
  const id = `${seasonId.slice(0,8)}-${ign.toLowerCase().replace(/[^a-z0-9]/g,'')}`;

  bySeasonId[seasonId].push({ id, name: ign, team, role, nat: nat || 'US', rarity, rank });
}

// ── JS 파일 생성 ─────────────────────────────────────────
const outPath = path.join(__dirname, 'frontend', 'src', 'data', 'generated-players.js');
const lines_out = [
  '// AUTO-GENERATED by generate-seasons.js — do not edit directly',
  'const GP = {',
];

const seasonIds = Object.keys(bySeasonId).sort();
for (const sid of seasonIds) {
  const players = bySeasonId[sid];
  lines_out.push(`  ${JSON.stringify(sid)}: [`);
  for (const p of players) {
    lines_out.push(
      `    { id:${JSON.stringify(p.id)}, name:${JSON.stringify(p.name)}, team:${JSON.stringify(p.team)}, role:${JSON.stringify(p.role)}, nationality:${JSON.stringify(p.nat)}, rarity:${JSON.stringify(p.rarity)}, rank:${JSON.stringify(p.rank)}, image_url:'' },`
    );
  }
  lines_out.push('  ],');
}

lines_out.push('};');
lines_out.push('export default GP;');

fs.writeFileSync(outPath, lines_out.join('\n'), 'utf8');
console.log(`✓ ${outPath} 생성 완료`);
console.log(`  시즌 수: ${seasonIds.length}`);
console.log(`  총 카드 수: ${Object.values(bySeasonId).flat().length}`);
