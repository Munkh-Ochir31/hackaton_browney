'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processPayment } from '../../services/api';
import { theme } from '../../lib/theme';

export default function PaymentScreen() {
  const router = useRouter();
  const [reservationData, setReservationData] = useState(null);
  const [tab, setTab] = useState('card'); // 'card' or 'qr'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = sessionStorage.getItem('reservationData');
    if (data) {
      setReservationData(JSON.parse(data));
    } else {
      router.replace('/parking');
    }
  }, [router]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    const res = await processPayment({
      amount: reservationData.totalPrice,
      method: tab,
      cardData: tab === 'card' ? {} : null
    });
    
    if (res.success) {
      const updatedData = {
        ...reservationData,
        transactionTime: new Date().toLocaleString('mn-MN'),
        transactionId: res.transactionId
      };
      sessionStorage.setItem('reservationData', JSON.stringify(updatedData));
      router.push('/success');
    } else {
      setLoading(false);
      setError(res.message);
    }
  };

  if (!reservationData) return null;

  return (
    <div style={{ padding: theme.spacing.md, minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.lg, marginTop: theme.spacing.sm }}>
        <button onClick={() => router.back()} style={{ color: theme.colors.text, padding: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 style={{ fontSize: theme.fontSize.lg, fontWeight: 'bold', margin: 0 }}>Төлбөр төлөх</h1>
      </div>

      <div style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        textAlign: 'center'
      }}>
        <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginBottom: theme.spacing.xs }}>{reservationData.parkingName}</p>
        <p style={{ color: theme.colors.text, fontSize: theme.fontSize.md, marginBottom: theme.spacing.sm }}>{reservationData.timeLabel}</p>
        <div style={{ fontSize: theme.fontSize.xl, fontWeight: 'bold', color: theme.colors.accent }}>
          ₮{reservationData.totalPrice.toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: theme.spacing.lg, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: theme.borderRadius.md, padding: '4px' }}>
        <button
          onClick={() => setTab('card')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: theme.borderRadius.sm,
            backgroundColor: tab === 'card' ? theme.colors.surface : 'transparent',
            color: tab === 'card' ? theme.colors.text : theme.colors.textMuted,
            fontWeight: tab === 'card' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          Карт
        </button>
        <button
          onClick={() => setTab('qr')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: theme.borderRadius.sm,
            backgroundColor: tab === 'qr' ? theme.colors.surface : 'transparent',
            color: tab === 'qr' ? theme.colors.text : theme.colors.textMuted,
            fontWeight: tab === 'qr' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          QR код
        </button>
      </div>

      {tab === 'card' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, marginBottom: 'auto' }}>
          <input type="text" placeholder="Карт эзэмшигчийн нэр" style={inputStyle} />
          <input type="text" placeholder="Картын дугаар (#### #### #### ####)" style={inputStyle} />
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <input type="text" placeholder="MM/YY" style={{ ...inputStyle, flex: 1 }} />
            <input type="text" placeholder="CVV" style={{ ...inputStyle, flex: 1 }} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto', padding: theme.spacing.xl }}>
          <div style={{
            width: '200px',
            height: '200px',
            backgroundColor: '#fff',
            borderRadius: theme.borderRadius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.md
          }}>
            <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <p style={{ color: theme.colors.textMuted }}>QR уншуулна уу</p>
        </div>
      )}

      {error && (
        <div style={{ color: theme.colors.error, marginBottom: theme.spacing.md, textAlign: 'center', padding: theme.spacing.sm, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: theme.borderRadius.md }}>
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
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
          opacity: loading ? 0.7 : 1,
          marginTop: 'auto'
        }}
      >
        {loading ? (
           <div style={{
            width: '20px',
            height: '20px',
            border: `2px solid rgba(255,255,255,0.3)`,
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        ) : 'Төлбөр төлөх'}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px',
  borderRadius: theme.borderRadius.md,
  border: `1px solid rgba(255,255,255,0.1)`,
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: theme.colors.text,
  fontSize: theme.fontSize.md,
  outline: 'none',
};
