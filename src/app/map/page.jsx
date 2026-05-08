'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MapView from '../../components/MapView';
import VoiceButton from '../../components/VoiceButton';
import { fetchParkingsNearby } from '../../services/parkingMock';
import api from '../../services/apiClient';
import { theme } from '../../lib/theme';

const UB_CENTER = { lat: 47.918, lng: 106.917 };

const cleanVoiceQuery = (text) => {
  if (!text) return '';
  let q = text.trim();
  q = q.replace(/^(шинж|хайя|хайх|шангри[\s-]?ла|шангри|яв|явъя|чиглэ)\s+/i, '');
  q = q.replace(/\s+(руу|рүү|тийш|хүртэл|явъя|яв|хүр|чиглэ|байна\s+уу|зогсоол|хайх|олж\s+өг)\s*$/i, '');
  q = q.replace(/[.,!?]/g, '').trim();
  return q;
};

export default function MapScreen() {
  const router = useRouter();
  const [parkings, setParkings] = useState([]);
  const [route, setRoute] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadNearby(UB_CENTER.lat, UB_CENTER.lng);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setOrigin({ lat: latitude, lng: longitude });
          loadNearby(latitude, longitude);
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  const loadNearby = async (lat, lng) => {
    setLoading(true);
    try {
      const list = await fetchParkingsNearby({ lat, lng, radius: 3000 });
      setParkings(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inflightRef = useRef(false);
  const originRef = useRef(null);
  useEffect(() => { originRef.current = origin; }, [origin]);

  const handleSearch = useCallback(async (query) => {
    let cleaned = cleanVoiceQuery(query);
    if (!cleaned || cleaned.length < 2) {
      setError('Хайх хаягаа бичнэ үү (2-оос дээш үсэг)');
      return;
    }
    if (inflightRef.current) return;
    inflightRef.current = true;

    setLoading(true);
    setError(null);
    try {
      const o = originRef.current;
      const originPayload = o?.lat && o?.lng
        ? { coordinates: [o.lng, o.lat] }
        : 'Сүхбаатарын талбай, Улаанбаатар';

      let res;
      try {
        res = await api.searchRoute({
          origin: originPayload,
          destination: cleaned,
          parkingRadius: 1500,
        });
      } catch (firstErr) {
        if (firstErr.status === 400 && firstErr.message?.includes('олдсонгүй')) {
          try {
            const ai = await api.voiceChat(cleaned);
            const aiData = ai.data || ai;
            if (aiData.destination && aiData.destination !== cleaned) {
              cleaned = aiData.destination;
              setSearch(cleaned);
              if (aiData.corrected) {
                setError(`💡 "${aiData.originalText || query}" → "${cleaned}"`);
              }
              res = await api.searchRoute({
                origin: originPayload,
                destination: cleaned,
                parkingRadius: 1500,
              });
            } else {
              throw firstErr;
            }
          } catch (aiErr) {
            throw firstErr;
          }
        } else {
          throw firstErr;
        }
      }

      const data = res.data;
      if (data.bestRoute) setRoute(data.bestRoute);
      setOrigin(data.origin);
      setDestination(data.destination);

      if (data.parkings?.length) {
        setParkings(data.parkings.map((p) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          address: p.address,
          lat: p.location.coordinates[1],
          lng: p.location.coordinates[0],
          priceMNT: p.pricePerHour,
          available: p.availableSlots > 0,
          totalSlots: p.totalSlots,
          availableSlots: p.availableSlots,
          score: p.score,
        })));
      }
    } catch (e) {
      setError(e.message || 'Хайлт амжилтгүй');
    } finally {
      inflightRef.current = false;
      setLoading(false);
    }
  }, []);

  const handleVoice = useCallback(async (transcript) => {
    if (!transcript) return;
    setSearch(transcript);
    setError(null);

    try {
      const ai = await api.voiceChat(transcript);
      const data = ai.data || ai;

      if (data.corrected && data.originalText && data.destination) {
        setError(`💡 "${data.originalText}" → "${data.destination}" гэж ойлгов`);
      }

      if (data.destination) {
        setSearch(data.destination);
        handleSearch(data.destination);
        return;
      }

      if (data.responseText) {
        setError(data.responseText);
        return;
      }
    } catch (e) {
      console.warn('AI parse failed, using rule-based:', e.message);
    }

    handleSearch(cleanVoiceQuery(transcript));
  }, [handleSearch]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '64px' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: theme.spacing.md,
        background: 'linear-gradient(180deg, rgba(10,15,30,0.95) 60%, rgba(10,15,30,0))',
      }}>
        <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Хаашаа явах вэ?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: theme.borderRadius.md,
              border: 'none',
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontSize: theme.fontSize.md,
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSearch(search)}
            disabled={loading || !search.trim()}
            style={{
              padding: '12px 16px',
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.primary,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: theme.fontSize.sm,
              opacity: (loading || !search.trim()) ? 0.5 : 1,
              cursor: (loading || !search.trim()) ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '...' : 'Хайх'}
          </button>
          <VoiceButton onTranscript={handleVoice} />
        </div>
        {error && (
          <div style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: theme.colors.error,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fontSize.sm,
          }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapView
          center={origin || UB_CENTER}
          parkings={parkings}
          routePolyline={route?.polyline}
          origin={origin}
          destination={destination}
          onParkingClick={setSelected}
          height="calc(100vh - 64px)"
        />

        {route && (
          <div style={{
            position: 'absolute',
            top: '90px', left: theme.spacing.md, right: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            display: 'flex', justifyContent: 'space-between',
            zIndex: 5,
          }}>
            <div>
              <div style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm }}>Зам</div>
              <div style={{ fontWeight: 'bold' }}>
                {(route.distanceMeters / 1000).toFixed(1)} км
              </div>
            </div>
            <div>
              <div style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm }}>Хугацаа</div>
              <div style={{ fontWeight: 'bold', color: theme.colors.accent }}>
                {Math.round(route.durationInTrafficSeconds / 60)} мин
              </div>
            </div>
            <div>
              <div style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm }}>Түгжрэл</div>
              <div style={{
                fontWeight: 'bold',
                color: route.trafficLevel === 'high' ? theme.colors.error
                  : route.trafficLevel === 'moderate' ? '#FFA726'
                  : theme.colors.accent,
              }}>
                {route.trafficLevel === 'high' ? 'Их' : route.trafficLevel === 'moderate' ? 'Дунд' : 'Багa'}
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div style={{
            position: 'absolute',
            bottom: theme.spacing.md,
            left: theme.spacing.md, right: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            zIndex: 5,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: theme.fontSize.md, fontWeight: 'bold' }}>
                  {selected.name}
                </h3>
                <p style={{ margin: '4px 0', color: theme.colors.textMuted, fontSize: theme.fontSize.sm }}>
                  {selected.address}
                </p>
                <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.xs }}>
                  <span style={{ color: theme.colors.accent, fontWeight: 'bold' }}>
                    ₮{(selected.priceMNT || 0).toLocaleString()}/цаг
                  </span>
                  <span style={{ color: theme.colors.textMuted }}>
                    {selected.availableSlots}/{selected.totalSlots} сул
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ color: theme.colors.textMuted, padding: '0 8px' }}
              >✕</button>
            </div>
            <button
              onClick={() => router.push(`/reserve/${selected.id || selected._id}`)}
              style={{
                width: '100%',
                marginTop: theme.spacing.md,
                padding: '12px',
                backgroundColor: theme.colors.primary,
                color: '#fff',
                borderRadius: theme.borderRadius.md,
                fontWeight: 'bold',
              }}
            >
              Захиалах
            </button>
          </div>
        )}

        {loading && (
          <div style={{
            position: 'absolute',
            top: '90px', right: theme.spacing.md,
            padding: '8px 12px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fontSize.sm,
            zIndex: 5,
          }}>
            Уншиж байна...
          </div>
        )}
      </div>
    </div>
  );
}
