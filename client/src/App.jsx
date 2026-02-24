import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapillaryView from './components/MapillaryView';
import RankMode from './components/RankMode';
import InteractiveMap from './components/InteractiveMap';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Leaderboard from './components/Leaderboard';
import Lobby from './components/Lobby';
import DuelMode from './components/DuelMode';
import TimeTrial from './components/TimeTrial';
import AIMode from './components/AIMode';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// 60+ LOCATIONS for better variety!
const LOCATIONS = [
  // Europe (15)
  { id: 1, name: 'Eiffel Tower', country: 'France', city: 'Paris', lat: 48.8584, lng: 2.2945,
    clues: ['Tall iron tower', 'River Seine', 'Tree-lined streets'] },
  { id: 2, name: 'Colosseum', country: 'Italy', city: 'Rome', lat: 41.8902, lng: 12.4922,
    clues: ['Ancient amphitheater', 'Roman architecture', 'Tourists'] },
  { id: 3, name: 'Big Ben', country: 'UK', city: 'London', lat: 51.5007, lng: -0.1246,
    clues: ['Clock tower', 'Gothic', 'Double-decker buses'] },
  { id: 4, name: 'Sagrada Familia', country: 'Spain', city: 'Barcelona', lat: 41.4036, lng: 2.1744,
    clues: ['Unique architecture', 'Still building', 'Colorful spires'] },
  { id: 5, name: 'Neuschwanstein Castle', country: 'Germany', city: 'Bavaria', lat: 47.5576, lng: 10.7498,
    clues: ['Fairytale castle', 'Mountains', 'Disney inspiration'] },
  { id: 6, name: 'Leaning Tower of Pisa', country: 'Italy', city: 'Pisa', lat: 43.7230, lng: 10.3964,
    clues: ['Tilted tower', 'White marble', 'Tourists taking photos'] },
  { id: 7, name: 'Acropolis of Athens', country: 'Greece', city: 'Athens', lat: 37.9715, lng: 23.7257,
    clues: ['Ancient ruins', 'Columns', 'Hilltop'] },
  { id: 8, name: 'Stonehenge', country: 'UK', city: 'Wiltshire', lat: 51.1789, lng: -1.8262,
    clues: ['Ancient stones', 'Circle', 'Mysterious'] },
  { id: 9, name: 'Louvre Museum', country: 'France', city: 'Paris', lat: 48.8606, lng: 2.3376,
    clues: ['Glass pyramid', 'Art museum', 'Mona Lisa'] },
  { id: 10, name: 'Brandenburg Gate', country: 'Germany', city: 'Berlin', lat: 52.5163, lng: 13.3777,
    clues: ['Historic gate', 'Quadriga', 'Berlin landmark'] },
  { id: 11, name: 'St. Peter\'s Basilica', country: 'Vatican City', city: 'Rome', lat: 41.9022, lng: 12.4539,
    clues: ['Dome', 'Vatican', 'Pope'] },
  { id: 12, name: 'Canals of Venice', country: 'Italy', city: 'Venice', lat: 45.4408, lng: 12.3155,
    clues: ['Water canals', 'Gondolas', 'Bridges'] },
  { id: 13, name: 'Alhambra', country: 'Spain', city: 'Granada', lat: 37.1765, lng: -3.5889,
    clues: ['Moorish palace', 'Fountains', 'Gardens'] },
  { id: 14, name: 'Charles Bridge', country: 'Czech Republic', city: 'Prague', lat: 50.0865, lng: 14.4118,
    clues: ['Old bridge', 'Statues', 'River Vltava'] },
  { id: 15, name: 'Tower Bridge', country: 'UK', city: 'London', lat: 51.5055, lng: -0.0754,
    clues: ['Blue bridge', 'Towers', 'Opens for ships'] },

  // North America (12)
  { id: 16, name: 'Grand Canyon', country: 'USA', city: 'Arizona', lat: 36.0544, lng: -112.1401,
    clues: ['Vast canyon', 'Red rocks', 'Colorado River'] },
  { id: 17, name: 'Statue of Liberty', country: 'USA', city: 'New York', lat: 40.6892, lng: -74.0445,
    clues: ['Green statue', 'Torch', 'Island'] },
  { id: 18, name: 'Golden Gate Bridge', country: 'USA', city: 'San Francisco', lat: 37.8199, lng: -122.4783,
    clues: ['Red bridge', 'Fog', 'Suspension'] },
  { id: 19, name: 'Niagara Falls', country: 'Canada/USA', city: 'Ontario', lat: 43.0828, lng: -79.0742,
    clues: ['Waterfalls', 'Mist', 'Rainbow'] },
  { id: 20, name: 'Chichen Itza', country: 'Mexico', city: 'Yucatan', lat: 20.6843, lng: -88.5678,
    clues: ['Mayan pyramid', 'Ancient ruins', 'Grass'] },
  { id: 21, name: 'Banff National Park', country: 'Canada', city: 'Alberta', lat: 51.4968, lng: -115.9281,
    clues: ['Turquoise lakes', 'Snowy mountains', 'Pine forests'] },
  { id: 22, name: 'Hollywood Sign', country: 'USA', city: 'Los Angeles', lat: 34.1341, lng: -118.3215,
    clues: ['White letters', 'Hill', 'Movie stars'] },
  { id: 23, name: 'White House', country: 'USA', city: 'Washington DC', lat: 38.8977, lng: -77.0365,
    clues: ['White building', 'President', 'Lawn'] },
  { id: 24, name: 'Times Square', country: 'USA', city: 'New York', lat: 40.7580, lng: -73.9855,
    clues: ['Bright lights', 'Billboards', 'Crowded'] },
  { id: 25, name: 'CN Tower', country: 'Canada', city: 'Toronto', lat: 43.6426, lng: -79.3871,
    clues: ['Tall tower', 'Observation deck', 'City view'] },
  { id: 26, name: 'Rocky Mountains', country: 'USA/Canada', city: 'Colorado', lat: 39.1171, lng: -106.4450,
    clues: ['Snow peaks', 'Forests', 'Hiking'] },
  { id: 27, name: 'Old Havana', country: 'Cuba', city: 'Havana', lat: 23.1367, lng: -82.3586,
    clues: ['Colorful buildings', 'Old cars', 'Cobblestone'] },

  // South America (8)
  { id: 28, name: 'Machu Picchu', country: 'Peru', city: 'Cusco', lat: -13.1631, lng: -72.5450,
    clues: ['Stone ruins', 'Mountain peaks', 'Cloud forest'] },
  { id: 29, name: 'Christ the Redeemer', country: 'Brazil', city: 'Rio', lat: -22.9519, lng: -43.2105,
    clues: ['Massive statue', 'Mountain top', 'Open arms'] },
  { id: 30, name: 'Iguazu Falls', country: 'Argentina/Brazil', city: 'Misiones', lat: -25.6953, lng: -54.4367,
    clues: ['Waterfalls', 'Rainbow', 'Jungle'] },
  { id: 31, name: 'Amazon Rainforest', country: 'Brazil', city: 'Amazonas', lat: -3.4653, lng: -62.2159,
    clues: ['Dense jungle', 'River', 'Wildlife'] },
  { id: 32, name: 'Salar de Uyuni', country: 'Bolivia', city: 'Potosi', lat: -20.1338, lng: -67.4891,
    clues: ['Salt flats', 'Mirror effect', 'Endless white'] },
  { id: 33, name: 'Easter Island', country: 'Chile', city: 'Rapa Nui', lat: -27.1127, lng: -109.3497,
    clues: ['Moai statues', 'Remote island', 'Pacific'] },
  { id: 34, name: 'Angel Falls', country: 'Venezuela', city: 'Canaima', lat: 5.9670, lng: -62.5356,
    clues: ['Highest waterfall', 'Jungle', 'Table mountains'] },
  { id: 35, name: 'Galapagos Islands', country: 'Ecuador', city: 'Galapagos', lat: -0.6296, lng: -90.4383,
    clues: ['Giant turtles', 'Volcanic', 'Unique wildlife'] },

  // Asia (12)
  { id: 36, name: 'Great Wall', country: 'China', city: 'Beijing', lat: 40.4319, lng: 116.5704,
    clues: ['Ancient wall', 'Mountains', 'Watchtowers'] },
  { id: 37, name: 'Taj Mahal', country: 'India', city: 'Agra', lat: 27.1751, lng: 78.0421,
    clues: ['White marble', 'Dome', 'Gardens'] },
  { id: 38, name: 'Burj Khalifa', country: 'UAE', city: 'Dubai', lat: 25.1972, lng: 55.2744,
    clues: ['Tallest building', 'Modern', 'Desert'] },
  { id: 39, name: 'Angkor Wat', country: 'Cambodia', city: 'Siem Reap', lat: 13.4125, lng: 103.8667,
    clues: ['Temple ruins', 'Jungle', 'Ancient stones'] },
  { id: 40, name: 'Mount Fuji', country: 'Japan', city: 'Honshu', lat: 35.3606, lng: 138.7278,
    clues: ['Volcano', 'Snow cap', 'Japanese icon'] },
  { id: 41, name: 'Petra', country: 'Jordan', city: 'Wadi Musa', lat: 30.3285, lng: 35.4444,
    clues: ['Rose city', 'Rock-cut', 'Ancient tombs'] },
  { id: 42, name: 'Forbidden City', country: 'China', city: 'Beijing', lat: 39.9163, lng: 116.3972,
    clues: ['Imperial palace', 'Red walls', 'Ancient'] },
  { id: 43, name: 'Tokyo Tower', country: 'Japan', city: 'Tokyo', lat: 35.6586, lng: 139.7454,
    clues: ['Red tower', 'City view', 'Eiffel inspiration'] },
  { id: 44, name: 'Singapore Flyer', country: 'Singapore', city: 'Singapore', lat: 1.2894, lng: 103.8631,
    clues: ['Giant Ferris wheel', 'Marina', 'City'] },
  { id: 45, name: 'Ha Long Bay', country: 'Vietnam', city: 'Quang Ninh', lat: 20.9101, lng: 107.1839,
    clues: ['Limestone islands', 'Green water', 'Boats'] },
  { id: 46, name: 'Blue Mosque', country: 'Turkey', city: 'Istanbul', lat: 41.0054, lng: 28.9768,
    clues: ['Blue tiles', 'Minarets', 'Domes'] },
  { id: 47, name: 'Hagia Sophia', country: 'Turkey', city: 'Istanbul', lat: 41.0086, lng: 28.9802,
    clues: ['Huge dome', 'Byzantine', 'Museum'] },

  // Africa (6)
  { id: 48, name: 'Pyramids of Giza', country: 'Egypt', city: 'Cairo', lat: 29.9792, lng: 31.1342,
    clues: ['Ancient pyramids', 'Sphinx', 'Desert'] },
  { id: 49, name: 'Table Mountain', country: 'South Africa', city: 'Cape Town', lat: -33.9628, lng: 18.4098,
    clues: ['Flat top', 'Cable car', 'Coastal'] },
  { id: 50, name: 'Serengeti', country: 'Tanzania', city: 'Arusha', lat: -2.3333, lng: 34.8333,
    clues: ['Savanna', 'Wildlife', 'Acacia trees'] },
  { id: 51, name: 'Victoria Falls', country: 'Zambia/Zimbabwe', city: 'Livingstone', lat: -17.9243, lng: 25.8569,
    clues: ['Smoke that thunders', 'Waterfall', 'Rainbow'] },
  { id: 52, name: 'Sahara Desert', country: 'Morocco', city: 'Merzouga', lat: 31.0500, lng: -4.0000,
    clues: ['Sand dunes', 'Camels', 'Endless desert'] },
  { id: 53, name: 'Atlas Mountains', country: 'Morocco', city: 'Marrakech', lat: 31.4167, lng: -6.1167,
    clues: ['Mountain range', 'Berber villages', 'Snow peaks'] },

  // Oceania (4)
  { id: 54, name: 'Sydney Opera House', country: 'Australia', city: 'Sydney', lat: -33.8568, lng: 151.2153,
    clues: ['Sail roofs', 'Harbor', 'Modern'] },
  { id: 55, name: 'Great Barrier Reef', country: 'Australia', city: 'Queensland', lat: -16.6355, lng: 145.8375,
    clues: ['Coral', 'Crystal water', 'Marine life'] },
  { id: 56, name: 'Uluru', country: 'Australia', city: 'Northern Territory', lat: -25.3444, lng: 131.0369,
    clues: ['Red rock', 'Sacred site', 'Desert'] },
  { id: 57, name: 'Milford Sound', country: 'New Zealand', city: 'South Island', lat: -44.6720, lng: 167.9267,
    clues: ['Fjord', 'Waterfalls', 'Green mountains'] },
  { id: 58, name: 'Hobbiton', country: 'New Zealand', city: 'Matamata', lat: -37.8708, lng: 175.6829,
    clues: ['Hobbit holes', 'Green hills', 'Movie set'] },
  { id: 59, name: 'Bora Bora', country: 'French Polynesia', city: 'Leeward Islands', lat: -16.5004, lng: -151.7415,
    clues: ['Overwater bungalows', 'Turquoise lagoon', 'Volcanic'] },
  { id: 60, name: 'Fiji Islands', country: 'Fiji', city: 'Viti Levu', lat: -18.1667, lng: 178.4500,
    clues: ['Beaches', 'Coral reefs', 'Palm trees'] }
];

function HomePage() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [guess, setGuess] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [gameState, setGameState] = useState('playing');
  const [distance, setDistance] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [previousLocations, setPreviousLocations] = useState([]);
  const [roundScores, setRoundScores] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadRandomLocation();
  }, []);

  const loadRandomLocation = () => {
    let availableLocations = LOCATIONS.filter(loc => !previousLocations.includes(loc.id));
    if (availableLocations.length === 0) {
      setPreviousLocations([]);
      availableLocations = LOCATIONS;
    }
    
    const randomIndex = Math.floor(Math.random() * availableLocations.length);
    const newLocation = availableLocations[randomIndex];
    
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

  // ✅ UPDATED: CLASSIC MODE SCORING - No negatives, just for fun!
  const calculateScore = (distance) => {
    if (distance < 100) return 500;      // Perfect: +500
    if (distance < 500) return 300;       // Great: +300
    if (distance < 1000) return 200;       // Good: +200
    if (distance < 2000) return 100;       // Decent: +100
    return 50;                              // Participation: +50 (no negative!)
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
    
    setRoundScores(prev => [...prev, {
      round,
      distance: dist,
      score: roundScore,
      location: currentLocation.name
    }]);
    
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
          mode: 'classic',
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
      alert(`🏆 Game Complete! Final Score: ${score}`);
      setRound(1);
      setScore(0);
      setRoundScores([]);
      setPreviousLocations([]);
      loadRandomLocation();
    }
  };

  const getScoreColor = (dist) => {
    if (dist < 100) return '#4ade80';
    if (dist < 500) return '#fbbf24';
    if (dist < 1000) return '#f97316';
    return '#94a3b8'; // Gray for far guesses (no negative connotation)
  };

  // ✅ UPDATED: No negative messages
  const getScoreText = (dist) => {
    if (dist < 100) return 'PERFECT! +500';
    if (dist < 500) return 'GREAT! +300';
    if (dist < 1000) return 'GOOD! +200';
    if (dist < 2000) return 'DECENT! +100';
    return 'NICE TRY! +50';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌍</span>
          <h1>GeoGuessr</h1>
        </div>
        
        <div className="game-info">
          <div className="round-info">
            <span className="label">ROUND</span>
            <span className="value">{round}/{totalRounds}</span>
          </div>
          <div className="score-info">
            <span className="label">SCORE</span>
            <span className="value" style={{ color: '#4ade80' }}>
              +{score}
            </span>
          </div>
          {user && (
            <div className="user-info">
              <span className="value">👤 {user.username}</span>
            </div>
          )}
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
                  <p>{currentLocation.city}, {currentLocation.country}</p>
                </div>
                
                <div className="points-earned" style={{ color: '#4ade80' }}>
                  +{calculateScore(distance)} points
                </div>
                
                <button className="next-btn" onClick={nextRound}>
                  {round < totalRounds ? 'Next Round →' : 'Play Again'}
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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/classic" element={<HomePage />} />
          <Route path="/rank" element={
            <PrivateRoute>
              <RankMode />
            </PrivateRoute>
          } />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/lobby" element={
            <PrivateRoute>
              <Lobby />
            </PrivateRoute>
          } />
          <Route path="/duel/:gameId" element={
            <PrivateRoute>
              <DuelMode />
            </PrivateRoute>
          } />
          <Route path="/timetrial" element={
            <PrivateRoute>
              <TimeTrial />
            </PrivateRoute>
          } />
          <Route path="/aimode" element={
            <PrivateRoute>
              <AIMode />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;