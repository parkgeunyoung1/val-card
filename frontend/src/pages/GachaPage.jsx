import { useState, useRef } from 'react';
import { pull, pullOne } from '../utils/gacha';
import { calcChemistry } from '../utils/chemistry';
import PlayerCard from '../components/PlayerCard';
import LegendReveal from '../components/LegendReveal';
import './GachaPage.css';

const ROLES = ['DUELIST', 'INITIATOR', 'FLEX', 'SENTINEL', 'CONTROLLER'];
const CARD_W = 168, GAP = 12, STEP = CARD_W + GAP;
const centerX = i => i * STEP + CARD_W / 2;
const SVG_W = 5 * CARD_W + 4 * GAP;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const LINE_COLOR = { team: '#f59e0b', nationality: '#60a5fa', region: '#475569' };
const LINE_W     = { team: 2.5,       nationality: 2,         region: 1.5 };

const GRADE_COLOR = { S:'#f59e0b', A:'#a78bfa', B:'#60a5fa', C:'#94a3b8', D:'#475569' };

/* ── SVG 연결선 ──────────────────────────────────── */
function ChemLines({ connections }) {
  if (!connections?.length) return null;
  return (
    <svg width={SVG_W} height={56} className="chem-svg">
      {connections.map(({ from, to, type }, idx) => {
        const x1 = centerX(from), x2 = centerX(to);
        const mx = (x1 + x2) / 2;
        const depth = (to - from) * 13;
        return (
          <path
            key={idx}
            d={`M${x1} 0 Q${mx} ${depth} ${x2} 0`}
            fill="none"
            stroke={LINE_COLOR[type]}
            strokeWidth={LINE_W[type]}
            strokeOpacity={0.7}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* ── 케미스트리 점수 + 뱃지 ──────────────────────── */
function ChemPanel({ chem }) {
  const { total, grade, badges } = chem;
  const gradeColor = GRADE_COLOR[grade] || '#fff';

  return (
    <div className="chem-panel">
      <div className="chem-score">
        <span className="chem-total">{total}</span>
        <span className="chem-max">/ 15</span>
        <span className="chem-bar-wrap">
          <span className="chem-bar-fill" style={{ width: `${(total / 15) * 100}%` }} />
        </span>
        <span className="chem-grade" style={{ color: gradeColor }}>{grade}</span>
      </div>
      {badges.length > 0 && (
        <div className="chem-badges">
          {badges.map((b, i) => (
            <span key={i} className={`chem-badge type-${b.type}`}>
              {b.icon} {b.label} ×{b.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 빈 슬롯 ─────────────────────────────────────── */
function EmptySlot({ role, onClick, disabled }) {
  return (
    <div className={`empty-slot${disabled ? ' disabled' : ''}`} onClick={disabled ? undefined : onClick}>
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />
      <div className="slot-question">?</div>
      <div className="slot-role">{role}</div>
      <div className="slot-cta">클릭하여 뽑기</div>
    </div>
  );
}

/* ── 채워진 슬롯 ─────────────────────────────────── */
function FilledSlot({ card, chemLevel, onClick, disabled }) {
  return (
    <div className={`filled-slot${disabled ? ' disabled' : ''}`} onClick={disabled ? undefined : onClick}>
      <PlayerCard player={card} delay={0} chemLevel={chemLevel} />
      <div className="reroll-overlay">
        <span className="reroll-icon">🔄</span>
        <span className="reroll-text">다시 뽑기</span>
      </div>
    </div>
  );
}

/* ── 메인 ────────────────────────────────────────── */
function GachaPage() {
  const [slots, setSlots]           = useState(Array(5).fill(null));
  const [revealCard, setRevealCard] = useState(null);
  const [busy, setBusy]             = useState(false);
  const resolveRef                  = useRef(null);

  const chem     = slots.some(Boolean) ? calcChemistry(slots) : null;
  const allFilled = slots.every(Boolean);

  function onRevealComplete() {
    resolveRef.current?.();
    resolveRef.current = null;
  }

  async function doReveal(card, index) {
    if (card.rarity === 'legend') {
      setRevealCard(card);
      await new Promise(resolve => { resolveRef.current = resolve; });
      setRevealCard(null);
      await sleep(180);
    }
    setSlots(prev => { const s = [...prev]; s[index] = card; return s; });
    await sleep(200);
  }

  async function handleSlotClick(index) {
    if (busy) return;
    setBusy(true);
    await doReveal(pullOne(ROLES[index]), index);
    setBusy(false);
  }

  async function handlePullAll() {
    if (busy) return;
    setBusy(true);
    setSlots(Array(5).fill(null));
    const cards = pull();
    for (let i = 0; i < cards.length; i++) await doReveal(cards[i], i);
    setBusy(false);
  }

  return (
    <div className="gacha-page">
      {revealCard && <LegendReveal player={revealCard} onComplete={onRevealComplete} />}

      <header className="site-header">
        <div className="header-logo">
          <span className="logo-val">VAL</span>
          <span className="logo-card">CARD</span>
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">확률 정보</a>
          <a href="#" className="nav-link">선수 목록</a>
        </nav>
      </header>

      <main className="gacha-main">
        <div className="hero-text">
          <h1>Build Your Dream<br /><span className="accent">Valorant</span> Team</h1>
          <p>포지션 카드를 클릭하여 선수를 뽑거나, 전체 뽑기를 사용하세요</p>
        </div>

        <div className="slots-wrapper">
          <div className="role-labels">
            {ROLES.map(r => <div key={r} className="role-label">{r}</div>)}
          </div>

          <div className="cards-row">
            {ROLES.map((role, i) =>
              slots[i]
                ? <FilledSlot
                    key={role}
                    card={slots[i]}
                    chemLevel={chem?.playerChem[i] ?? 0}
                    onClick={() => handleSlotClick(i)}
                    disabled={busy}
                  />
                : <EmptySlot
                    key={role}
                    role={role}
                    onClick={() => handleSlotClick(i)}
                    disabled={busy}
                  />
            )}
          </div>

          {/* ── 케미스트리 연결선 ── */}
          {chem && <ChemLines connections={chem.connections} />}

          {/* ── 케미스트리 점수 + 뱃지 ── */}
          {allFilled && chem && <ChemPanel chem={chem} />}
        </div>

        <div className="pull-actions">
          <button
            className={`btn-summon${busy ? ' loading' : ''}`}
            onClick={handlePullAll}
            disabled={busy}
          >
            <span className="btn-icon">⚡</span>
            {busy ? 'SUMMONING...' : 'SUMMON ALL'}
          </button>
          {allFilled && !busy && (
            <button className="btn-reset" onClick={handlePullAll}>전체 다시 뽑기</button>
          )}
        </div>

        <div className="rate-info">
          <span className="rate legend">Legend 25%</span>
          <span className="rate-dot" />
          <span className="rate rare">Rare 45%</span>
          <span className="rate-dot" />
          <span className="rate common">Common 30%</span>
        </div>
      </main>
    </div>
  );
}

export default GachaPage;
