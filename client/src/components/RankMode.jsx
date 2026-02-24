import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapillaryView from './MapillaryView';
import InteractiveMap from './InteractiveMap';
import { useAuth } from '../context/AuthContext';

// 60+ LOCATIONS
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
  { id: 10, name: 'Christ the Redeemer', country: 'Brazil', city: 'Rio', lat: -22.9519, lng: -43.2105 },
  { id: 11, name: 'Sagrada Familia', country: 'Spain', city: 'Barcelona', lat: 41.4036, lng: 2.1744 },
  { id: 12, name: 'Neuschwanstein Castle', country: 'Germany', city: 'Bavaria', lat: 47.5576, lng: 10.7498 },
  { id: 13, name: 'Statue of Liberty', country: 'USA', city: 'New York', lat: 40.6892, lng: -74.0445 },
  { id: 14, name: 'Golden Gate Bridge', country: 'USA', city: 'San Francisco', lat: 37.8199, lng: -122.4783 },
  { id: 15, name: 'Niagara Falls', country: 'Canada/USA', city: 'Ontario', lat: 43.0828, lng: -79.0742 },
  { id: 16, name: 'Chichen Itza', country: 'Mexico', city: 'Yucatan', lat: 20.6843, lng: -88.5678 },
  { id: 17, name: 'Banff National Park', country: 'Canada', city: 'Alberta', lat: 51.4968, lng: -115.9281 },
  { id: 18, name: 'Hollywood Sign', country: 'USA', city: 'Los Angeles', lat: 34.1341, lng: -118.3215 },
  { id: 19, name: 'White House', country: 'USA', city: 'Washington DC', lat: 38.8977, lng: -77.0365 },
  { id: 20, name: 'Times Square', country: 'USA', city: 'New York', lat: 40.7580, lng: -73.9855 },
  { id: 21, name: 'CN Tower', country: 'Canada', city: 'Toronto', lat: 43.6426, lng: -79.3871 },
  { id: 22, name: 'Rocky Mountains', country: 'USA/Canada', city: 'Colorado', lat: 39.1171, lng: -106.4450 },
  { id: 23, name: 'Iguazu Falls', country: 'Argentina/Brazil', city: 'Misiones', lat: -25.6953, lng: -54.4367 },
  { id: 24, name: 'Amazon Rainforest', country: 'Brazil', city: 'Amazonas', lat: -3.4653, lng: -62.2159 },
  { id: 25, name: 'Salar de Uyuni', country: 'Bolivia', city: 'Potosi', lat: -20.1338, lng: -67.4891 },
  { id: 26, name: 'Easter Island', country: 'Chile', city: 'Rapa Nui', lat: -27.1127, lng: -109.3497 },
  { id: 27, name: 'Angel Falls', country: 'Venezuela', city: 'Canaima', lat: 5.9670, lng: -62.5356 },
  { id: 28, name: 'Galapagos Islands', country: 'Ecuador', city: 'Galapagos', lat: -0.6296, lng: -90.4383 },
  { id: 29, name: 'Burj Khalifa', country: 'UAE', city: 'Dubai', lat: 25.1972, lng: 55.2744 },
  { id: 30, name: 'Angkor Wat', country: 'Cambodia', city: 'Siem Reap', lat: 13.4125, lng: 103.8667 },
  { id: 31, name: 'Mount Fuji', country: 'Japan', city: 'Honshu', lat: 35.3606, lng: 138.7278 },
  { id: 32, name: 'Petra', country: 'Jordan', city: 'Wadi Musa', lat: 30.3285, lng: 35.4444 },
  { id: 33, name: 'Forbidden City', country: 'China', city: 'Beijing', lat: 39.9163, lng: 116.3972 },
  { id: 34, name: 'Tokyo Tower', country: 'Japan', city: 'Tokyo', lat: 35.6586, lng: 139.7454 },
  { id: 35, name: 'Singapore Flyer', country: 'Singapore', city: 'Singapore', lat: 1.2894, lng: 103.8631 },
  { id: 36, name: 'Ha Long Bay', country: 'Vietnam', city: 'Quang Ninh', lat: 20.9101, lng: 107.1839 },
  { id: 37, name: 'Blue Mosque', country: 'Turkey', city: 'Istanbul', lat: 41.0054, lng: 28.9768 },
  { id: 38, name: 'Hagia Sophia', country: 'Turkey', city: 'Istanbul', lat: 41.0086, lng: 28.9802 },
  { id: 39, name: 'Table Mountain', country: 'South Africa', city: 'Cape Town', lat: -33.9628, lng: 18.4098 },
  { id: 40, name: 'Serengeti', country: 'Tanzania', city: 'Arusha', lat: -2.3333, lng: 34.8333 },
  { id: 41, name: 'Victoria Falls', country: 'Zambia/Zimbabwe', city: 'Livingstone', lat: -17.9243, lng: 25.8569 },
  { id: 42, name: 'Sahara Desert', country: 'Morocco', city: 'Merzouga', lat: 31.0500, lng: -4.0000 },
  { id: 43, name: 'Atlas Mountains', country: 'Morocco', city: 'Marrakech', lat: 31.4167, lng: -6.1167 },
  { id: 44, name: 'Great Barrier Reef', country: 'Australia', city: 'Queensland', lat: -16.6355, lng: 145.8375 },
  { id: 45, name: 'Uluru', country: 'Australia', city: 'Northern Territory', lat: -25.3444, lng: 131.0369 },
  { id: 46, name: 'Milford Sound', country: 'New Zealand', city: 'South Island', lat: -44.6720, lng: 167.9267 },
  { id: 47, name: 'Hobbiton', country: 'New Zealand', city: 'Matamata', lat: -37.8708, lng: 175.6829 },
  { id: 48, name: 'Bora Bora', country: 'French Polynesia', city: 'Leeward Islands', lat: -16.5004, lng: -151.7415 },
  { id: 49, name: 'Fiji Islands', country: 'Fiji', city: 'Viti Levu', lat: -18.1667, lng: 178.4500 },
  { id: 50, name: 'Acropolis of Athens', country: 'Greece', city: 'Athens', lat: 37.9715, lng: 23.7257 },
  { id: 51, name: 'Stonehenge', country: 'UK', city: 'Wiltshire', lat: 51.1789, lng: -1.8262 },
  { id: 52, name: 'Louvre Museum', country: 'France', city: 'Paris', lat: 48.8606, lng: 2.3376 },
  { id: 53, name: 'Brandenburg Gate', country: 'Germany', city: 'Berlin', lat: 52.5163, lng: 13.3777 },
  { id: 54, name: 'Leaning Tower of Pisa', country: 'Italy', city: 'Pisa', lat: 43.7230, lng: 10.3964 },
  { id: 55, name: 'Canals of Venice', country: 'Italy', city: 'Venice', lat: 45.4408, lng: 12.3155 },
  { id: 56, name: 'Alhambra', country: 'Spain', city: 'Granada', lat: 37.1765, lng: -3.5889 },
  { id: 57, name: 'Charles Bridge', country: 'Czech Republic', city: 'Prague', lat: 50.0865, lng: 14.4118 },
  { id: 58, name: 'Tower Bridge', country: 'UK', city: 'London', lat: 51.5055, lng: -0.0754 },
  { id: 59, name: 'Old Havana', country: 'Cuba', city: 'Havana', lat: 23.1367, lng: -82.3586 },
  { id: 60, name: 'Rocky Mountains', country: 'USA/Canada', city: 'Colorado', lat: 39.1171, lng: -106.4450 }
];

function RankMode() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [guess, setGuess] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10); // 10 rounds for ranked mode
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

  const loadRandomLocation = () => {
    let available = LOCATIONS.filter(loc => !previousLocations.includes(loc.id));
    if (available.length === 0) {
      setPreviousLocations([]);
      available = LOCATIONS;
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const newLocation = available[randomIndex];
    
    setCurrentLocation(newLocation);
    setPreviousLocations(prev => [...prev, newLocation.id].slice(-20));
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

  // RANKED MODE SCORING - Higher points for competition!
  const calculateScore = (distance) => {
    if (distance < 100) return 1000;      // Perfect: +1000
    if (distance < 500) return 600;       // Great: +600
    if (distance < 1000) return 400;      // Good: +400
    if (distance < 2000) return 200;      // Decent: +200
    if (distance < 3000) return 100;      // Okay: +100
    return 50;                             // Participation: +50
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
    const newScore = score + roundScore;
    setScore(newScore);
    
    setGameState('result');
    setShowResult(true);

    // ✅ SAVE EACH ROUND TO LEADERBOARD
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
          rounds: [{ 
            location: currentLocation.name, 
            guess, 
            distance: dist, 
            score: roundScore 
          }]
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Round saved to leaderboard:', data);
        // Trigger leaderboard refresh
        window.dispatchEvent(new Event('leaderboardUpdate'));
      })
      .catch(err => console.error('Failed to save game:', err));
    }
  };

  const nextRound = () => {
    if (round < totalRounds) {
      setRound(prev => prev + 1);
      loadRandomLocation();
    } else {
      // ✅ GAME COMPLETE - FINAL SCORE SAVED
      alert(`🏆 RANKED GAME COMPLETE! Final Score: ${score}`);
      
      // Force leaderboard refresh one more time
      window.dispatchEvent(new Event('leaderboardUpdate'));
      
      setRound(1);
      setScore(0);
      setPreviousLocations([]);
      loadRandomLocation();
    }
  };

  const getScoreColor = (dist) => {
    if (dist < 100) return '#4ade80';
    if (dist < 500) return '#fbbf24';
    if (dist < 1000) return '#f97316';
    return '#94a3b8';
  };

  const getScoreText = (dist) => {
    if (dist < 100) return 'PERFECT! +1000';
    if (dist < 500) return 'GREAT! +600';
    if (dist < 1000) return 'GOOD! +400';
    if (dist < 2000) return 'DECENT! +200';
    if (dist < 3000) return 'OKAY! +100';
    return 'GOOD TRY! +50';
  };

  if (!user) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rank-mode">
      <header className="rank-header">
        <div className="rank-left">
          <h1 className="rank-title">🏆 RANKED MODE</h1>
        </div>
        
        <div className="rank-stats">
          <div className="stat-item">
            <span className="stat-label">ROUND</span>
            <span className="stat-value">{round}/{totalRounds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">SCORE</span>
            <span className="stat-value" style={{ color: '#4ade80' }}>
              +{score}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">PLAYER</span>
            <span className="stat-value">{user.username}</span>
          </div>
        </div>
      </header>

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
                
                <div className="points-earned" style={{ color: '#4ade80' }}>
                  +{calculateScore(distance)} points
                </div>
                
                <button className="next-btn" onClick={nextRound}>
                  {round < totalRounds ? 'Next Round →' : 'Complete Game'}
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

        .rank-stats {
          display: flex;
          gap: 30px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #a0aec0;
          display: block;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
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