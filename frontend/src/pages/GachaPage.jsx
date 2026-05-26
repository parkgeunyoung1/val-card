import { useState, useRef } from 'react';
import { pull10 } from '../utils/gacha';
import { calcChemistry } from '../utils/chemistry';
import PlayerCard from '../components/PlayerCard';
import LegendReveal from '../components/LegendReveal';
import './GachaPage.css';

const ROLES = ['DUELIST', 'INITIATOR', 'FLEX', 'SENTINEL', 'CONTROLLER'];
const CARD_W = 168, GAP = 12, STEP = CARD_W + GAP;
const centerX = i => i * STEP + CARD_W / 2;
const SVG_W = 5 * CARD_W + 4 * GAP;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const LINE_COLOR  = { team: '#f59e0b', nationality: '#60a5fa', region: '#475569' };
const LINE_W      = { team: 2.5, nationality: 2, region: 1.5 };
const GRADE_COLOR = { S:'#f59e0b', A:'#a78bfa', B:'#60a5fa', C:'#94a3b8', D:'#475569' };

/* ── Chemistry ───────────────────────────────────── */
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

function ChemPanel({ chem }) {
  const { total, grade, badges } = chem;
  return (
    <div className="chem-panel">
      <div className="chem-score">
        <span className="chem-total">{total}</span>
        <span className="chem-max">/ 15</span>
        <span className="chem-bar-wrap">
          <span className="chem-bar-fill" style={{ width: `${(total / 15) * 100}%` }} />
        </span>
        <span className="chem-grade" style={{ color: GRADE_COLOR[grade] || '#fff' }}>{grade}</span>
      </div>
      {badges.length > 0 && (
        <div className="chem-badges">
          {badges.map((b, i) => (
            <span key={i} className={`chem-badge type-${b.type}`}>{b.icon} {b.label} ×{b.count}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 팀 슬롯 ─────────────────────────────────────── */
function TeamSlot({ card, role, active, chemLevel, onClick }) {
  if (card) {
    return (
      <div className="filled-slot" onClick={onClick}>
        <PlayerCard player={card} delay={0} chemLevel={chemLevel} />
        <div className="slot-return-overlay">
          <span className="reroll-icon">↩</span>
          <span className="reroll-text">패로 돌리기</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`empty-slot${active ? ' active' : ''}`} onClick={onClick}>
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />
      <div className="slot-question">?</div>
      <div className="slot-role">{role}</div>
      {active && <div className="slot-cta">여기에 배치</div>}
    </div>
  );
}

/* ── 카드 뒷면 ───────────────────────────────────── */
function CardBack() {
  return (
    <div className="card-back">
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />
      <div className="card-back-logo">
        <span className="cbl-val">VAL</span>
        <span className="cbl-card">CARD</span>
      </div>
      <div className="card-back-hint">TAP</div>
    </div>
  );
}

/* ── 중앙 공개 오버레이 ───────────────────────────── */
function CenterReveal({ current, total, flipped, busy, onFlip, onNext }) {
  const index = total - current; // 몇 번째 카드인지

  function handleClick(e) {
    e.stopPropagation();
    if (busy) return;
    if (!flipped) onFlip();
    else onNext();
  }

  return (
    <div className="cr-overlay" onClick={handleClick}>
      {/* 진행 표시 */}
      <div className="cr-progress" onClick={e => e.stopPropagation()}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`cr-dot${i < index ? ' done' : i === index ? ' current' : ''}`} />
        ))}
      </div>

      {/* 카드 */}
      <div className="cr-card-wrap">
        <div className={`cr-card-inner${flipped ? ' flipped' : ''}`}>
          <div className="cr-face cr-back"><CardBack /></div>
          <div className="cr-face cr-front">
            <PlayerCard player={flipped ? current : current} delay={0} />
          </div>
        </div>
      </div>

      {/* 힌트 */}
      <div className="cr-hint">
        {busy ? '' : flipped ? '클릭하여 다음' : '클릭하여 공개'}
      </div>
    </div>
  );
}

/* ── 손패 카드 ───────────────────────────────────── */
function HandCard({ item, selected, onSelect }) {
  return (
    <div
      className={`hand-card-wrap${selected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <PlayerCard player={item.card} delay={0} />
    </div>
  );
}

/* ── 메인 ────────────────────────────────────────── */
function GachaPage() {
  // 중앙 공개 관련
  const [queue,      setQueue]      = useState([]);
  const [current,    setCurrent]    = useState(null);
  const [flipped,    setFlipped]    = useState(false);
  const [total,      setTotal]      = useState(0);
  const [revealKey,  setRevealKey]  = useState(0); // 카드마다 다른 key → 새 마운트

  // 손패 & 슬롯
  const [hand,        setHand]        = useState([]);
  const [slots,       setSlots]       = useState(Array(5).fill(null));
  const [selectedIdx, setSelectedIdx] = useState(null);

  // 연출
  const [revealCard, setRevealCard] = useState(null);
  const [busy,       setBusy]       = useState(false);
  const resolveRef = useRef(null);

  const chem      = slots.some(Boolean) ? calcChemistry(slots) : null;
  const allFilled = slots.every(Boolean);
  const dealing   = current !== null;

  function onRevealComplete() {
    resolveRef.current?.();
    resolveRef.current = null;
  }

  /* 뽑기 */
  function handlePull() {
    if (dealing || busy) return;
    const cards = pull10();
    setHand([]);
    setSlots(Array(5).fill(null));
    setSelectedIdx(null);
    setTotal(cards.length);
    setQueue(cards.slice(1));
    setCurrent(cards[0]);
    setFlipped(false);
    setRevealKey(0);
  }

  /* 뒤집기 */
  async function handleFlip() {
    if (busy || flipped) return;
    const card = current;
    if (card.rarity === 'legend') {
      setBusy(true);
      setRevealCard(card);
      await new Promise(resolve => { resolveRef.current = resolve; });
      setRevealCard(null);
      await sleep(200);
      setBusy(false);
    }
    setFlipped(true);
  }

  /* 다음 카드 */
  function handleNext() {
    if (busy || !flipped) return;
    setHand(prev => [...prev, { card: current }]);
    setRevealKey(k => k + 1);
    if (queue.length > 0) {
      setCurrent(queue[0]);
      setQueue(q => q.slice(1));
      setFlipped(false);
    } else {
      setCurrent(null);
      setQueue([]);
      setFlipped(false);
    }
  }

  /* 손패 카드 선택 */
  function handleSelect(idx) {
    if (dealing || busy) return;
    setSelectedIdx(prev => prev === idx ? null : idx);
  }

  /* 슬롯 클릭 */
  function handleSlotClick(slotIdx) {
    if (dealing || busy) return;
    if (selectedIdx !== null) {
      const card = hand[selectedIdx].card;
      const prev = slots[slotIdx];
      const newHand = hand.filter((_, i) => i !== selectedIdx);
      if (prev) newHand.push({ card: prev });
      const newSlots = [...slots];
      newSlots[slotIdx] = card;
      setHand(newHand);
      setSlots(newSlots);
      setSelectedIdx(null);
    } else if (slots[slotIdx]) {
      const card = slots[slotIdx];
      const newSlots = [...slots];
      newSlots[slotIdx] = null;
      setSlots(newSlots);
      setHand(prev => [...prev, { card }]);
    }
  }

  return (
    <div className="gacha-page">
      {/* 레전드 시네마틱 */}
      {revealCard && <LegendReveal player={revealCard} onComplete={onRevealComplete} />}

      {/* 중앙 카드 공개 */}
      {dealing && !revealCard && (
        <CenterReveal
          key={revealKey}
          current={current}
          total={total}
          flipped={flipped}
          busy={busy}
          onFlip={handleFlip}
          onNext={handleNext}
        />
      )}

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
          <p>10장을 뽑고 원하는 선수를 포지션에 배치하세요</p>
        </div>

        {/* ── 팀 슬롯 ── */}
        <div className="slots-wrapper">
          <div className="role-labels">
            {ROLES.map(r => <div key={r} className="role-label">{r}</div>)}
          </div>
          <div className="cards-row">
            {ROLES.map((role, i) => (
              <TeamSlot
                key={role}
                card={slots[i]}
                role={role}
                active={selectedIdx !== null}
                chemLevel={chem?.playerChem[i] ?? 0}
                onClick={() => handleSlotClick(i)}
              />
            ))}
          </div>
          {chem && <ChemLines connections={chem.connections} />}
          {allFilled && chem && <ChemPanel chem={chem} />}
        </div>

        {/* ── 뽑기 버튼 ── */}
        <div className="pull-actions">
          <button
            className={`btn-summon${dealing ? ' loading' : ''}`}
            onClick={handlePull}
            disabled={dealing || busy}
          >
            <span className="btn-icon">⚡</span>
            {dealing ? 'REVEALING...' : 'PULL 10'}
          </button>
        </div>

        <div className="rate-info">
          <span className="rate legend">Legend 25%</span>
          <span className="rate-dot" />
          <span className="rate rare">Rare 45%</span>
          <span className="rate-dot" />
          <span className="rate common">Common 30%</span>
        </div>

        {/* ── 손패 ── */}
        {hand.length > 0 && (
          <div className="hand-section">
            <div className="hand-header">
              <span className="hand-title">패</span>
              <span className="hand-count">{hand.length}장</span>
              {selectedIdx !== null && (
                <span className="hand-hint">슬롯을 클릭해 배치하세요</span>
              )}
            </div>
            <div className="hand-cards">
              {hand.map((item, idx) => (
                <HandCard
                  key={idx}
                  item={item}
                  selected={selectedIdx === idx}
                  onSelect={() => handleSelect(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GachaPage;
