import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Lobby() {
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const findMatch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      navigate('/duel/123');
    }, 2000);
  };

  return (
    <div style={{
      marginTop: '80px',
      padding: '40px',
      textAlign: 'center',
      color: 'white'
    }}>
      <h1>🎮 Multiplayer Lobby</h1>
      <button 
        onClick={findMatch}
        disabled={searching}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        {searching ? 'Searching...' : 'Find Match'}
      </button>
    </div>
  );
}

export default Lobby;