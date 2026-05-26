import { useState } from 'react';
import { TEAM_LOGOS, LEAGUE_LOGOS } from '../data/logos';
import './PlayerCard.css';

const RARITY_LABELS = { legend: 'LEGEND', rare: 'RARE', common: 'COMMON' };

const FLAG_EMOJIS = {
  CA:'🇨🇦', US:'🇺🇸', BR:'🇧🇷', TR:'🇹🇷', BE:'🇧🇪', RU:'🇷🇺',
  FI:'🇫🇮', FR:'🇫🇷', UZ:'🇺🇿', AR:'🇦🇷', CL:'🇨🇱', JP:'🇯🇵',
  KR:'🇰🇷', IT:'🇮🇹', ES:'🇪🇸', UA:'🇺🇦', GB:'🇬🇧',
};

const ROLE_ICONS = {
  DUELIST:'⚔️', INITIATOR:'💡', FLEX:'🔄', SENTINEL:'🛡️', CONTROLLER:'🌫️',
};

function TeamAvatar({ name, team, rarity }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoUrl = TEAM_LOGOS[team];

  if (logoUrl && !imgFailed) {
    return (
      <div className={`avatar rarity-${rarity}`}>
        <img
          src={logoUrl}
          alt={team}
          className="avatar-logo"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }
  return (
    <div className={`avatar rarity-${rarity}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function LeagueBadge({ seasonId, seasonBadge, seasonLabel, seasonColor }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoUrl = LEAGUE_LOGOS[seasonId];

  return (
    <div className="season-badge" style={{ '--season-color': seasonColor || '#64748b' }}>
      {logoUrl && !imgFailed ? (
        <img
          src={logoUrl}
          alt={seasonLabel}
          className="season-league-logo"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="season-badge-icon">{seasonBadge}</span>
      )}
      <span className="season-badge-label">{seasonLabel}</span>
    </div>
  );
}

function ChemDots({ level = 0 }) {
  return (
    <div className="chem-dots">
      {[0, 1, 2].map(i => (
        <span key={i} className={`chem-dot ${i < level ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

function PlayerCard({ player, delay = 0, chemLevel = 0 }) {
  const { name, team, nationality, rarity, role, seasonId, seasonLabel, seasonBadge, seasonColor } = player;

  return (
    <div
      className={`player-card rarity-${rarity}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div className={`rarity-bar rarity-${rarity}`} />

      {seasonLabel && (
        <LeagueBadge
          seasonId={seasonId}
          seasonBadge={seasonBadge}
          seasonLabel={seasonLabel}
          seasonColor={seasonColor}
        />
      )}

      <div className="card-image-area">
        <TeamAvatar name={name} team={team} rarity={rarity} />
      </div>

      <div className="card-body">
        <div className="player-name">{name}</div>
        <div className="player-meta">
          <span>{FLAG_EMOJIS[nationality] || ''}</span>
          <span className="team">{team}</span>
        </div>
        <div className="role-tag">
          {ROLE_ICONS[role]} {role}
        </div>
        <div className={`rarity-badge rarity-${rarity}`}>
          {RARITY_LABELS[rarity]}
        </div>
      </div>

      <ChemDots level={chemLevel} />
    </div>
  );
}

export default PlayerCard;
