# fix-map.ps1
Write-Host "🔧 Fixing map issues..." -ForegroundColor Green

# Reinstall Leaflet
npm uninstall leaflet react-leaflet
npm install leaflet@1.9.4 react-leaflet@4.2.1 --save

Write-Host "✅ Map dependencies reinstalled!" -ForegroundColor Green
Write-Host "🚀 Restart your app: npm run dev" -ForegroundColor Yellow