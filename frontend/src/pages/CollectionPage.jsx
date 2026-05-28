import { useState } from 'react';
import { allPlayers, SEASON_DEFINITIONS } from '../data/seasons';
import { getCollection } from '../utils/collection';
import { calcChemistry } from '../utils/chemistry';
import PlayerCard from '../components/PlayerCard';
import TeamSlot from '../components/TeamSlot';
import './CollectionPage.css';

const RANK_ORDER = { CHAMPION: -1, RADIANT: 0, IMMORTAL: 1, ASCENDANT: 2, DIAMOND: 3 };
const ROLES      = ['DUELIST', 'INITIATOR', 'FLEX', 'SENTINEL', 'CONTROLLER'];


const CARD_W = 168, GAP = 12, STEP = CARD_W + GAP;
const centerX = i => i * STEP + CARD_W / 2;
const SVG_W   = 5 * CARD_W + 4 * GAP;
const LINE_COLOR = { team: '#f59e0b', season: '#a78bfa', nationality: '#60a5fa' };
const LINE_W     = { team: 2.5, season: 2, nationality: 1.5 };

function ChemLines({ connections }) {
  if (!connections?.length) return null;
  return (
    <svg width={SVG_W} height={56} className="chem-svg">
      {connections.map(({ from, to, type }, idx) => {
        const x1 = centerX(from), x2 = centerX(to);
        const mx = (x1 + x2) / 2;
        return (
          <path key={idx}
            d={`M${x1} 0 Q${mx} ${(to - from) * 13} ${x2} 0`}
            fill="none" stroke={LINE_COLOR[type]}
            strokeWidth={LINE_W[type]} strokeOpacity={0.7} strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

const SORTED_PLAYERS = [...allPlayers].sort(
  (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank] || a.name.localeCompare(b.name)
);

const ACTIVE_IDS     = new Set(allPlayers.map(p => p.seasonId));
const ACTIVE_SEASONS = SEASON_DEFINITIONS.filter(s => ACTIVE_IDS.has(s.id));
const YEARS          = [...new Set(ACTIVE_SEASONS.map(s => s.period.match(/(\d{4})/)?.[1]))].sort();
const SEASONS_BY_YEAR = ACTIVE_SEASONS.reduce((acc, s) => {
  const y = s.period.match(/(\d{4})/)?.[1] || '?';
  (acc[y] = acc[y] || []).push(s);
  return acc;
}, {});


/* ── 카드 래퍼 ─────────────────────────────────────── */
function ColCard({ player, count, selected, inSlot, onClick }) {
  const collected = count > 0;
  return (
    <div
      className={`col-card-wrap${collected ? '' : ' locked'}${selected ? ' selected' : ''}${inSlot ? ' in-slot' : ''}`}
      onClick={collected ? onClick : undefined}
    >
      <PlayerCard player={player} delay={0} />
      {!collected && <div className="col-silhouette" />}
      {collected && count > 1 && <div className="col-count">×{count}</div>}
      {inSlot && !selected && <div className="col-in-slot-badge">✓</div>}
    </div>
  );
}

function CollectionPage({ slots, setSlots, onBack }) {
  const [selectedYears,   setSelectedYears]   = useState(new Set()); // 빈 = 전체
  const [selectedSeasons, setSelectedSeasons] = useState(new Set());
  const [roleFilters,     setRoleFilters]     = useState(new Set()); // 빈 = 전체
  const [colFilter,       setColFilter]       = useState('collected');
  const [search,          setSearch]          = useState('');
  const [selectedCard,    setSelectedCard]    = useState(null);

  const collection = getCollection();
  const slotIds    = new Set(slots.filter(Boolean).map(s => s.id));
  const chem       = slots.some(Boolean) ? calcChemistry(slots) : null;

  /* 연도 토글 */
  function toggleYear(y) {
    setSelectedYears(prev => {
      const next = new Set(prev);
      next.has(y) ? next.delete(y) : next.add(y);
      // 해제된 연도의 시즌도 제거
      if (!next.has(y)) {
        setSelectedSeasons(ps => {
          const ns = new Set(ps);
          (SEASONS_BY_YEAR[y] || []).forEach(s => ns.delete(s.id));
          return ns;
        });
      }
      return next;
    });
  }

  /* 시즌 토글 */
  function toggleSeason(id) {
    setSelectedSeasons(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* 롤 토글 */
  function toggleRole(r) {
    setRoleFilters(prev => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  }


  /* 카드 클릭 */
  function handleCardClick(player) {
    setSelectedCard(prev => prev?.name === player.name ? null : player);
  }

  /* 슬롯 클릭 */
  function handleSlotClick(idx) {
    if (selectedCard) {
      setSlots(prev => {
        const next = [...prev];
        next[idx] = selectedCard;
        for (let i = 0; i < next.length; i++) {
          if (i !== idx && next[i]?.name === selectedCard.name) next[i] = null;
        }
        return next;
      });
      setSelectedCard(null);
    } else if (slots[idx]) {
      setSlots(prev => { const next = [...prev]; next[idx] = null; return next; });
    }
  }

  /* 필터 적용 — 매 렌더마다 직접 계산 (stale 방지) */
  const visibleSeasonIds = (() => {
    if (selectedYears.size === 0) return null;
    const ids = new Set();
    selectedYears.forEach(y => (SEASONS_BY_YEAR[y] || []).forEach(s => ids.add(s.id)));
    return ids;
  })();

  let filtered;
  if (selectedSeasons.size > 0) {
    filtered = SORTED_PLAYERS.filter(p => selectedSeasons.has(p.seasonId));
  } else if (visibleSeasonIds) {
    filtered = SORTED_PLAYERS.filter(p => visibleSeasonIds.has(p.seasonId));
  } else {
    filtered = SORTED_PLAYERS;
  }
  if (roleFilters.size > 0)     filtered = filtered.filter(p => roleFilters.has(p.role));
  if (colFilter === 'collected') filtered = filtered.filter(p => collection[p.id] > 0);
  if (colFilter === 'locked')    filtered = filtered.filter(p => !collection[p.id]);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const total    = allPlayers.length;
  const obtained = allPlayers.filter(p => collection[p.id] > 0).length;

  // 연도 선택 시 해당 연도들의 시즌 표시
  const visibleYearSeasons = selectedYears.size === 0
    ? []
    : [...selectedYears].sort().flatMap(y => SEASONS_BY_YEAR[y] || []);

  return (
    <div className="col-page" onClick={() => setSelectedCard(null)}>
      <header className="site-header">
        <div className="header-logo">
          <span className="logo-val">VAL</span>
          <span className="logo-card">CARD</span>
        </div>
        <button className="col-back-btn" onClick={onBack} type="button">← 뽑기</button>
      </header>

      <main className="col-main" onClick={e => e.stopPropagation()}>
        {/* 진행도 */}
        <div className="col-header">
          <div className="col-title-row">
            <h1 className="col-title">도감</h1>
            <span className="col-progress">{obtained} / {total}</span>
          </div>
          <div className="col-progress-bar">
            <div className="col-progress-fill" style={{ width: `${(obtained / total) * 100}%` }} />
          </div>
        </div>

        {/* 로스터 슬롯 */}
        <div className="col-roster slots-wrapper">
          <div className="role-labels">
            {ROLES.map(r => <div key={r} className="role-label">{r}</div>)}
          </div>
          <div className="cards-row">
            {ROLES.map((role, i) => (
              <TeamSlot
                key={role}
                card={slots[i]}
                role={role}
                active={!!selectedCard}
                chemLevel={chem?.playerChem[i] ?? 0}
                onClick={() => handleSlotClick(i)}
              />
            ))}
          </div>
          {chem && <ChemLines connections={chem.connections} />}
          {selectedCard && (
            <div className="col-hint">
              <span className="col-hint-name">{selectedCard.name}</span> 선택됨 — 슬롯을 클릭해 배치하세요
            </div>
          )}
        </div>

        {/* 연도 필터 (복수) */}
        <div className="col-year-tabs">
          <button
            className={`col-year-tab${selectedYears.size === 0 ? ' active' : ''}`}
            onClick={() => { setSelectedYears(new Set()); setSelectedSeasons(new Set()); }}
            type="button"
          >전체</button>
          {YEARS.map(y => (
            <button
              key={y}
              className={`col-year-tab${selectedYears.has(y) ? ' active' : ''}`}
              onClick={() => toggleYear(y)}
              type="button"
            >{y}</button>
          ))}
        </div>

        {/* 시즌 필터 (복수, 연도 선택 시만 표시) */}
        {visibleYearSeasons.length > 0 && (
          <div className="col-season-pills">
            <button
              className={`col-season-pill${visibleYearSeasons.every(s => selectedSeasons.has(s.id)) ? ' active' : ''}`}
              onClick={() => {
                const allSelected = visibleYearSeasons.every(s => selectedSeasons.has(s.id));
                setSelectedSeasons(prev => {
                  const next = new Set(prev);
                  if (allSelected) visibleYearSeasons.forEach(s => next.delete(s.id));
                  else visibleYearSeasons.forEach(s => next.add(s.id));
                  return next;
                });
              }}
              type="button"
            >전체</button>
            {visibleYearSeasons.map(s => (
              <button
                key={s.id}
                className={`col-season-pill${selectedSeasons.has(s.id) ? ' active' : ''}`}
                onClick={() => toggleSeason(s.id)}
                type="button"
              >{s.short}</button>
            ))}
          </div>
        )}

        {/* 컨트롤 */}
        <div className="col-controls">
          <div className="col-filters">
            {['all', 'collected', 'locked'].map(f => (
              <button key={f} className={`col-filter-btn${colFilter === f ? ' active' : ''}`} onClick={() => setColFilter(f)} type="button">
                {f === 'all' ? '전체' : f === 'collected' ? '보유' : '미수집'}
              </button>
            ))}
          </div>
          <div className="col-role-filters">
            {ROLES.map(r => (
              <button key={r} className={`col-filter-btn${roleFilters.has(r) ? ' active' : ''}`} onClick={() => toggleRole(r)} type="button">
                {r}
              </button>
            ))}
          </div>
          <input className="col-search" placeholder="선수 검색..." value={search} onChange={e => setSearch(e.target.value)} />
          <span className="col-count-label">{filtered.length}명</span>
        </div>

        {/* 카드 그리드 */}
        <div className="col-grid">
          {filtered.map(p => (
            <ColCard
              key={p.id}
              player={p}
              count={collection[p.id] || 0}
              selected={selectedCard?.name === p.name}
              inSlot={slotIds.has(p.id)}
              onClick={e => { e.stopPropagation(); handleCardClick(p); }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CollectionPage;
