import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

// Your free Mapillary token - replace with yours!
const MAPILLARY_TOKEN = 'MLY|26492469317003801|f4532b2c8fa9ddf88ae770d0928d1f9f';

// Fallback images for locations without Mapillary coverage
const FALLBACK_IMAGES = {
  'Eiffel Tower': 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Colosseum': 'https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Big Ben': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Sagrada Familia': 'https://images.pexels.com/photos/5783962/pexels-photo-5783962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Neuschwanstein Castle': 'https://images.pexels.com/photos/950590/pexels-photo-950590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Grand Canyon': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Statue of Liberty': 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Sydney Opera House': 'https://images.pexels.com/photos/1009339/pexels-photo-1009339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Great Wall': 'https://images.pexels.com/photos/789380/pexels-photo-789380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Taj Mahal': 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Machu Picchu': 'https://images.pexels.com/photos/2540653/pexels-photo-2540653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Pyramids of Giza': 'https://images.pexels.com/photos/33582/sphinx-egypt-giza-cairo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Christ the Redeemer': 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Burj Khalifa': 'https://images.pexels.com/photos/2440018/pexels-photo-2440018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Angkor Wat': 'https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Mount Fuji': 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Petra': 'https://images.pexels.com/photos/5348158/pexels-photo-5348158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'default': 'https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

const MapillaryView = ({ location }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  // Step 1: Search for image ID near the location
  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);
    setUseFallback(false);

    // Search for images near the location using Mapillary API v4
    const searchNearbyImages = async () => {
      try {
        const bbox = [
          location.lng - 0.01, // west
          location.lat - 0.01, // south
          location.lng + 0.01, // east
          location.lat + 0.01  // north
        ].join(',');

        const response = await fetch(
          `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&bbox=${bbox}&fields=id&limit=5`
        );

        if (!response.ok) throw new Error('Failed to fetch images');

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Use the first image found
          setImageId(data.data[0].id);
        } else {
          // No Mapillary images found, use fallback
          setUseFallback(true);
          setError('No Mapillary images found - showing fallback image');
        }
      } catch (err) {
        setUseFallback(true);
        setError('Error loading street view - showing fallback');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    searchNearbyImages();
  }, [location]);

  // Step 2: Initialize Mapillary viewer when we have an image ID
  useEffect(() => {
    if (!imageId || !containerRef.current || useFallback) return;

    // Clean up previous viewer
    if (viewerRef.current) {
      viewerRef.current.remove();
      viewerRef.current = null;
    }

    try {
      viewerRef.current = new Viewer({
        accessToken: MAPILLARY_TOKEN,
        container: containerRef.current,
        imageId: imageId,
        component: {
          cover: false,
          navigation: true,
          sequence: true,
          image: true
        }
      });

      console.log('Mapillary viewer initialized with image:', imageId);
    } catch (err) {
      setUseFallback(true);
      setError('Failed to initialize viewer - showing fallback');
      console.error(err);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
    };
  }, [imageId, useFallback]);

  // If using fallback image
  if (useFallback) {
    const fallbackUrl = FALLBACK_IMAGES[location?.name] || FALLBACK_IMAGES.default;
    
    return (
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#1a1a2e'
      }}>
        <img 
          src={fallbackUrl}
          alt={location?.name || 'Location'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {error && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: '#ff6b6b',
            padding: '8px 16px',
            borderRadius: '50px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '50px',
          fontSize: '0.9rem'
        }}>
          📍 {location?.name}, {location?.country}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        color: 'white'
      }}>
        Loading street view...
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapillaryView;