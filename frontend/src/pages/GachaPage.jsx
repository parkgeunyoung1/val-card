import { useState, useRef } from 'react';
import { pull, pullOne } from '../utils/gacha';
import PlayerCard from '../components/PlayerCard';
import LegendReveal from '../components/LegendReveal';
import './GachaPage.css';

const ROLES = ['DUELIST', 'INITIATOR', 'FLEX', 'SENTINEL', 'CONTROLLER'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function EmptySlot({ role, onClick, disabled }) {
  return (
    <div
      className={`empty-slot${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      title={`${role} 카드 뽑기`}
    >
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />
      <div className="slot-question">?</div>
      <div className="slot-role">{role}</div>
      <div className="slot-cta">클릭하여 뽑기</div>
    </div>
  );
}

function FilledSlot({ card, onClick, disabled }) {
  return (
    <div
      className={`filled-slot${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      title="클릭하여 다시 뽑기"
    >
      <PlayerCard player={card} delay={0} />
      <div className="reroll-overlay">
        <span className="reroll-icon">🔄</span>
        <span className="reroll-text">다시 뽑기</span>
      </div>
    </div>
  );
}

function GachaPage() {
  const [slots, setSlots]           = useState(Array(5).fill(null));
  const [revealCard, setRevealCard] = useState(null); // 현재 연출 중인 카드
  const [busy, setBusy]             = useState(false);
  const resolveRef                  = useRef(null);

  function onRevealComplete() {
    resolveRef.current?.();
    resolveRef.current = null;
  }

  // 단건 연출 → 슬롯에 배치
  async function doReveal(card, index) {
    setRevealCard(card);
    await new Promise(resolve => { resolveRef.current = resolve; });
    setRevealCard(null);
    await sleep(180);
    setSlots(prev => { const s = [...prev]; s[index] = card; return s; });
    await sleep(200);
  }

  // 개별 슬롯 클릭
  async function handleSlotClick(index) {
    if (busy) return;
    setBusy(true);
    await doReveal(pullOne(ROLES[index]), index);
    setBusy(false);
  }

  // 전체 뽑기
  async function handlePullAll() {
    if (busy) return;
    setBusy(true);
    setSlots(Array(5).fill(null));
    const cards = pull();
    for (let i = 0; i < cards.length; i++) {
      await doReveal(cards[i], i);
    }
    setBusy(false);
  }

  const allRevealed = slots.every(Boolean);

  return (
    <div className="gacha-page">
      {revealCard && (
        <LegendReveal player={revealCard} onComplete={onRevealComplete} />
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
          <p>포지션 카드를 클릭하여 선수를 뽑거나, 전체 뽑기를 사용하세요</p>
        </div>

        <div className="slots-wrapper">
          <div className="role-labels">
            {ROLES.map(r => <div key={r} className="role-label">{r}</div>)}
          </div>
          <div className="cards-row">
            {ROLES.map((role, i) =>
              slots[i]
                ? <FilledSlot key={role} card={slots[i]} onClick={() => handleSlotClick(i)} disabled={busy} />
                : <EmptySlot  key={role} role={role}     onClick={() => handleSlotClick(i)} disabled={busy} />
            )}
          </div>
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
          {allRevealed && !busy && (
            <button className="btn-reset" onClick={handlePullAll}>
              전체 다시 뽑기
            </button>
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
