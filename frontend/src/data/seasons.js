import GP from './generated-players';

const SEASON_DEFINITIONS = [
  // ── 2023 ────────────────────────────────────────────
  { id:'lock-in-sao-paulo-23',    name:'Champions Tour 2023: LOCK//IN Sao Paulo', short:"LOCK//IN '23",    period:'2023 · 2월 · 상파울루',     badge:'🔥', color:'#f97316', description:'2023 VCT 시즌 개막 국제 이벤트' },
  { id:'americas-league-23',      name:'Champions Tour 2023: Americas League',     short:"Americas '23",   period:'2023 · 3월 · 로스앤젤레스', badge:'🌎', color:'#22c55e', description:'VCT 2023 아메리카스 리그' },
  { id:'emea-league-23',          name:'Champions Tour 2023: EMEA League',         short:"EMEA '23",       period:'2023 · 3월 · 베를린',       badge:'🌍', color:'#2563eb', description:'VCT 2023 EMEA 리그' },
  { id:'pacific-league-23',       name:'Champions Tour 2023: Pacific League',      short:"Pacific '23",    period:'2023 · 3월 · 서울',         badge:'🌏', color:'#06b6d4', description:'VCT 2023 퍼시픽 리그' },
  { id:'masters-tokyo-23',        name:'Champions Tour 2023: Masters Tokyo',       short:"Tokyo '23",      period:'2023 · 6월 · 도쿄',         badge:'🎯', color:'#a855f7', description:'2023 중반 국제 마스터스 대회' },
  { id:'champions-los-angeles-23',name:'Valorant Champions 2023',                  short:"Champions '23",  period:'2023 · 8월 · 로스앤젤레스', badge:'🏆', color:'#f59e0b', description:'2023 발로란트 챔피언스' },
  // ── 2024 ────────────────────────────────────────────
  { id:'americas-kickoff-24',     name:'Champions Tour 2024: Americas Kickoff',    short:"Americas KO '24", period:'2024 · 1월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 2024 아메리카스 킥오프' },
  { id:'emea-kickoff-24',         name:'Champions Tour 2024: EMEA Kickoff',        short:"EMEA KO '24",    period:'2024 · 1월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT 2024 EMEA 킥오프' },
  { id:'pacific-kickoff-24',      name:'Champions Tour 2024: Pacific Kickoff',     short:"Pacific KO '24", period:'2024 · 1월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 2024 퍼시픽 킥오프' },
  { id:'china-kickoff-24',        name:'Champions Tour 2024: China Kickoff',       short:"China KO '24",   period:'2024 · 1월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 2024 차이나 킥오프' },
  { id:'masters-madrid-24',       name:'Champions Tour 2024: Masters Madrid',      short:"Madrid '24",     period:'2024 · 3월 · 마드리드',     badge:'🎯', color:'#a855f7', description:'2024 첫 국제 마스터스 대회' },
  { id:'americas-stage1-24',      name:'Champions Tour 2024: Americas Stage 1',    short:"Americas S1 '24", period:'2024 · 4월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 2024 아메리카스 스테이지 1' },
  { id:'emea-stage1-24',          name:'Champions Tour 2024: EMEA Stage 1',        short:"EMEA S1 '24",    period:'2024 · 4월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT 2024 EMEA 스테이지 1' },
  { id:'pacific-stage1-24',       name:'Champions Tour 2024: Pacific Stage 1',     short:"Pacific S1 '24", period:'2024 · 4월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 2024 퍼시픽 스테이지 1' },
  { id:'china-stage1-24',         name:'Champions Tour 2024: China Stage 1',       short:"China S1 '24",   period:'2024 · 4월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 2024 차이나 스테이지 1' },
  { id:'masters-shanghai-24',     name:'Champions Tour 2024: Masters Shanghai',    short:"Shanghai '24",   period:'2024 · 6월 · 상하이',       badge:'🎯', color:'#a855f7', description:'2024 두 번째 국제 마스터스 대회' },
  { id:'americas-stage2-24',      name:'Champions Tour 2024: Americas Stage 2',    short:"Americas S2 '24", period:'2024 · 7월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 2024 아메리카스 스테이지 2' },
  { id:'emea-stage2-24',          name:'Champions Tour 2024: EMEA Stage 2',        short:"EMEA S2 '24",    period:'2024 · 7월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT 2024 EMEA 스테이지 2' },
  { id:'pacific-stage2-24',       name:'Champions Tour 2024: Pacific Stage 2',     short:"Pacific S2 '24", period:'2024 · 7월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 2024 퍼시픽 스테이지 2' },
  { id:'china-stage2-24',         name:'Champions Tour 2024: China Stage 2',       short:"China S2 '24",   period:'2024 · 7월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 2024 차이나 스테이지 2' },
  { id:'champions-seoul-24',      name:'Valorant Champions 2024',                  short:"Champions '24",  period:'2024 · 8월 · 서울',         badge:'🏆', color:'#f59e0b', description:'2024 발로란트 챔피언스' },
  // ── 2025 ────────────────────────────────────────────
  { id:'americas-kickoff-25',     name:'VCT 2025 Americas Kickoff',                short:"Americas KO '25", period:'2025 · 1월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 아메리카스 킥오프 스테이지' },
  { id:'emea-kickoff-25',         name:'VCT 2025 EMEA Kickoff',                    short:"EMEA KO '25",    period:'2025 · 1월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT EMEA 킥오프 스테이지' },
  { id:'pacific-kickoff-25',      name:'VCT 2025 Pacific Kickoff',                 short:"Pacific KO '25", period:'2025 · 1월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 퍼시픽 킥오프 스테이지' },
  { id:'china-kickoff-25',        name:'VCT 2025 China Kickoff',                   short:"China KO '25",   period:'2025 · 1월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 차이나 킥오프 스테이지' },
  { id:'masters-bangkok-25',      name:'VCT 2025 Masters Bangkok',                 short:"Bangkok '25",    period:'2025 · 2월 · 방콕',         badge:'🎯', color:'#a855f7', description:'시즌 첫 국제 마스터스 대회' },
  { id:'americas-stage1-25',      name:'VCT 2025 Americas Stage 1',                short:"Americas S1 '25", period:'2025 · 3월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 아메리카스 권역 리그 1스테이지' },
  { id:'emea-stage1-25',          name:'VCT 2025 EMEA Stage 1',                    short:"EMEA S1 '25",    period:'2025 · 3월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT EMEA 권역 리그 1스테이지' },
  { id:'pacific-stage1-25',       name:'VCT 2025 Pacific Stage 1',                 short:"Pacific S1 '25", period:'2025 · 3월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 퍼시픽 권역 리그 1스테이지' },
  { id:'china-stage1-25',         name:'VCT 2025 China Stage 1',                   short:"China S1 '25",   period:'2025 · 3월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 차이나 권역 리그 1스테이지' },
  { id:'americas-stage2-25',      name:'VCT 2025 Americas Stage 2',                short:"Americas S2 '25", period:'2025 · 5월 · 로스앤젤레스', badge:'🌎', color:'#22c55e', description:'VCT 아메리카스 권역 리그 2스테이지' },
  { id:'emea-stage2-25',          name:'VCT 2025 EMEA Stage 2',                    short:"EMEA S2 '25",    period:'2025 · 5월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT EMEA 권역 리그 2스테이지' },
  { id:'pacific-stage2-25',       name:'VCT 2025 Pacific Stage 2',                 short:"Pacific S2 '25", period:'2025 · 5월 · 서울',         badge:'🌏', color:'#06b6d4', description:'VCT 퍼시픽 권역 리그 2스테이지' },
  { id:'china-stage2-25',         name:'VCT 2025 China Stage 2',                   short:"China S2 '25",   period:'2025 · 5월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 차이나 권역 리그 2스테이지' },
  { id:'masters-toronto-25',      name:'VCT 2025 Masters Toronto',                 short:"Toronto '25",    period:'2025 · 6월 · 토론토',       badge:'🎯', color:'#a855f7', description:'시즌 두 번째 국제 마스터스 대회' },
  { id:'champions-paris-25',      name:'Valorant Champions 2025',                  short:"Champions '25",  period:'2025 · 8월 · 파리',         badge:'🏆', color:'#f59e0b', description:'전 권역 최강팀 16개가 격돌하는 연간 최대 국제대회' },
  // ── 2026 ────────────────────────────────────────────
  { id:'americas-kickoff-26',     name:'VCT 2026 Americas Kickoff',                short:"Americas KO '26", period:'2026 · 1월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 2026 아메리카스 킥오프' },
  { id:'emea-kickoff-26',         name:'VCT 2026 EMEA Kickoff',                    short:"EMEA KO '26",    period:'2026 · 1월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT 2026 EMEA 킥오프' },
  { id:'pacific-kickoff-26',      name:'VCT 2026 Pacific Kickoff',                 short:"Pacific KO '26", period:'2026 · 1월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 2026 퍼시픽 킥오프' },
  { id:'china-kickoff-26',        name:'VCT 2026 China Kickoff',                   short:"China KO '26",   period:'2026 · 1월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 2026 차이나 킥오프' },
  { id:'masters-santiago-26',     name:'Valorant Masters Santiago 2026',           short:"Santiago '26",   period:'2026 · 3월 · 산티아고',     badge:'🎯', color:'#a855f7', description:'2026 첫 국제 마스터스 대회' },
  { id:'americas-stage1-26',      name:'VCT 2026 Americas Stage 1',                short:"Americas S1 '26", period:'2026 · 4월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 2026 아메리카스 스테이지 1' },
  { id:'emea-stage1-26',          name:'VCT 2026 EMEA Stage 1',                    short:"EMEA S1 '26",    period:'2026 · 4월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT 2026 EMEA 스테이지 1' },
  { id:'pacific-stage1-26',       name:'VCT 2026 Pacific Stage 1',                 short:"Pacific S1 '26", period:'2026 · 4월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 2026 퍼시픽 스테이지 1' },
  { id:'china-stage1-26',         name:'VCT 2026 China Stage 1',                   short:"China S1 '26",   period:'2026 · 4월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 2026 차이나 스테이지 1' },
  { id:'americas-stage2-26',      name:'VCT 2026 Americas Stage 2',                short:"Americas S2 '26", period:'2026 · 7월 · 아메리카스',  badge:'🌎', color:'#22c55e', description:'VCT 2026 아메리카스 스테이지 2' },
  { id:'emea-stage2-26',          name:'VCT 2026 EMEA Stage 2',                    short:"EMEA S2 '26",    period:'2026 · 7월 · EMEA',         badge:'🌍', color:'#2563eb', description:'VCT 2026 EMEA 스테이지 2' },
  { id:'pacific-stage2-26',       name:'VCT 2026 Pacific Stage 2',                 short:"Pacific S2 '26", period:'2026 · 7월 · 퍼시픽',       badge:'🌏', color:'#06b6d4', description:'VCT 2026 퍼시픽 스테이지 2' },
  { id:'china-stage2-26',         name:'VCT 2026 China Stage 2',                   short:"China S2 '26",   period:'2026 · 7월 · 중국',         badge:'🐉', color:'#ef4444', description:'VCT 2026 차이나 스테이지 2' },
  { id:'masters-london-26',       name:'Valorant Masters London 2026',             short:"London '26",     period:'2026 · 6월 · 런던',         badge:'🎯', color:'#a855f7', description:'2026 두 번째 국제 마스터스 대회' },
  { id:'champions-26',            name:'Valorant Champions 2026',                  short:"Champions '26",  period:'2026 · 9월 · 미정',         badge:'🏆', color:'#f59e0b', description:'2026 발로란트 챔피언스' },
];

function attachMeta(players, meta) {
  return players.map(p => ({
    ...p,
    seasonId:    meta.id,
    seasonLabel: meta.short,
    seasonBadge: meta.badge,
    seasonColor: meta.color,
  }));
}

const seasons = SEASON_DEFINITIONS.map((meta) => ({
  ...meta,
  players: attachMeta(GP[meta.id] || [], meta),
}));

export { SEASON_DEFINITIONS };
export const allPlayers = seasons.flatMap((season) => season.players);

export default seasons;
