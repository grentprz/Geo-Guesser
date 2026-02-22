# fix-react.ps1
Write-Host "🔧 Fixing React Setup..." -ForegroundColor Green

# Create index.html in client root
$indexHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌍 GeoGuessr Pro</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
'@

# Create main.jsx
$mainJsx = @'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
'@

# Create App.jsx
$appJsx = @'
import React from 'react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🌍 GeoGuessr Pro
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#a0aec0' }}>
        Ready to play!
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Play Classic
        </button>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer'
        }}>
          1v1 Duel
        </button>
      </div>
    </div>
  )
}

export default App
'@

# Create index.css
$indexCss = @'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
'@

# Write files
Set-Content -Path "index.html" -Value $indexHtml
Set-Content -Path "src\main.jsx" -Value $mainJsx
Set-Content -Path "src\App.jsx" -Value $appJsx
Set-Content -Path "src\index.css" -Value $indexCss

Write-Host "✅ React files created!" -ForegroundColor Green
Write-Host "Now run: npm run dev" -ForegroundColor Yellow