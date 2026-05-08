'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fetchParkings } from '../../services/parkingMock';
import { theme } from '../../lib/theme';
import VoiceButton from '../../components/VoiceButton';

export default function ParkingScreen() {
  const router = useRouter();
  const [parkings, setParkings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParkings()
      .then((data) => setParkings(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredParking = useMemo(() => {
    if (!searchQuery) return parkings;
    const lowerQuery = searchQuery.toLowerCase();
    return parkings.filter(p =>
      p.name?.toLowerCase().includes(lowerQuery) ||
      p.address?.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, parkings]);

  const handleVoiceSearch = (transcript) => {
    setSearchQuery(transcript);
  };

  return (
    <div style={{ padding: theme.spacing.md, minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, marginTop: theme.spacing.sm }}>
        <h1 style={{ fontSize: theme.fontSize.xl, fontWeight: 'bold', margin: 0 }}>Зогсоол хайх</h1>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <button
            onClick={() => router.push('/map')}
            style={{
              width: '44px', height: '44px',
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primary,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Map"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
          </button>
          <VoiceButton onTranscript={handleVoiceSearch} />
        </div>
      </div>

      <div style={{ marginBottom: theme.spacing.lg }}>
        <input
          type="text"
          placeholder="Хаяг, нэр хайх..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: theme.borderRadius.md,
            border: 'none',
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            fontSize: theme.fontSize.md,
            outline: 'none',
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
          <div style={{
            width: '32px', height: '32px',
            border: `3px solid ${theme.colors.surface}`,
            borderTopColor: theme.colors.accent,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {filteredParking.map(spot => (
            <div
              key={spot.id || spot._id}
              onClick={() => router.push('/reserve/' + (spot.id || spot._id))}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: theme.fontSize.md, fontWeight: 'bold', margin: 0 }}>{spot.name}</h2>
                <div style={{
                  backgroundColor: spot.available ? 'rgba(0, 230, 118, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: spot.available ? theme.colors.accent : theme.colors.error,
                  padding: '4px 8px',
                  borderRadius: theme.borderRadius.sm,
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}>
                  {spot.available ? 'СУЛ' : 'ДҮҮРСЭН'}
                </div>
              </div>

              <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm, margin: 0 }}>
                {spot.address}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.xs }}>
                <div style={{ fontWeight: 'bold', color: theme.colors.accent }}>
                  ₮{(spot.priceMNT || 0).toLocaleString()}/цаг
                </div>
                <div style={{ display: 'flex', gap: theme.spacing.md, fontSize: theme.fontSize.sm, color: theme.colors.textMuted }}>
                  {spot.distanceKm != null && <span>{spot.distanceKm}км</span>}
                  <span>{spot.availableSlots}/{spot.totalSlots}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredParking.length === 0 && (
            <p style={{ textAlign: 'center', color: theme.colors.textMuted, marginTop: theme.spacing.xl }}>
              Илэрц олдсонгүй.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
