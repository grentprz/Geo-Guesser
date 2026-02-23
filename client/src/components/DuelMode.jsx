import React from 'react';
import { useParams } from 'react-router-dom';

function DuelMode() {
  const { gameId } = useParams();
  
  return (
    <div style={{
      marginTop: '80px',
      padding: '40px',
      textAlign: 'center',
      color: 'white'
    }}>
      <h1>⚔️ Duel Mode</h1>
      <p>Game ID: {gameId}</p>
      <p>Coming Soon!</p>
    </div>
  );
}

export default DuelMode;