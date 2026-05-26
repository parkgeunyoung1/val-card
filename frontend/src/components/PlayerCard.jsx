import { TEAM_LOGOS, LEAGUE_LOGOS } from '../data/logos';
import './PlayerCard.css';

const RARITY_LABELS = { legend: 'LEGEND', rare: 'RARE', common: 'COMMON' };

const FLAG_EMOJIS = {
  CA:'🇨🇦', US:'🇺🇸', BR:'🇧🇷', TR:'🇹🇷', BE:'🇧🇪', RU:'🇷🇺',
  FI:'🇫🇮', FR:'🇫🇷', UZ:'🇺🇿', AR:'🇦🇷', CL:'🇨🇱', JP:'🇯🇵',
  KR:'🇰🇷', IT:'🇮🇹', ES:'🇪🇸', UA:'🇺🇦', GB:'🇬🇧',
};

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
  const { name, team, nationality, rarity, role, seasonId, seasonLabel, seasonBadge, image_url: imageUrl } = player;
  const teamLogo = TEAM_LOGOS[team];
  const seasonLogo = LEAGUE_LOGOS[seasonId];
  const backgroundStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined;

  return (
    <div
      className={`player-card rarity-${rarity}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="player-bg" style={backgroundStyle} aria-hidden />
      <div className="card-overlay" aria-hidden />

      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div className="rarity-text">{RARITY_LABELS[rarity]}</div>

      <div className="team-mark" aria-label={team}>
        {teamLogo ? (
          <img src={teamLogo} alt={team} className="team-logo" />
        ) : (
          <span className="team-fallback">{team}</span>
        )}
      </div>

      <div className="position-rail">
        <div className="position-text">{role}</div>
      </div>

      <div className="card-image-area" aria-hidden>
        <div className="art-frame" />
      </div>

      <div className="nationality-mark">{FLAG_EMOJIS[nationality] || nationality}</div>

      <div className="player-name">{name}</div>

      {seasonLabel && (
        <div className="season-mark">
          {seasonLogo ? (
            <img src={seasonLogo} alt={seasonLabel} className="season-logo" />
          ) : (
            <span className="season-fallback">{seasonBadge}</span>
          )}
          <span className="season-text">{seasonLabel}</span>
        </div>
      )}

      <ChemDots level={chemLevel} />
    </div>
  );
}

export default PlayerCard;
