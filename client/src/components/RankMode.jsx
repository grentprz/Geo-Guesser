import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapillaryView from './MapillaryView';
import InteractiveMap from './InteractiveMap';
import { useAuth } from '../context/AuthContext';

// Locations database (same as classic)
const LOCATIONS = [
  { id: 1, name: 'Eiffel Tower', country: 'France', city: 'Paris', lat: 48.8584, lng: 2.2945 },
  { id: 2, name: 'Colosseum', country: 'Italy', city: 'Rome', lat: 41.8902, lng: 12.4922 },
  { id: 3, name: 'Big Ben', country: 'UK', city: 'London', lat: 51.5007, lng: -0.1246 },
  { id: 4, name: 'Grand Canyon', country: 'USA', city: 'Arizona', lat: 36.0544, lng: -112.1401 },
  { id: 5, name: 'Sydney Opera House', country: 'Australia', city: 'Sydney', lat: -33.8568, lng: 151.2153 },
  { id: 6, name: 'Great Wall', country: 'China', city: 'Beijing', lat: 40.4319, lng: 116.5704 },
  { id: 7, name: 'Taj Mahal', country: 'India', city: 'Agra', lat: 27.1751, lng: 78.0421 },
  { id: 8, name: 'Machu Picchu', country: 'Peru', city: 'Cusco', lat: -13.1631, lng: -72.5450 },
  { id: 9, name: 'Pyramids of Giza', country: 'Egypt', city: 'Cairo', lat: 29.9792, lng: 31.1342 },
  { id: 10, name: 'Christ the Redeemer', country: 'Brazil', city: 'Rio', lat: -22.9519, lng: -43.2105 }
];

function RankMode() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [guess, setGuess] = useState(null);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState('Bronze');
  const [rankProgress, setRankProgress] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [gameState, setGameState] = useState('playing');
  const [distance, setDistance] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [previousLocations, setPreviousLocations] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadRandomLocation();
  }, []);

  // Update rank based on score
  useEffect(() => {
    if (score >= 5000) {
      setRank('Diamond');
      setRankProgress(100);
    } else if (score >= 3000) {
      setRank('Platinum');
      setRankProgress((score - 3000) / 20);
    } else if (score >= 1500) {
      setRank('Gold');
      setRankProgress((score - 1500) / 15);
    } else if (score >= 500) {
      setRank('Silver');
      setRankProgress((score - 500) / 10);
    } else {
      setRank('Bronze');
      setRankProgress((score / 500) * 100);
    }
  }, [score]);

  const loadRandomLocation = () => {
    let available = LOCATIONS.filter(loc => !previousLocations.includes(loc.id));
    if (available.length === 0) {
      setPreviousLocations([]);
      available = LOCATIONS;
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const newLocation = available[randomIndex];
    
    setCurrentLocation(newLocation);
    setPreviousLocations(prev => [...prev, newLocation.id].slice(-10));
    setGuess(null);
    setGameState('playing');
    setShowResult(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  // RANKED MODE SCORING - Higher stakes!
  const calculateScore = (distance) => {
    if (distance < 100) return 1000;      // Perfect: +1000
    if (distance < 500) return 500;       // Great: +500
    if (distance < 1000) return 200;       // Good: +200
    if (distance < 2000) return 0;         // OK: 0 points
    if (distance < 3000) return -100;      // Bad: -100
    if (distance < 4000) return -200;      // Very Bad: -200
    return -300;                            // Terrible: -300
  };

  const handleGuess = (guessCoords) => {
    setGuess(guessCoords);
  };

  const submitGuess = () => {
    if (!guess || !currentLocation) return;

    const dist = calculateDistance(
      guess.lat, guess.lng,
      currentLocation.lat, currentLocation.lng
    );
    
    setDistance(dist);
    
    const roundScore = calculateScore(dist);
    setScore(prev => prev + roundScore);
    
    setGameState('result');
    setShowResult(true);

    if (user) {
      fetch('http://localhost:5000/api/games/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({
          userId: user.id,
          mode: 'ranked',
          score: roundScore,
          distance: dist,
          rounds: [{ location: currentLocation, guess, distance: dist, score: roundScore }]
        })
      }).catch(err => console.error('Failed to save game:', err));
    }
  };

  const nextRound = () => {
    if (round < totalRounds) {
      setRound(prev => prev + 1);
      loadRandomLocation();
    } else {
      let finalRank = rank;
      alert(`🏆 RANKED GAME COMPLETE!\nFinal Score: ${score}\nFinal Rank: ${finalRank}`);
      setRound(1);
      setScore(0);
      setPreviousLocations([]);
      loadRandomLocation();
    }
  };

  const getRankIcon = () => {
    switch(rank) {
      case 'Diamond': return '💎';
      case 'Platinum': return '⚪';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      default: return '🥉';
    }
  };

  const getRankColor = () => {
    switch(rank) {
      case 'Diamond': return '#b9f2ff';
      case 'Platinum': return '#e5e4e2';
      case 'Gold': return '#ffd700';
      case 'Silver': return '#c0c0c0';
      default: return '#cd7f32';
    }
  };

  const getScoreColor = (dist) => {
    if (dist < 100) return '#4ade80';
    if (dist < 500) return '#fbbf24';
    if (dist < 1000) return '#f97316';
    return '#ef4444';
  };

  const getScoreText = (dist) => {
    if (dist < 100) return 'PERFECT! +1000';
    if (dist < 500) return 'GREAT! +500';
    if (dist < 1000) return 'GOOD! +200';
    if (dist < 2000) return 'OK: 0';
    if (dist < 3000) return 'BAD: -100';
    if (dist < 4000) return 'VERY BAD: -200';
    return 'TERRIBLE: -300';
  };

  return (
    <div className="rank-mode">
      <header className="rank-header">
        <div className="rank-left">
          <h1 className="rank-title">🏆 RANKED MODE</h1>
          <div className="rank-badge" style={{ background: getRankColor() }}>
            <span className="rank-icon">{getRankIcon()}</span>
            <span className="rank-name">{rank}</span>
          </div>
        </div>
        
        <div className="rank-stats">
          <div className="stat-item">
            <span className="stat-label">ROUND</span>
            <span className="stat-value">{round}/{totalRounds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">SCORE</span>
            <span className="stat-value" style={{ color: score >= 0 ? '#4ade80' : '#ef4444' }}>
              {score > 0 ? '+' : ''}{score}
            </span>
          </div>
        </div>
      </header>

      <div className="rank-progress-container">
        <div className="rank-progress-bar" style={{ width: `${rankProgress}%`, background: getRankColor() }}></div>
      </div>

      <main className="game-main">
        <div className="street-view-container">
          {currentLocation && <MapillaryView location={currentLocation} />}
          
          {showResult && currentLocation && (
            <div className="result-overlay">
              <div className="result-content">
                <div className="result-header">
                  <h2>{getScoreText(distance)}</h2>
                  <div className="distance-badge" style={{ background: getScoreColor(distance) }}>
                    {distance} km
                  </div>
                </div>
                
                <div className="location-reveal">
                  <h3>{currentLocation.name}</h3>
                  <p>{currentLocation.country}</p>
                </div>
                
                <div className="points-earned" style={{ color: calculateScore(distance) >= 0 ? '#4ade80' : '#ef4444' }}>
                  {calculateScore(distance) > 0 ? '+' : ''}{calculateScore(distance)} points
                </div>
                
                <button className="next-btn" onClick={nextRound}>
                  {round < totalRounds ? 'Next Round →' : 'See Final Rank'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="bottom-panel">
        <div className="map-container">
          <div className="map-header">
            <span className="map-title">📍 CLICK MAP TO GUESS</span>
            {guess && (
              <span className="guess-coords">
                {guess.lat.toFixed(2)}°, {guess.lng.toFixed(2)}°
              </span>
            )}
          </div>
          
          <div className="guess-map">
            <InteractiveMap 
              onGuess={handleGuess}
              guess={guess}
              actualLocation={currentLocation}
              showResult={showResult}
            />
          </div>
          
          <div className="map-footer">
            <button 
              className="submit-btn" 
              onClick={submitGuess}
              disabled={!guess || gameState === 'result'}
            >
              {!guess ? '📍 CLICK MAP TO GUESS' : '🎯 SUBMIT GUESS'}
            </button>
          </div>
        </div>
      </div>

      {!guess && gameState === 'playing' && (
        <div className="map-hint">
          🔍 Hover over map to enlarge
        </div>
      )}

      <style>{`
        .rank-mode {
          margin-top: 80px;
          color: white;
        }

        .rank-header {
          position: fixed;
          top: 80px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          padding: 15px 30px;
          border-radius: 50px;
          z-index: 90;
          border: 2px solid #ffd700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .rank-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rank-title {
          font-size: 1.5rem;
          background: linear-gradient(135deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rank-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: bold;
        }

        .rank-stats {
          display: flex;
          gap: 30px;
        }

        .rank-progress-container {
          position: fixed;
          top: 150px;
          left: 20px;
          right: 20px;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          z-index: 89;
        }

        .rank-progress-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        @media (max-width: 768px) {
          .rank-header {
            flex-direction: column;
            gap: 15px;
          }
          .rank-stats {
            width: 100%;
            justify-content: space-around;
          }
        }
      `}</style>
    </div>
  );
}

export default RankMode;