'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { theme } from '../../lib/theme';

export default function SuccessScreen() {
  const router = useRouter();
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('reservationData');
    if (data) {
      setReservationData(JSON.parse(data));
    } else {
      router.replace('/parking');
    }
  }, [router]);

  if (!reservationData) return null;

  return (
    <div style={{ padding: theme.spacing.md, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '-20px',
          left: `${15 + i * 15}%`,
          width: '10px',
          height: '20px',
          backgroundColor: [theme.colors.accent, theme.colors.primary, '#FFD700', '#FF69B4'][i % 4],
          animation: `fall ${2 + Math.random()}s linear infinite`,
          animationDelay: `${Math.random()}s`,
          zIndex: 0
        }} />
      ))}

      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 230, 118, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
        animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        zIndex: 1
      }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h1 style={{ fontSize: theme.fontSize.xl, fontWeight: 'bold', marginBottom: theme.spacing.xl, zIndex: 1 }}>Амжилттай!</h1>

      <div style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        width: '100%',
        marginBottom: theme.spacing.xl,
        zIndex: 1
      }}>
        <h2 style={{ fontSize: theme.fontSize.md, fontWeight: 'bold', marginBottom: theme.spacing.md, textAlign: 'center', borderBottom: `1px solid rgba(255,255,255,0.1)`, paddingBottom: theme.spacing.md }}>Захиалгын мэдээлэл</h2>
        
        <div style={detailRowStyle}>
          <span style={{ color: theme.colors.textMuted }}>Зогсоол</span>
          <span style={{ fontWeight: 'bold', textAlign: 'right' }}>{reservationData.parkingName}</span>
        </div>
        <div style={detailRowStyle}>
          <span style={{ color: theme.colors.textMuted }}>Цаг</span>
          <span style={{ fontWeight: 'bold' }}>{reservationData.timeLabel}</span>
        </div>
        <div style={detailRowStyle}>
          <span style={{ color: theme.colors.textMuted }}>Төлсөн дүн</span>
          <span style={{ fontWeight: 'bold', color: theme.colors.accent }}>₮{reservationData.totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ ...detailRowStyle, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
          <span style={{ color: theme.colors.textMuted }}>Гүйлгээний цаг</span>
          <span style={{ fontWeight: 'bold' }}>{reservationData.transactionTime}</span>
        </div>
      </div>

      <button
        onClick={() => router.push('/parking')}
        style={{
          width: '100%',
          backgroundColor: theme.colors.primary,
          color: '#fff',
          padding: '16px',
          borderRadius: theme.borderRadius.md,
          fontWeight: 'bold',
          fontSize: theme.fontSize.md,
          zIndex: 1
        }}
      >
        Нүүр хуудас руу буцах
      </button>
    </div>
  );
}

const detailRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottom: `1px dashed rgba(255,255,255,0.05)`,
  fontSize: theme.fontSize.sm
};
