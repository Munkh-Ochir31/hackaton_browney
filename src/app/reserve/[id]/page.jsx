'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSlots, createReservation, PARKING_DATA } from '../../../services/api';
import { theme } from '../../../lib/theme';

export default function ReservationScreen() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [parking, setParking] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    const spot = PARKING_DATA.find(p => p.id === id);
    if (spot) {
      setParking(spot);
    }
    
    getSlots(id).then(data => {
      setSlots(data);
      setLoading(false);
    });
  }, [id]);

  const handleReserve = async () => {
    if (!selectedSlot || !parking) return;
    setReserving(true);
    
    const price = parking.priceMNT;
    const res = await createReservation({ parkingId: id, slotId: selectedSlot.id, price });
    
    if (res.success) {
      const reservationData = {
        parkingName: parking.name,
        timeLabel: selectedSlot.label,
        totalPrice: price,
        reservationId: res.reservationId,
      };
      sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
      router.push('/payment');
    } else {
      setReserving(false);
      alert('Захиалга үүсгэхэд алдаа гарлаа.');
    }
  };

  if (!parking) return null;

  return (
    <div style={{ padding: theme.spacing.md, minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.lg, marginTop: theme.spacing.sm }}>
        <button onClick={() => router.back()} style={{ color: theme.colors.text, padding: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 style={{ fontSize: theme.fontSize.lg, fontWeight: 'bold', margin: 0 }}>{parking.name}</h1>
      </div>

      <div style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.xl
      }}>
        <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginBottom: theme.spacing.xs }}>{parking.address}</p>
        <div style={{ fontSize: theme.fontSize.lg, fontWeight: 'bold', color: theme.colors.accent }}>
          ₮{parking.priceMNT.toLocaleString()}/цаг
        </div>
      </div>

      <h2 style={{ fontSize: theme.fontSize.md, fontWeight: 'bold', marginBottom: theme.spacing.md }}>Цаг сонгох</h2>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${theme.colors.surface}`,
            borderTopColor: theme.colors.accent,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing.md,
          marginBottom: 'auto'
        }}>
          {slots.map(slot => (
            <button
              key={slot.id}
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot)}
              style={{
                backgroundColor: selectedSlot?.id === slot.id ? 'rgba(0, 230, 118, 0.1)' : theme.colors.surface,
                border: `1px solid ${selectedSlot?.id === slot.id ? theme.colors.accent : 'transparent'}`,
                borderRadius: theme.borderRadius.md,
                padding: '16px 8px',
                color: slot.available ? theme.colors.text : theme.colors.textMuted,
                opacity: slot.available ? 1 : 0.5,
                fontWeight: selectedSlot?.id === slot.id ? 'bold' : 'normal',
                cursor: slot.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}

      {selectedSlot && (
        <div style={{ marginTop: theme.spacing.xl }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
          }}>
            <span style={{ color: theme.colors.textMuted }}>{selectedSlot.label}</span>
            <span style={{ fontWeight: 'bold', fontSize: theme.fontSize.lg, color: theme.colors.accent }}>
              ₮{parking.priceMNT.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleReserve}
            disabled={reserving}
            style={{
              width: '100%',
              backgroundColor: theme.colors.primary,
              color: '#fff',
              padding: '16px',
              borderRadius: theme.borderRadius.md,
              fontWeight: 'bold',
              fontSize: theme.fontSize.md,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: reserving ? 0.7 : 1,
            }}
          >
            {reserving ? (
               <div style={{
                width: '20px',
                height: '20px',
                border: `2px solid rgba(255,255,255,0.3)`,
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : 'Захиалах үргэлжлүүлэх'}
          </button>
        </div>
      )}
    </div>
  );
}
