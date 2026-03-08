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
  const lineRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Default map center and zoom
  const DEFAULT_CENTER = [20, 0];
  const DEFAULT_ZOOM = 2;

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      console.log('Initializing map...');
      
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      });

      // Add map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 0
      }).addTo(mapInstanceRef.current);

      // Mark map as ready
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapReady(true);
          console.log('Map is ready');
        }
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle map clicks - PIN APPEARS HERE!
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

      // Create PIN marker - FIXED VERSION
      const pinIcon = L.divIcon({
        html: '<div style="font-size: 32px; filter: drop-shadow(0 0 5px #ff6b6b);">📍</div>',
        className: 'pin-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
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

  // Show result markers when result is shown
  useEffect(() => {
    if (!mapInstanceRef.current || !actualLocation || !showResult) return;

    console.log('Showing result markers');
    
    // Remove existing actual marker and line
    if (actualMarkerRef.current) {
      mapInstanceRef.current.removeLayer(actualMarkerRef.current);
    }
    if (lineRef.current) {
      mapInstanceRef.current.removeLayer(lineRef.current);
    }

    // Create target icon for actual location
    const targetIcon = L.divIcon({
      html: '<div style="font-size: 34px; filter: drop-shadow(0 0 5px #10b981);">🎯</div>',
      className: 'target-marker',
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    // Add actual location marker
    actualMarkerRef.current = L.marker([actualLocation.lat, actualLocation.lng], { icon: targetIcon }).addTo(mapInstanceRef.current);

    // Draw connection line if guess exists
    if (guess) {
      const linePoints = [
        [guess.lat, guess.lng],
        [actualLocation.lat, actualLocation.lng]
      ];
      
      lineRef.current = L.polyline(linePoints, {
        color: '#ff6b6b',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(mapInstanceRef.current);

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([
        [actualLocation.lat, actualLocation.lng],
        [guess.lat, guess.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [actualLocation, showResult, guess]);

  // Clear markers and reset map when new round starts
  useEffect(() => {
    if (!showResult) {
      console.log('New round started - clearing markers');
      
      // Remove all markers
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (actualMarkerRef.current) {
        mapInstanceRef.current.removeLayer(actualMarkerRef.current);
        actualMarkerRef.current = null;
      }
      if (lineRef.current) {
        mapInstanceRef.current.removeLayer(lineRef.current);
        lineRef.current = null;
      }
      
      // Reset map to default view
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      }
    }
  }, [showResult]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        background: '#1a1a2e',
        cursor: 'crosshair'
      }} 
    />
  );
};

export default InteractiveMap;