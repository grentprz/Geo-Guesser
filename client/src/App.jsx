import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [socket, setSocket] = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    // Check backend API
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus('✅ Connected')
        console.log('Backend:', data)
      })
      .catch(err => {
        setBackendStatus('❌ Offline')
        console.error('Backend error:', err)
      })

    // Connect to WebSocket
    const newSocket = io('http://localhost:5000')
    
    newSocket.on('connect', () => {
      console.log('Socket connected!')
      setSocketConnected(true)
    })

    newSocket.on('welcome', (data) => {
      console.log('Welcome message:', data)
    })

    setSocket(newSocket)

    return () => newSocket.disconnect()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">🌍 GeoGuessr Pro</h1>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">BACKEND</span>
            <span className="stat-value">{backendStatus}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">SOCKET</span>
            <span className="stat-value">
              {socketConnected ? '✅' : '❌'}
            </span>
          </div>
        </div>
      </header>

      <main style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>GeoGuessr Pro</h2>
        <p>Backend Status: {backendStatus}</p>
        <p>Socket Status: {socketConnected ? 'Connected' : 'Disconnected'}</p>
        
        <div style={{ marginTop: '50px' }}>
          <button 
            onClick={() => {
              fetch('http://localhost:5000/api/test')
                .then(res => res.json())
                .then(data => alert(JSON.stringify(data)))
            }}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Test Backend Connection
          </button>
        </div>
      </main>
    </div>
  )
}

export default App