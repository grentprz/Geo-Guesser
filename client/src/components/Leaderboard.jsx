import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Leaderboard() {
  const [mode, setMode] = useState('rank'); // Default to Ranked
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const { user } = useAuth();

  // Only Ranked mode on leaderboard (Classic is just for fun)
  const gameModes = [
    { id: 'rank', name: '🏆 Ranked', color: '#ffd700' },
    { id: 'timetrial', name: '⏱️ Time Trial', color: '#48bb78' },
    { id: 'duel', name: '⚔️ Duel', color: '#ff6b6b' },
    { id: 'ai', name: '🤖 AI Mode', color: '#9f7aea' }
  ];

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserRank();
    }
  }, [mode, user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/leaderboard/${mode}?limit=50`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/leaderboard/rank/${user.id}/${mode}`);
      const data = await response.json();
      setUserRank(data);
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">
        <span className="title-icon">🏆</span>
        Leaderboard
      </h1>

      {/* Mode Tabs - Classic removed */}
      <div className="mode-tabs">
        {gameModes.map((gameMode) => (
          <button
            key={gameMode.id}
            className={`mode-tab ${mode === gameMode.id ? 'active' : ''}`}
            onClick={() => setMode(gameMode.id)}
            style={mode === gameMode.id ? { background: gameMode.color, color: 'white' } : {}}
          >
            {gameMode.name}
          </button>
        ))}
      </div>

      {/* User Rank Card */}
      {user && userRank && (
        <div className="user-rank-card">
          <div className="user-rank-header">
            <span>Your Rank</span>
            <span className="rank-value">#{userRank.rank || 'N/A'}</span>
          </div>
          <div className="user-rank-details">
            <span className="user-name">{user.username}</span>
            <span className="user-score">{userRank.score || 0}</span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : (
        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
            <span>Games</span>
          </div>

          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`table-row ${user && entry.id === user.id ? 'current-user' : ''}`}
              >
                <span className="rank-col">
                  {getMedal(index + 1) || `#${index + 1}`}
                </span>
                <span className="player-col">
                  {entry.username}
                  {entry.id === user?.id && <span className="you-badge">(You)</span>}
                </span>
                <span className="score-col">{entry.score}</span>
                <span className="games-col">{entry.games_played}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No scores yet in {mode} mode</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .leaderboard-container {
          margin-top: 80px;
          padding: 40px;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
          color: white;
        }

        .leaderboard-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .title-icon {
          font-size: 2.5rem;
        }

        .mode-tabs {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .mode-tab {
          padding: 10px 20px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
        }

        .mode-tab:hover {
          background: rgba(255,255,255,0.2);
        }

        .mode-tab.active {
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .user-rank-card {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 15px 20px;
          margin-bottom: 20px;
        }

        .user-rank-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #a0aec0;
          font-size: 0.9rem;
        }

        .rank-value {
          color: #fbbf24;
          font-weight: bold;
        }

        .user-rank-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-name {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .user-score {
          font-size: 1.3rem;
          font-weight: 700;
          color: #4ade80;
        }

        .leaderboard-table {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 1fr 100px 80px;
          padding: 15px 20px;
          background: rgba(255,255,255,0.1);
          color: #a0aec0;
          font-weight: 600;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr 100px 80px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .table-row:hover {
          background: rgba(255,255,255,0.08);
        }

        .table-row.current-user {
          background: rgba(255, 215, 0, 0.2);
        }

        .rank-col {
          font-weight: 600;
        }

        .player-col {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .you-badge {
          background: #ffd700;
          color: #000;
          padding: 2px 8px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .score-col {
          font-weight: 600;
          color: #4ade80;
        }

        .games-col {
          color: #a0aec0;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #ffd700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #a0aec0;
        }

        @media (max-width: 600px) {
          .leaderboard-container {
            padding: 20px;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 60px 1fr 70px 50px;
            font-size: 0.9rem;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;