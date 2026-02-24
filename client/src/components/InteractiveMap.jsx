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

const InteractiveMap = ({ onGuess, guess, actualLocation, showResult }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const actualMarkerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
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

      // ENGLISH ONLY MAP TILES
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 0
      }).addTo(mapInstanceRef.current);

      // Force a resize after initialization
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapReady(true);
        }
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle map clicks - PIN APPEARS INSTANTLY!
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      console.log('Map clicked:', lat, lng);
      
      // Remove existing guess marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }

      // Create PIN marker (red pin) - APPEARS IMMEDIATELY!
      const pinIcon = L.divIcon({
        html: '<div style="position: relative;"><div style="width: 30px; height: 30px; background: #ff6b6b; border: 3px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 5px 15px rgba(0,0,0,0.3);"><div style="position: absolute; top: 8px; left: 8px; width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div><div style="position: absolute; top: 30px; left: 10px; background: #333; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; white-space: nowrap; transform: rotate(0);">Your guess</div></div>',
        className: 'pin-marker',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });

      // Add marker immediately
      markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(mapInstanceRef.current);

      // Send guess to parent
      onGuess({ lat, lng });
    };

    mapInstanceRef.current.on('click', handleMapClick);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleMapClick);
      }
    };
  }, [onGuess, mapReady]);

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

  // Clear guess marker when showResult becomes true (after submitting)
  useEffect(() => {
    if (showResult && markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, [showResult]);

  // Update actual location marker when result is shown
  useEffect(() => {
    if (!mapInstanceRef.current || !actualLocation || !showResult) return;

    // Remove existing actual marker
    if (actualMarkerRef.current) {
      mapInstanceRef.current.removeLayer(actualMarkerRef.current);
    }

    // Create target icon for actual location
    const targetIcon = L.divIcon({
      html: '<div style="font-size: 32px; filter: drop-shadow(0 0 10px #10b981); animation: pulse 1.5s infinite;">🎯</div>',
      className: 'target-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // Add actual location marker
    actualMarkerRef.current = L.marker([actualLocation.lat, actualLocation.lng], { icon: targetIcon }).addTo(mapInstanceRef.current);

    // Fit bounds to show both markers if guess exists
    if (guess) {
      const bounds = L.latLngBounds([
        [actualLocation.lat, actualLocation.lng],
        [guess.lat, guess.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [actualLocation, showResult, guess]);

  // Clear markers when new round starts (showResult becomes false)
  useEffect(() => {
    if (!showResult && markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    if (!showResult && actualMarkerRef.current) {
      mapInstanceRef.current.removeLayer(actualMarkerRef.current);
      actualMarkerRef.current = null;
    }
  }, [showResult]);

  // Force map resize when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

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