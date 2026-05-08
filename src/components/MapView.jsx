'use client';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../lib/theme';

let scriptPromise = null;

const loadGoogleMaps = (key) => {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,places&language=mn&region=MN`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Google Maps script load failed'));
    document.head.appendChild(script);
  });
  return scriptPromise;
};

export default function MapView({
  center = { lat: 47.918, lng: 106.917 },
  zoom = 14,
  parkings = [],
  routePolyline = null,
  origin = null,
  destination = null,
  onParkingClick = null,
  height = '100vh',
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!key) {
      setError('Google Maps key тохируулаагүй байна');
      return;
    }

    loadGoogleMaps(key)
      .then((google) => {
        if (!mapRef.current) return;
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: false,
          zoomControl: true,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          styles: DARK_MAP_STYLES,
        });
        setLoaded(true);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!loaded || !mapInstance.current || !window.google) return;
    const google = window.google;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    parkings.forEach((p) => {
      const lat = p.lat ?? p.location?.coordinates?.[1];
      const lng = p.lng ?? p.location?.coordinates?.[0];
      if (!lat || !lng) return;

      const available = (p.availableSlots ?? 0) > 0;
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: p.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: available ? theme.colors.accent : theme.colors.error,
          fillOpacity: 0.95,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
        label: { text: 'P', color: '#000', fontSize: '13px', fontWeight: 'bold' },
      });

      const info = new google.maps.InfoWindow({
        content: `<div style="color:#000;font-family:sans-serif;min-width:180px">
          <strong>${escape(p.name)}</strong><br/>
          <small>${escape(p.address || '')}</small><br/>
          <span style="color:${available ? '#00a651' : '#d32f2f'}">
            ${p.availableSlots}/${p.totalSlots} сул
          </span><br/>
          <strong>₮${(p.priceMNT || p.pricePerHour || 0).toLocaleString()}/цаг</strong>
        </div>`,
      });

      marker.addListener('click', () => {
        info.open(mapInstance.current, marker);
        if (onParkingClick) onParkingClick(p);
      });

      markersRef.current.push(marker);
    });
  }, [parkings, loaded, onParkingClick]);

  useEffect(() => {
    if (!loaded || !mapInstance.current || !window.google) return;
    const google = window.google;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (routePolyline) {
      const path = google.maps.geometry.encoding.decodePath(routePolyline);
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#4285F4',
        strokeOpacity: 0.9,
        strokeWeight: 5,
        map: mapInstance.current,
      });

      const bounds = new google.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      mapInstance.current.fitBounds(bounds, 60);
    }
  }, [routePolyline, loaded]);

  useEffect(() => {
    if (!loaded || !mapInstance.current || !window.google) return;
    const google = window.google;

    [origin, destination].forEach((point, idx) => {
      if (!point) return;
      const lat = Array.isArray(point.coordinates) ? point.coordinates[1] : point.lat;
      const lng = Array.isArray(point.coordinates) ? point.coordinates[0] : point.lng;
      if (lat == null || lng == null) return;

      new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        label: { text: idx === 0 ? 'A' : 'B', color: '#fff', fontWeight: 'bold' },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: idx === 0 ? '#1A237E' : '#EF4444',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });
    });
  }, [origin, destination, loaded]);

  if (error) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        color: theme.colors.error,
        padding: theme.spacing.md,
        textAlign: 'center',
      }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {!loaded && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: theme.colors.background,
          color: theme.colors.textMuted,
        }}>
          Map ачаалж байна...
        </div>
      )}
    </div>
  );
}

const escape = (s) => String(s || '').replace(/[<>"']/g, (c) => ({
  '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0a0f1e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#F8FAFC' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0a0f1e' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0f1e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
];
