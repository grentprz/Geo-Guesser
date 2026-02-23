import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Multiple tile providers as fallbacks
const TILE_PROVIDERS = [
  {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap',
    name: 'OSM Standard'
  },
  {
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap France',
    name: 'OSM HOT'
  },
  {
    url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap DE',
    name: 'OSM DE'
  },
  {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap',
    name: 'Topo'
  }
];

const InteractiveMap = ({ onGuess, guess, actualLocation, showResult }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const actualMarkerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [tileProviderIndex, setTileProviderIndex] = useState(0);
  const [mapError, setMapError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Function to load a tile provider with error handling
  const loadTileProvider = (index) => {
    if (!mapInstanceRef.current) return;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[index];
    console.log(`Loading tile provider: ${provider.name}`);

    // Create new tile layer with error event
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: 19,
      errorTileUrl: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'256\' height=\'256\' viewBox=\'0 0 256 256\'%3E%3Crect width=\'256\' height=\'256\' fill=\'%231a1a2e\'/%3E%3Ctext x=\'128\' y=\'128\' font-size=\'20\' text-anchor=\'middle\' fill=\'%23ffffff\' font-family=\'Arial\'%3EMap%3C/text%3E%3Ctext x=\'128\' y=\'150\' font-size=\'16\' text-anchor=\'middle\' fill=\'%23ffffff\' font-family=\'Arial\'%3ELoading...%3C/text%3E%3C/svg%3E'
    });

    // Add error handler
    tileLayer.on('tileerror', (error) => {
      console.log(`Tile error with ${provider.name}, trying next provider...`);
      if (index < TILE_PROVIDERS.length - 1) {
        // Try next provider
        loadTileProvider(index + 1);
      } else {
        setMapError(true);
      }
    });

    tileLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = tileLayer;
    setTileProviderIndex(index);
    setMapError(false);
  };

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      console.log('Initializing map...');
      
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      });

      // Load first tile provider
      loadTileProvider(0);

      // Add click handler
      mapInstanceRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        console.log('Map clicked:', lat, lng);
        
        // Remove existing guess marker
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Create custom marker with emoji
        const customIcon = L.divIcon({
          html: '<div style="font-size: 28px; filter: drop-shadow(0 0 5px #3b82f6);">📍</div>',
          className: 'custom-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 28]
        });

        // Add new marker
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);

        // Send guess to parent
        onGuess({ lat, lng });
      });

      // Force a resize after initialization
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onGuess]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update actual location marker when result is shown
  useEffect(() => {
    if (!mapInstanceRef.current || !actualLocation || !showResult) return;

    // Remove existing actual marker
    if (actualMarkerRef.current) {
      mapInstanceRef.current.removeLayer(actualMarkerRef.current);
    }

    // Create custom icon for actual location
    const actualIcon = L.divIcon({
      html: '<div style="font-size: 32px; filter: drop-shadow(0 0 10px #10b981);">🎯</div>',
      className: 'actual-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // Add actual location marker
    actualMarkerRef.current = L.marker([actualLocation.lat, actualLocation.lng], { icon: actualIcon }).addTo(mapInstanceRef.current);

    // Fit bounds to show both markers if guess exists
    if (guess) {
      const bounds = L.latLngBounds([
        [actualLocation.lat, actualLocation.lng],
        [guess.lat, guess.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Just go to actual location
      mapInstanceRef.current.setView([actualLocation.lat, actualLocation.lng], 5);
    }
  }, [actualLocation, showResult, guess]);

  // Retry loading tiles if all providers fail
  const retryMap = () => {
    setRetryCount(prev => prev + 1);
    loadTileProvider(0);
  };

  // Force map resize when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // If all tile providers failed, show fallback UI
  if (mapError) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗺️</div>
        <h3 style={{ marginBottom: '10px' }}>Map loading failed</h3>
        <p style={{ color: '#a0aec0', marginBottom: '20px', textAlign: 'center' }}>
          Click anywhere on this box to place your guess
        </p>
        <button
          onClick={retryMap}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Retry Loading Map
        </button>
        <div style={{
          marginTop: '20px',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)'
        }} />
        <p style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
          Click anywhere to guess - coordinates will be recorded
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        background: '#1a1a2e'
      }} 
    />
  );
};

export default InteractiveMap;