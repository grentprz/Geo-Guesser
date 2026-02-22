# fix-css.ps1
Write-Host "🔧 Creating App.css..." -ForegroundColor Green

$cssContent = @'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  margin-bottom: 30px;
}

.title {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
'@

Set-Content -Path "src\App.css" -Value $cssContent

Write-Host "✅ App.css created!" -ForegroundColor Green