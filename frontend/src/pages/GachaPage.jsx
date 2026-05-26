import { useState, useRef } from 'react';
import { pull } from '../utils/gacha';
import PlayerCard from '../components/PlayerCard';
import LegendReveal from '../components/LegendReveal';
import './GachaPage.css';

const ROLES = ['DUELIST', 'INITIATOR', 'FLEX', 'SENTINEL', 'CONTROLLER'];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function EmptySlot({ role }) {
  return (
    <div className="empty-slot">
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />
      <div className="slot-question">?</div>
      <div className="slot-role">{role}</div>
      <div className="slot-cta">CLICK TO SUMMON</div>
    </div>
  );
}

function GachaPage() {
  const [slots, setSlots]           = useState(Array(5).fill(null));
  const [legendCard, setLegendCard] = useState(null);
  const [pulling, setPulling]       = useState(false);
  const legendResolveRef            = useRef(null);

  // 레전드 전광판을 클릭/자동으로 닫을 때 호출
  function onLegendComplete() {
    if (legendResolveRef.current) {
      legendResolveRef.current();
      legendResolveRef.current = null;
    }
  }

  async function handlePull() {
    if (pulling) return;
    setPulling(true);
    setLegendCard(null);

    const cards = pull();
    // 슬롯 초기화
    setSlots(Array(5).fill(null));

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      if (card.rarity === 'legend') {
        // 전광판 연출 → 유저가 닫을 때까지 대기
        setLegendCard(card);
        await new Promise(resolve => { legendResolveRef.current = resolve; });
        setLegendCard(null);
        // 전광판 닫힌 후 슬롯에 카드 추가
        await sleep(300);
        setSlots(prev => { const s = [...prev]; s[i] = card; return s; });
        await sleep(500);
      } else {
        await sleep(150);
        setSlots(prev => { const s = [...prev]; s[i] = card; return s; });
        await sleep(360);
      }
    }

    setPulling(false);
  }

  const allRevealed = slots.every(Boolean);

  return (
    <div className="gacha-page">
      {legendCard && (
        <LegendReveal player={legendCard} onComplete={onLegendComplete} />
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
          <p>포지션별 랜덤 프로 선수 카드 · Legend 25% · Rare 45%</p>
        </div>

        <div className="slots-wrapper">
          <div className="role-labels">
            {ROLES.map(r => <div key={r} className="role-label">{r}</div>)}
          </div>
          <div className="cards-row">
            {ROLES.map((role, i) =>
              slots[i]
                ? <PlayerCard key={`${role}-filled`} player={slots[i]} delay={0} />
                : <EmptySlot key={role} role={role} />
            )}
          </div>
        </div>

        <div className="pull-actions">
          <button
            className={`btn-summon ${pulling ? 'loading' : ''}`}
            onClick={handlePull}
            disabled={pulling}
          >
            <span className="btn-icon">⚡</span>
            {pulling ? 'SUMMONING...' : 'SUMMON ALL'}
          </button>
          {allRevealed && !pulling && (
            <button className="btn-reset" onClick={handlePull}>
              다시 뽑기
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
