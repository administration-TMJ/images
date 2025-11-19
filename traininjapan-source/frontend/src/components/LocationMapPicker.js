import React, { useState, useCallback, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const LocationMapPicker = ({ onLocationSelect, initialPosition }) => {
  const [markerPosition, setMarkerPosition] = useState(
    initialPosition || { lat: 35.6762, lng: 139.6503 } // Default to Tokyo
  );
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (result.results[0]) {
        const formattedAddress = result.results[0].formatted_address;
        setAddress(formattedAddress);
        
        // Extract prefecture from address components
        let prefecture = '';
        const addressComponents = result.results[0].address_components;
        for (const component of addressComponents) {
          if (component.types.includes('administrative_area_level_1')) {
            prefecture = component.long_name;
            break;
          }
        }
        
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: formattedAddress,
            prefecture,
            placeId: result.results[0].place_id
          });
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('Unable to get address');
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  // Handle map click
  const handleMapClick = useCallback((e) => {
    if (e.detail && e.detail.latLng) {
      const { lat, lng } = e.detail.latLng;
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Initial geocoding
  useEffect(() => {
    if (markerPosition && window.google) {
      reverseGeocode(markerPosition.lat, markerPosition.lng);
    }
  }, []); // Only run once on mount

  return (
    <div className="w-full">
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-slate-700 mb-1">
          <strong>📍 Click on the map to select your location</strong>
        </p>
        <p className="text-xs text-slate-600">
          The marker will show your selected location. Address will be automatically detected.
        </p>
      </div>

      <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm">
        <Map
          style={{ width: '100%', height: '450px' }}
          defaultCenter={markerPosition}
          defaultZoom={15}
          onClick={handleMapClick}
          gestureHandling="greedy"
          mapId="location-picker-map"
        >
          <AdvancedMarker position={markerPosition}>
            <Pin background="#0f9d58" glyphColor="#fff" borderColor="#0a7d42" scale={1.2} />
          </AdvancedMarker>
        </Map>
      </div>

      {/* Display selected location info */}
      {address && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm font-medium text-slate-700 mb-2">Selected Location:</p>
          <p className="text-sm text-slate-600 mb-1">
            <strong>Address:</strong> {loading ? 'Loading...' : address}
          </p>
          <p className="text-xs text-slate-500">
            <strong>Coordinates:</strong> {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationMapPicker;
