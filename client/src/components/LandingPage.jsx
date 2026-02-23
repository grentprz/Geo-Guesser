import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const gameModes = [
    {
      id: 'classic',
      title: 'Classic',
      icon: '🌍',
      description: 'Guess locations from around the world',
      players: '1 Player',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      path: '/classic',
    },
    // ✅ RANK MODE - MUST BE HERE
    {
      id: 'rank',
      title: 'Ranked',
      icon: '🏆',
      description: 'Compete for the highest rank! 10 rounds, higher stakes',
      players: '1 Player',
      color: 'linear-gradient(135deg, #ffd700, #ff6b6b)',
      path: '/rank',
      online: '1.2k playing'
    },
    {
      id: 'duel',
      title: '1v1 Duel',
      icon: '⚔️',
      description: 'Face off against another player in real-time',
      players: '2 Players',
      color: 'linear-gradient(135deg, #ff6b6b, #feca57)',
      path: '/lobby',
      online: '892 playing'
    },
    {
      id: 'timetrial',
      title: 'Time Trial',
      icon: '⏱️',
      description: 'Race against the clock',
      players: '1 Player',
      color: 'linear-gradient(135deg, #48bb78, #38a169)',
      path: '/timetrial'
    },
    {
      id: 'aimode',
      title: 'AI Mode',
      icon: '🤖',
      description: 'Get intelligent hints from AI',
      players: '1 Player',
      color: 'linear-gradient(135deg, #9f7aea, #6b46c1)',
      path: '/aimode'
    },
    {
      id: 'battle',
      title: 'Battle Royale',
      icon: '👑',
      description: '50 players, last one standing wins',
      players: 'Coming Soon',
      color: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      path: '#',
      disabled: true
    },
    {
      id: 'custom',
      title: 'Custom Maps',
      icon: '🗺️',
      description: 'Create and share your own maps',
      players: 'Coming Soon',
      color: 'linear-gradient(135deg, #a0aec0, #718096)',
      path: '#',
      disabled: true
    }
  ];

  const handleModeClick = (mode) => {
    if (mode.disabled) {
      alert('🚧 This mode is coming soon!');
      return;
    }
    
    if (!user && mode.id !== 'classic' && mode.id !== 'rank') {
      navigate('/signin');
    } else {
      navigate(mode.path);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🌍</span>
            GeoGuessr Pro
          </h1>
          <p className="hero-subtitle">
            Explore the world. Test your geography skills. Challenge friends.
          </p>
          <div className="hero-buttons">
            <button 
              className="play-btn"
              onClick={() => navigate('/classic')}
            >
              <span className="btn-icon">🎮</span>
              Play Classic
            </button>
            <button 
              className="rank-btn"
              onClick={() => user ? navigate('/rank') : navigate('/signin')}
            >
              <span className="btn-icon">🏆</span>
              Play Ranked
            </button>
          </div>
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Games Played</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Players</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="modes-section">
        <h2 className="section-title">Choose Your Game Mode</h2>
        <div className="modes-grid">
          {gameModes.map((mode) => (
            <div
              key={mode.id}
              className={`mode-card ${mode.disabled ? 'disabled' : ''}`}
              onClick={() => handleModeClick(mode)}
              style={{ '--mode-color': mode.color }}
            >
              <div className="mode-icon">{mode.icon}</div>
              <h3 className="mode-title">{mode.title}</h3>
              <p className="mode-description">{mode.description}</p>
              <div className="mode-footer">
                <span className="mode-players">{mode.players}</span>
                {mode.online && <span className="mode-online">{mode.online}</span>}
              </div>
              {mode.disabled && <span className="coming-soon">Coming Soon</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Play GeoGuessr Pro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Realistic Gameplay</h3>
            <p>Authentic Google Street View integration for immersive experience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Multiplayer</h3>
            <p>Challenge friends in 1v1 duels with live matchmaking</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get intelligent hints and scene analysis from our AI</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Competitive</h3>
            <p>Climb the leaderboards and prove you're the best</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of players exploring the world</p>
          <div className="cta-buttons">
            {!user ? (
              <>
                <button 
                  className="cta-btn primary"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Free
                </button>
                <button 
                  className="cta-btn secondary"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </button>
              </>
            ) : (
              <button 
                className="cta-btn primary"
                onClick={() => navigate('/classic')}
              >
                Play Now
              </button>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          margin-top: 80px;
          color: white;
          overflow-x: hidden;
        }

        .hero-section {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 50%);
          animation: rotate 30s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-content {
          text-align: center;
          z-index: 1;
          padding: 0 20px;
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 800;
          margin-bottom: 20px;
          animation: fadeInUp 1s ease;
        }

        .hero-icon {
          font-size: 5rem;
          display: inline-block;
          animation: bounce 2s ease infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #a0aec0;
          margin-bottom: 40px;
          animation: fadeInUp 1s ease 0.2s both;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 60px;
          animation: fadeInUp 1s ease 0.4s both;
        }

        .play-btn, .rank-btn, .duel-btn {
          padding: 18px 40px;
          font-size: 1.2rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .play-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 10px 20px rgba(102,126,234,0.3);
        }

        .rank-btn {
          background: linear-gradient(135deg, #ffd700, #ff6b6b);
          color: white;
          box-shadow: 0 10px 20px rgba(255,215,0,0.3);
        }

        .duel-btn {
          background: linear-gradient(135deg, #ff6b6b, #feca57);
          color: white;
          box-shadow: 0 10px 20px rgba(255,107,107,0.3);
        }

        .play-btn:hover, .rank-btn:hover, .duel-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.3);
        }

        .stats-banner {
          display: flex;
          gap: 60px;
          justify-content: center;
          animation: fadeInUp 1s ease 0.6s both;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 1rem;
          color: #a0aec0;
        }

        .modes-section {
          padding: 80px 40px;
          background: rgba(255,255,255,0.02);
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .mode-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .mode-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--mode-color);
          transition: all 0.3s;
        }

        .mode-card:hover:not(.disabled) {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border-color: transparent;
        }

        .mode-card:hover:not(.disabled)::before {
          height: 100%;
          opacity: 0.1;
        }

        .mode-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mode-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .mode-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .mode-description {
          color: #a0aec0;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .mode-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mode-players {
          color: #667eea;
          font-weight: 600;
        }

        .mode-online {
          background: rgba(72, 187, 120, 0.2);
          color: #48bb78;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
        }

        .coming-soon {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.7rem;
        }

        .features-section {
          padding: 80px 40px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          text-align: center;
          padding: 30px;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.05);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          margin-bottom: 15px;
        }

        .feature-card p {
          color: #a0aec0;
          line-height: 1.6;
        }

        .cta-section {
          padding: 100px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .cta-btn {
          padding: 15px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cta-btn.primary {
          background: white;
          color: #667eea;
        }

        .cta-btn.secondary {
          background: transparent;
          border: 2px solid white;
          color: white;
        }

        .cta-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.2);
        }

        .cta-btn.secondary:hover {
          background: white;
          color: #667eea;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
          
          .stats-banner {
            flex-direction: column;
            gap: 20px;
          }
          
          .cta-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;