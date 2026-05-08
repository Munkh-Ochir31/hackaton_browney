'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PARKING_DATA } from '../../services/api';
import { theme } from '../../lib/theme';
import VoiceButton from '../../components/VoiceButton';

export default function ParkingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParking = useMemo(() => {
    if (!searchQuery) return PARKING_DATA;
    const lowerQuery = searchQuery.toLowerCase();
    return PARKING_DATA.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.address.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handleVoiceSearch = (transcript) => {
    setSearchQuery(transcript);
  };

  return (
    <div style={{ padding: theme.spacing.md, minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, marginTop: theme.spacing.sm }}>
        <h1 style={{ fontSize: theme.fontSize.xl, fontWeight: 'bold', margin: 0 }}>Зогсоол хайх</h1>
        <VoiceButton onTranscript={handleVoiceSearch} />
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {filteredParking.map(spot => (
          <div 
            key={spot.id}
            onClick={() => router.push('/reserve/' + spot.id)}
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
                whiteSpace: 'nowrap'
              }}>
                {spot.available ? 'СУЛ' : 'ДҮҮРСЭН'}
              </div>
            </div>
            
            <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm, margin: 0 }}>
              {spot.address}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.xs }}>
              <div style={{ fontWeight: 'bold', color: theme.colors.accent }}>
                ₮{spot.priceMNT.toLocaleString()}/цаг
              </div>
              <div style={{ display: 'flex', gap: theme.spacing.md, fontSize: theme.fontSize.sm, color: theme.colors.textMuted }}>
                <span>{spot.distanceKm}км</span>
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
    </div>
  );
}
