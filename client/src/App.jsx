import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapillaryView from './components/MapillaryView';
import RankMode from './components/RankMode';
import InteractiveMap from './components/InteractiveMap';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Leaderboard from './components/Leaderboard';
import Lobby from './components/Lobby';
import DuelMode from './components/DuelMode';
import TimeTrial from './components/TimeTrial';
import AIMode from './components/AIMode';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Category definitions
const CATEGORIES = {
  'famous': {
    id: 'famous',
    name: '🌍 Famous Places',
    description: 'Iconic landmarks from around the world',
    color: '#667eea',
    icon: '🏛️'
  },
  'capitals': {
    id: 'capitals',
    name: '🏛️ Capitals of the World',
    description: 'Guess capital cities from every continent',
    color: '#48bb78',
    icon: '🏛️'
  },
  'wonders': {
    id: 'wonders',
    name: '✨ 7 Wonders',
    description: 'Ancient and modern wonders of the world',
    color: '#fbbf24',
    icon: '✨'
  },
  'asia': {
    id: 'asia',
    name: '🗾 Asia Only',
    description: 'Explore the diverse locations of Asia',
    color: '#ff6b6b',
    icon: '🗾'
  },
  'europe': {
    id: 'europe',
    name: '🏰 Europe Only',
    description: 'Castles, cathedrals and European landmarks',
    color: '#9f7aea',
    icon: '🏰'
  },
  'random': {
    id: 'random',
    name: '🎲 Random Mix',
    description: 'All locations mixed together',
    color: '#a0aec0',
    icon: '🎲'
  }
};

// Categorized locations (keeping your existing locations array)
const CATEGORY_LOCATIONS = {
  'famous': [
    { id: 1, name: 'Eiffel Tower', country: 'France', city: 'Paris', lat: 48.8584, lng: 2.2945 },
    { id: 2, name: 'Colosseum', country: 'Italy', city: 'Rome', lat: 41.8902, lng: 12.4922 },
    { id: 3, name: 'Big Ben', country: 'UK', city: 'London', lat: 51.5007, lng: -0.1246 },
    { id: 4, name: 'Sagrada Familia', country: 'Spain', city: 'Barcelona', lat: 41.4036, lng: 2.1744 },
    { id: 5, name: 'Neuschwanstein Castle', country: 'Germany', city: 'Bavaria', lat: 47.5576, lng: 10.7498 },
    { id: 16, name: 'Grand Canyon', country: 'USA', city: 'Arizona', lat: 36.0544, lng: -112.1401 },
    { id: 17, name: 'Statue of Liberty', country: 'USA', city: 'New York', lat: 40.6892, lng: -74.0445 },
    { id: 18, name: 'Golden Gate Bridge', country: 'USA', city: 'San Francisco', lat: 37.8199, lng: -122.4783 },
    { id: 28, name: 'Machu Picchu', country: 'Peru', city: 'Cusco', lat: -13.1631, lng: -72.5450 },
    { id: 29, name: 'Christ the Redeemer', country: 'Brazil', city: 'Rio', lat: -22.9519, lng: -43.2105 },
    { id: 36, name: 'Great Wall', country: 'China', city: 'Beijing', lat: 40.4319, lng: 116.5704 },
    { id: 37, name: 'Taj Mahal', country: 'India', city: 'Agra', lat: 27.1751, lng: 78.0421 },
    { id: 38, name: 'Burj Khalifa', country: 'UAE', city: 'Dubai', lat: 25.1972, lng: 55.2744 },
    { id: 39, name: 'Angkor Wat', country: 'Cambodia', city: 'Siem Reap', lat: 13.4125, lng: 103.8667 },
    { id: 40, name: 'Mount Fuji', country: 'Japan', city: 'Honshu', lat: 35.3606, lng: 138.7278 },
    { id: 48, name: 'Pyramids of Giza', country: 'Egypt', city: 'Cairo', lat: 29.9792, lng: 31.1342 },
    { id: 49, name: 'Table Mountain', country: 'South Africa', city: 'Cape Town', lat: -33.9628, lng: 18.4098 },
    { id: 54, name: 'Sydney Opera House', country: 'Australia', city: 'Sydney', lat: -33.8568, lng: 151.2153 },
    { id: 56, name: 'Uluru', country: 'Australia', city: 'Northern Territory', lat: -25.3444, lng: 131.0369 }
  ],
  
  'capitals': [
    // Europe
    { id: 101, name: 'London', country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278 },
    { id: 102, name: 'Paris', country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 },
    { id: 103, name: 'Rome', country: 'Italy', city: 'Rome', lat: 41.9028, lng: 12.4964 },
    { id: 104, name: 'Berlin', country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { id: 105, name: 'Madrid', country: 'Spain', city: 'Madrid', lat: 40.4168, lng: -3.7038 },
    { id: 106, name: 'Moscow', country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173 },
    { id: 107, name: 'Athens', country: 'Greece', city: 'Athens', lat: 37.9838, lng: 23.7275 },
    { id: 108, name: 'Lisbon', country: 'Portugal', city: 'Lisbon', lat: 38.7223, lng: -9.1393 },
    { id: 109, name: 'Amsterdam', country: 'Netherlands', city: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
    { id: 110, name: 'Brussels', country: 'Belgium', city: 'Brussels', lat: 50.8503, lng: 4.3517 },
    { id: 111, name: 'Vienna', country: 'Austria', city: 'Vienna', lat: 48.2082, lng: 16.3738 },
    { id: 112, name: 'Warsaw', country: 'Poland', city: 'Warsaw', lat: 52.2297, lng: 21.0122 },
    { id: 113, name: 'Prague', country: 'Czech Republic', city: 'Prague', lat: 50.0755, lng: 14.4378 },
    { id: 114, name: 'Budapest', country: 'Hungary', city: 'Budapest', lat: 47.4979, lng: 19.0402 },
    { id: 115, name: 'Stockholm', country: 'Sweden', city: 'Stockholm', lat: 59.3293, lng: 18.0686 },
    { id: 116, name: 'Oslo', country: 'Norway', city: 'Oslo', lat: 59.9139, lng: 10.7522 },
    { id: 117, name: 'Copenhagen', country: 'Denmark', city: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
    { id: 118, name: 'Helsinki', country: 'Finland', city: 'Helsinki', lat: 60.1699, lng: 24.9384 },
    { id: 119, name: 'Dublin', country: 'Ireland', city: 'Dublin', lat: 53.3498, lng: -6.2603 },
    { id: 120, name: 'Bern', country: 'Switzerland', city: 'Bern', lat: 46.9480, lng: 7.4474 },
    
    // North America
    { id: 121, name: 'Washington D.C.', country: 'USA', city: 'Washington', lat: 38.9072, lng: -77.0369 },
    { id: 122, name: 'Ottawa', country: 'Canada', city: 'Ottawa', lat: 45.4215, lng: -75.6972 },
    { id: 123, name: 'Mexico City', country: 'Mexico', city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
    { id: 124, name: 'Havana', country: 'Cuba', city: 'Havana', lat: 23.1136, lng: -82.3666 },
    { id: 125, name: 'Kingston', country: 'Jamaica', city: 'Kingston', lat: 18.0179, lng: -76.8099 },
    { id: 126, name: 'Port-au-Prince', country: 'Haiti', city: 'Port-au-Prince', lat: 18.5944, lng: -72.3074 },
    { id: 127, name: 'Santo Domingo', country: 'Dominican Republic', city: 'Santo Domingo', lat: 18.4861, lng: -69.9312 },
    { id: 128, name: 'San Juan', country: 'Puerto Rico', city: 'San Juan', lat: 18.4655, lng: -66.1057 },
    { id: 129, name: 'Nassau', country: 'Bahamas', city: 'Nassau', lat: 25.0343, lng: -77.3963 },
    { id: 130, name: 'Belmopan', country: 'Belize', city: 'Belmopan', lat: 17.2510, lng: -88.7590 },
    { id: 131, name: 'Guatemala City', country: 'Guatemala', city: 'Guatemala City', lat: 14.6349, lng: -90.5069 },
    { id: 132, name: 'Tegucigalpa', country: 'Honduras', city: 'Tegucigalpa', lat: 14.0723, lng: -87.1921 },
    { id: 133, name: 'San Salvador', country: 'El Salvador', city: 'San Salvador', lat: 13.6929, lng: -89.2182 },
    { id: 134, name: 'Managua', country: 'Nicaragua', city: 'Managua', lat: 12.1150, lng: -86.2362 },
    { id: 135, name: 'San José', country: 'Costa Rica', city: 'San José', lat: 9.9281, lng: -84.0907 },
    { id: 136, name: 'Panama City', country: 'Panama', city: 'Panama City', lat: 8.9824, lng: -79.5199 },
    
    // South America
    { id: 137, name: 'Brasília', country: 'Brazil', city: 'Brasília', lat: -15.8267, lng: -47.9218 },
    { id: 138, name: 'Buenos Aires', country: 'Argentina', city: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
    { id: 139, name: 'Santiago', country: 'Chile', city: 'Santiago', lat: -33.4489, lng: -70.6693 },
    { id: 140, name: 'Lima', country: 'Peru', city: 'Lima', lat: -12.0464, lng: -77.0428 },
    { id: 141, name: 'Bogotá', country: 'Colombia', city: 'Bogotá', lat: 4.7110, lng: -74.0721 },
    { id: 142, name: 'Quito', country: 'Ecuador', city: 'Quito', lat: -0.1807, lng: -78.4678 },
    { id: 143, name: 'Caracas', country: 'Venezuela', city: 'Caracas', lat: 10.4806, lng: -66.9036 },
    { id: 144, name: 'Georgetown', country: 'Guyana', city: 'Georgetown', lat: 6.8013, lng: -58.1551 },
    { id: 145, name: 'Paramaribo', country: 'Suriname', city: 'Paramaribo', lat: 5.8520, lng: -55.2038 },
    { id: 146, name: 'Cayenne', country: 'French Guiana', city: 'Cayenne', lat: 4.9224, lng: -52.3135 },
    { id: 147, name: 'La Paz', country: 'Bolivia', city: 'La Paz', lat: -16.5000, lng: -68.1500 },
    { id: 148, name: 'Sucre', country: 'Bolivia', city: 'Sucre', lat: -19.0333, lng: -65.2627 },
    { id: 149, name: 'Asunción', country: 'Paraguay', city: 'Asunción', lat: -25.2637, lng: -57.5759 },
    { id: 150, name: 'Montevideo', country: 'Uruguay', city: 'Montevideo', lat: -34.9011, lng: -56.1645 },
    
    // Asia
    { id: 151, name: 'Beijing', country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074 },
    { id: 152, name: 'Tokyo', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { id: 153, name: 'Seoul', country: 'South Korea', city: 'Seoul', lat: 37.5665, lng: 126.9780 },
    { id: 154, name: 'Bangkok', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
    { id: 155, name: 'Hanoi', country: 'Vietnam', city: 'Hanoi', lat: 21.0285, lng: 105.8542 },
    { id: 156, name: 'Jakarta', country: 'Indonesia', city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
    { id: 157, name: 'Kuala Lumpur', country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
    { id: 158, name: 'Singapore', country: 'Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { id: 159, name: 'Manila', country: 'Philippines', city: 'Manila', lat: 14.5995, lng: 120.9842 },
    { id: 160, name: 'Phnom Penh', country: 'Cambodia', city: 'Phnom Penh', lat: 11.5564, lng: 104.9282 },
    { id: 161, name: 'Vientiane', country: 'Laos', city: 'Vientiane', lat: 17.9757, lng: 102.6331 },
    { id: 162, name: 'Naypyidaw', country: 'Myanmar', city: 'Naypyidaw', lat: 19.7633, lng: 96.0785 },
    { id: 163, name: 'Dhaka', country: 'Bangladesh', city: 'Dhaka', lat: 23.8103, lng: 90.4125 },
    { id: 164, name: 'New Delhi', country: 'India', city: 'New Delhi', lat: 28.6139, lng: 77.2090 },
    { id: 165, name: 'Islamabad', country: 'Pakistan', city: 'Islamabad', lat: 33.6844, lng: 73.0479 },
    { id: 166, name: 'Kabul', country: 'Afghanistan', city: 'Kabul', lat: 34.5553, lng: 69.2075 },
    { id: 167, name: 'Tehran', country: 'Iran', city: 'Tehran', lat: 35.6892, lng: 51.3890 },
    { id: 168, name: 'Baghdad', country: 'Iraq', city: 'Baghdad', lat: 33.3152, lng: 44.3661 },
    { id: 169, name: 'Riyadh', country: 'Saudi Arabia', city: 'Riyadh', lat: 24.7136, lng: 46.6753 },
    { id: 170, name: 'Abu Dhabi', country: 'UAE', city: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
    { id: 171, name: 'Doha', country: 'Qatar', city: 'Doha', lat: 25.2854, lng: 51.5310 },
    { id: 172, name: 'Kuwait City', country: 'Kuwait', city: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
    { id: 173, name: 'Muscat', country: 'Oman', city: 'Muscat', lat: 23.5880, lng: 58.3829 },
    { id: 174, name: 'Sana\'a', country: 'Yemen', city: 'Sana\'a', lat: 15.3694, lng: 44.1910 },
    { id: 175, name: 'Jerusalem', country: 'Israel', city: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
    { id: 176, name: 'Amman', country: 'Jordan', city: 'Amman', lat: 31.9454, lng: 35.9284 },
    { id: 177, name: 'Beirut', country: 'Lebanon', city: 'Beirut', lat: 33.8938, lng: 35.5018 },
    { id: 178, name: 'Damascus', country: 'Syria', city: 'Damascus', lat: 33.5138, lng: 36.2765 },
    { id: 179, name: 'Ankara', country: 'Turkey', city: 'Ankara', lat: 39.9334, lng: 32.8597 },
    { id: 180, name: 'Tbilisi', country: 'Georgia', city: 'Tbilisi', lat: 41.7151, lng: 44.8271 },
    { id: 181, name: 'Yerevan', country: 'Armenia', city: 'Yerevan', lat: 40.1792, lng: 44.4991 },
    { id: 182, name: 'Baku', country: 'Azerbaijan', city: 'Baku', lat: 40.4093, lng: 49.8671 },
    { id: 183, name: 'Astana', country: 'Kazakhstan', city: 'Astana', lat: 51.1605, lng: 71.4704 },
    { id: 184, name: 'Tashkent', country: 'Uzbekistan', city: 'Tashkent', lat: 41.2995, lng: 69.2401 },
    { id: 185, name: 'Ashgabat', country: 'Turkmenistan', city: 'Ashgabat', lat: 37.9601, lng: 58.3261 },
    { id: 186, name: 'Bishkek', country: 'Kyrgyzstan', city: 'Bishkek', lat: 42.8746, lng: 74.5698 },
    { id: 187, name: 'Dushanbe', country: 'Tajikistan', city: 'Dushanbe', lat: 38.5598, lng: 68.7870 },
    
    // Africa
    { id: 188, name: 'Cairo', country: 'Egypt', city: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { id: 189, name: 'Cape Town', country: 'South Africa', city: 'Cape Town', lat: -33.9249, lng: 18.4241 },
    { id: 190, name: 'Pretoria', country: 'South Africa', city: 'Pretoria', lat: -25.7461, lng: 28.1881 },
    { id: 191, name: 'Bloemfontein', country: 'South Africa', city: 'Bloemfontein', lat: -29.0852, lng: 26.1596 },
    { id: 192, name: 'Lagos', country: 'Nigeria', city: 'Lagos', lat: 6.5244, lng: 3.3792 },
    { id: 193, name: 'Nairobi', country: 'Kenya', city: 'Nairobi', lat: -1.2921, lng: 36.8219 },
    { id: 194, name: 'Addis Ababa', country: 'Ethiopia', city: 'Addis Ababa', lat: 9.0320, lng: 38.7469 },
    { id: 195, name: 'Accra', country: 'Ghana', city: 'Accra', lat: 5.6037, lng: -0.1870 },
    { id: 196, name: 'Dakar', country: 'Senegal', city: 'Dakar', lat: 14.7167, lng: -17.4677 },
    { id: 197, name: 'Bamako', country: 'Mali', city: 'Bamako', lat: 12.6392, lng: -8.0029 },
    { id: 198, name: 'Khartoum', country: 'Sudan', city: 'Khartoum', lat: 15.5007, lng: 32.5599 },
    { id: 199, name: 'Kampala', country: 'Uganda', city: 'Kampala', lat: 0.3476, lng: 32.5825 },
    { id: 200, name: 'Dar es Salaam', country: 'Tanzania', city: 'Dar es Salaam', lat: -6.7924, lng: 39.2083 },
    { id: 201, name: 'Maputo', country: 'Mozambique', city: 'Maputo', lat: -25.9692, lng: 32.5732 },
    { id: 202, name: 'Lusaka', country: 'Zambia', city: 'Lusaka', lat: -15.3875, lng: 28.3228 },
    { id: 203, name: 'Harare', country: 'Zimbabwe', city: 'Harare', lat: -17.8252, lng: 31.0335 },
    { id: 204, name: 'Gaborone', country: 'Botswana', city: 'Gaborone', lat: -24.6282, lng: 25.9231 },
    { id: 205, name: 'Windhoek', country: 'Namibia', city: 'Windhoek', lat: -22.5609, lng: 17.0658 },
    { id: 206, name: 'Luanda', country: 'Angola', city: 'Luanda', lat: -8.8390, lng: 13.2894 },
    { id: 207, name: 'Kinshasa', country: 'DR Congo', city: 'Kinshasa', lat: -4.4419, lng: 15.2663 },
    { id: 208, name: 'Brazzaville', country: 'Congo', city: 'Brazzaville', lat: -4.2634, lng: 15.2429 },
    { id: 209, name: 'Yaoundé', country: 'Cameroon', city: 'Yaoundé', lat: 3.8480, lng: 11.5021 },
    { id: 210, name: 'Abuja', country: 'Nigeria', city: 'Abuja', lat: 9.0765, lng: 7.3986 },
    { id: 211, name: 'Niamey', country: 'Niger', city: 'Niamey', lat: 13.5127, lng: 2.1126 },
    { id: 212, name: 'Ouagadougou', country: 'Burkina Faso', city: 'Ouagadougou', lat: 12.3714, lng: -1.5197 },
    { id: 213, name: 'Nouakchott', country: 'Mauritania', city: 'Nouakchott', lat: 18.0735, lng: -15.9582 },
    { id: 214, name: 'Rabat', country: 'Morocco', city: 'Rabat', lat: 34.0209, lng: -6.8416 },
    { id: 215, name: 'Algiers', country: 'Algeria', city: 'Algiers', lat: 36.7538, lng: 3.0588 },
    { id: 216, name: 'Tunis', country: 'Tunisia', city: 'Tunis', lat: 36.8065, lng: 10.1815 },
    { id: 217, name: 'Tripoli', country: 'Libya', city: 'Tripoli', lat: 32.8872, lng: 13.1913 },
    
    // Oceania
    { id: 218, name: 'Canberra', country: 'Australia', city: 'Canberra', lat: -35.2809, lng: 149.1300 },
    { id: 219, name: 'Wellington', country: 'New Zealand', city: 'Wellington', lat: -41.2865, lng: 174.7762 },
    { id: 220, name: 'Port Moresby', country: 'Papua New Guinea', city: 'Port Moresby', lat: -9.4438, lng: 147.1803 },
    { id: 221, name: 'Suva', country: 'Fiji', city: 'Suva', lat: -18.1416, lng: 178.4419 },
    { id: 222, name: 'Honiara', country: 'Solomon Islands', city: 'Honiara', lat: -9.4456, lng: 159.9729 },
    { id: 223, name: 'Port Vila', country: 'Vanuatu', city: 'Port Vila', lat: -17.7333, lng: 168.3273 },
    { id: 224, name: 'Apia', country: 'Samoa', city: 'Apia', lat: -13.8315, lng: -171.7663 },
    { id: 225, name: 'Nukuʻalofa', country: 'Tonga', city: 'Nukuʻalofa', lat: -21.1394, lng: -175.2048 },
    { id: 226, name: 'Palikir', country: 'Micronesia', city: 'Palikir', lat: 6.9178, lng: 158.1611 },
    { id: 227, name: 'Majuro', country: 'Marshall Islands', city: 'Majuro', lat: 7.0897, lng: 171.3803 },
    { id: 228, name: 'South Tarawa', country: 'Kiribati', city: 'South Tarawa', lat: 1.3382, lng: 172.9761 },
    { id: 229, name: 'Yaren', country: 'Nauru', city: 'Yaren', lat: -0.5467, lng: 166.9211 }
  ],
  
  'wonders': [
    { id: 201, name: 'Great Wall of China', country: 'China', city: 'Beijing', lat: 40.4319, lng: 116.5704 },
    { id: 202, name: 'Petra', country: 'Jordan', city: 'Wadi Musa', lat: 30.3285, lng: 35.4444 },
    { id: 203, name: 'Christ the Redeemer', country: 'Brazil', city: 'Rio', lat: -22.9519, lng: -43.2105 },
    { id: 204, name: 'Machu Picchu', country: 'Peru', city: 'Cusco', lat: -13.1631, lng: -72.5450 },
    { id: 205, name: 'Chichen Itza', country: 'Mexico', city: 'Yucatan', lat: 20.6843, lng: -88.5678 },
    { id: 206, name: 'Colosseum', country: 'Italy', city: 'Rome', lat: 41.8902, lng: 12.4922 },
    { id: 207, name: 'Taj Mahal', country: 'India', city: 'Agra', lat: 27.1751, lng: 78.0421 },
    { id: 208, name: 'Pyramids of Giza', country: 'Egypt', city: 'Cairo', lat: 29.9792, lng: 31.1342 }
  ],
  
  'asia': [
    { id: 36, name: 'Great Wall', country: 'China', city: 'Beijing', lat: 40.4319, lng: 116.5704 },
    { id: 37, name: 'Taj Mahal', country: 'India', city: 'Agra', lat: 27.1751, lng: 78.0421 },
    { id: 38, name: 'Burj Khalifa', country: 'UAE', city: 'Dubai', lat: 25.1972, lng: 55.2744 },
    { id: 39, name: 'Angkor Wat', country: 'Cambodia', city: 'Siem Reap', lat: 13.4125, lng: 103.8667 },
    { id: 40, name: 'Mount Fuji', country: 'Japan', city: 'Honshu', lat: 35.3606, lng: 138.7278 },
    { id: 41, name: 'Petra', country: 'Jordan', city: 'Wadi Musa', lat: 30.3285, lng: 35.4444 },
    { id: 42, name: 'Forbidden City', country: 'China', city: 'Beijing', lat: 39.9163, lng: 116.3972 },
    { id: 43, name: 'Tokyo Tower', country: 'Japan', city: 'Tokyo', lat: 35.6586, lng: 139.7454 },
    { id: 44, name: 'Singapore Flyer', country: 'Singapore', city: 'Singapore', lat: 1.2894, lng: 103.8631 },
    { id: 45, name: 'Ha Long Bay', country: 'Vietnam', city: 'Quang Ninh', lat: 20.9101, lng: 107.1839 },
    { id: 46, name: 'Blue Mosque', country: 'Turkey', city: 'Istanbul', lat: 41.0054, lng: 28.9768 },
    { id: 47, name: 'Hagia Sophia', country: 'Turkey', city: 'Istanbul', lat: 41.0086, lng: 28.9802 },
    { id: 107, name: 'Beijing', country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074 },
    { id: 108, name: 'Tokyo', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { id: 109, name: 'New Delhi', country: 'India', city: 'New Delhi', lat: 28.6139, lng: 77.2090 },
    { id: 117, name: 'Seoul', country: 'South Korea', city: 'Seoul', lat: 37.5665, lng: 126.9780 },
    { id: 118, name: 'Bangkok', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 }
  ],
  
  'europe': [
    { id: 1, name: 'Eiffel Tower', country: 'France', city: 'Paris', lat: 48.8584, lng: 2.2945 },
    { id: 2, name: 'Colosseum', country: 'Italy', city: 'Rome', lat: 41.8902, lng: 12.4922 },
    { id: 3, name: 'Big Ben', country: 'UK', city: 'London', lat: 51.5007, lng: -0.1246 },
    { id: 4, name: 'Sagrada Familia', country: 'Spain', city: 'Barcelona', lat: 41.4036, lng: 2.1744 },
    { id: 5, name: 'Neuschwanstein Castle', country: 'Germany', city: 'Bavaria', lat: 47.5576, lng: 10.7498 },
    { id: 6, name: 'Leaning Tower of Pisa', country: 'Italy', city: 'Pisa', lat: 43.7230, lng: 10.3964 },
    { id: 7, name: 'Acropolis of Athens', country: 'Greece', city: 'Athens', lat: 37.9715, lng: 23.7257 },
    { id: 8, name: 'Stonehenge', country: 'UK', city: 'Wiltshire', lat: 51.1789, lng: -1.8262 },
    { id: 9, name: 'Louvre Museum', country: 'France', city: 'Paris', lat: 48.8606, lng: 2.3376 },
    { id: 10, name: 'Brandenburg Gate', country: 'Germany', city: 'Berlin', lat: 52.5163, lng: 13.3777 },
    { id: 11, name: 'St. Peter\'s Basilica', country: 'Vatican City', city: 'Rome', lat: 41.9022, lng: 12.4539 },
    { id: 12, name: 'Canals of Venice', country: 'Italy', city: 'Venice', lat: 45.4408, lng: 12.3155 },
    { id: 13, name: 'Alhambra', country: 'Spain', city: 'Granada', lat: 37.1765, lng: -3.5889 },
    { id: 14, name: 'Charles Bridge', country: 'Czech Republic', city: 'Prague', lat: 50.0865, lng: 14.4118 },
    { id: 15, name: 'Tower Bridge', country: 'UK', city: 'London', lat: 51.5055, lng: -0.0754 },
    { id: 101, name: 'London', country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278 },
    { id: 102, name: 'Paris', country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 },
    { id: 103, name: 'Rome', country: 'Italy', city: 'Rome', lat: 41.9028, lng: 12.4964 },
    { id: 104, name: 'Berlin', country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { id: 105, name: 'Madrid', country: 'Spain', city: 'Madrid', lat: 40.4168, lng: -3.7038 },
    { id: 106, name: 'Moscow', country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173 }
  ]
};

// Create a combined array for random mode
CATEGORY_LOCATIONS['random'] = [
  ...CATEGORY_LOCATIONS.famous,
  ...CATEGORY_LOCATIONS.capitals,
  ...CATEGORY_LOCATIONS.wonders,
  ...CATEGORY_LOCATIONS.asia,
  ...CATEGORY_LOCATIONS.europe
].filter((loc, index, self) => 
  index === self.findIndex((l) => l.id === loc.id)
);

function HomePage() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [guess, setGuess] = useState(null);
  const [round, setRound] = useState(1);
  const [gameState, setGameState] = useState('playing');
  const [distance, setDistance] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [previousLocations, setPreviousLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const { user } = useAuth();

  const getLocationsByCategory = () => {
    return CATEGORY_LOCATIONS[selectedCategory] || CATEGORY_LOCATIONS.random;
  };

  const loadRandomLocation = () => {
    const locations = getLocationsByCategory();
    let availableLocations = locations.filter(loc => !previousLocations.includes(loc.id));
    
    if (availableLocations.length === 0) {
      setPreviousLocations([]);
      availableLocations = locations;
    }
    
    const randomIndex = Math.floor(Math.random() * availableLocations.length);
    const newLocation = availableLocations[randomIndex];
    
    setCurrentLocation(newLocation);
    setPreviousLocations(prev => [...prev, newLocation.id].slice(-10));
    setGuess(null);
    setGameState('playing');
    setShowResult(false);
  };

  useEffect(() => {
    if (!showCategorySelector) {
      loadRandomLocation();
    }
  }, [selectedCategory, showCategorySelector]);

  // FIXED SPACEBAR HANDLER
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        e.preventDefault();
        console.log('Spacebar pressed');
        
        if (guess && gameState === 'playing') {
          console.log('Submitting guess via spacebar');
          submitGuess();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guess, gameState]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  // CLASSIC MODE - NO SCORING, just for fun!
  // Just show distance but no points
  const handleGuess = (guessCoords) => {
    setGuess(guessCoords);
  };

  const submitGuess = () => {
    if (!guess || !currentLocation) return;

    const dist = calculateDistance(
      guess.lat, guess.lng,
      currentLocation.lat, currentLocation.lng
    );
    
    setDistance(dist);
    setGameState('result');
    setShowResult(true);
    // NO SCORE BEING SAVED OR TRACKED
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    loadRandomLocation();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategorySelector(false);
    setRound(1);
    setPreviousLocations([]);
  };

  const getScoreColor = (dist) => {
    if (dist < 100) return '#4ade80';
    if (dist < 500) return '#fbbf24';
    if (dist < 1000) return '#f97316';
    return '#94a3b8';
  };

  // Simple message showing only distance
  const getDistanceMessage = (dist) => {
    if (dist < 100) return `Only ${dist}km away! Great guess!`;
    if (dist < 500) return `${dist}km away - Not bad!`;
    if (dist < 1000) return `${dist}km away - Keep practicing!`;
    if (dist < 2000) return `${dist}km away - You'll get closer next time`;
    return `${dist}km away - Way off!`;
  };

  if (showCategorySelector) {
    return (
      <div className="category-selector">
        <h1 className="category-title">Choose Your Adventure</h1>
        <p className="category-subtitle">Select a category to start guessing!</p>
        
        <div className="category-grid">
          {Object.values(CATEGORIES).map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategorySelect(category.id)}
              style={{ '--category-color': category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌍</span>
          <h1>GeoGuessr - Classic</h1>
        </div>
        
        <div className="game-info">
          <div className="round-info">
            <span className="label">ROUND</span>
            <span className="value">{round}</span>
          </div>
          {user && (
            <div className="user-info">
              <span className="value">👤 {user.username}</span>
            </div>
          )}
          <button 
            className="category-button"
            onClick={() => setShowCategorySelector(true)}
          >
            <span>🎮</span>
            {CATEGORIES[selectedCategory]?.name || 'Change Category'}
          </button>
        </div>
      </header>

      <main className="game-main">
        <div className="street-view-container">
          {currentLocation && <MapillaryView location={currentLocation} />}
          
          {showResult && currentLocation && (
            <div className="result-overlay">
              <div className="result-content">
                <div className="result-header">
                  <h2>{getDistanceMessage(distance)}</h2>
                  <div className="distance-badge" style={{ background: getScoreColor(distance) }}>
                    {distance} km
                  </div>
                </div>
                
                <div className="location-reveal">
                  <h3>{currentLocation.name}</h3>
                  <p>{currentLocation.city}, {currentLocation.country}</p>
                </div>
                
                <button className="next-btn" onClick={nextRound}>
                  Next Location →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="bottom-panel">
        <div className="map-container">
          <div className="map-header">
            <span className="map-title">📍 CLICK MAP TO GUESS</span>
            {guess && (
              <span className="guess-coords">
                {guess.lat.toFixed(2)}°, {guess.lng.toFixed(2)}°
              </span>
            )}
          </div>
          
          <div className="guess-map">
            <InteractiveMap 
              onGuess={handleGuess}
              guess={guess}
              actualLocation={currentLocation}
              showResult={showResult}
            />
          </div>
          
          <div className="map-footer">
            <button 
              className="submit-btn" 
              onClick={submitGuess}
              disabled={!guess || gameState === 'result'}
            >
              {!guess ? '📍 CLICK MAP TO GUESS' : '🎯 SUBMIT GUESS'}
            </button>
          </div>
        </div>
      </div>

      {!guess && gameState === 'playing' && (
        <div className="map-hint">
          🔍 Hover over map to enlarge
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/classic" element={<HomePage />} />
          <Route path="/rank" element={
            <PrivateRoute>
              <RankMode />
            </PrivateRoute>
          } />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/lobby" element={
            <PrivateRoute>
              <Lobby />
            </PrivateRoute>
          } />
          <Route path="/duel/:gameId" element={
            <PrivateRoute>
              <DuelMode />
            </PrivateRoute>
          } />
          <Route path="/timetrial" element={
            <PrivateRoute>
              <TimeTrial />
            </PrivateRoute>
          } />
          <Route path="/aimode" element={
            <PrivateRoute>
              <AIMode />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;