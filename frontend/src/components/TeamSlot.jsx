import PlayerCard from './PlayerCard';
import '../pages/GachaPage.css';

export default function TeamSlot({ card, role, active, chemLevel, onClick }) {
  if (card) {
    return (
      <div className="filled-slot" onClick={onClick}>
        <PlayerCard player={card} delay={0} chemLevel={chemLevel} />
        <div className="slot-return-overlay">
          <span className="reroll-icon">↩</span>
          <span className="reroll-text">돌리기</span>
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
