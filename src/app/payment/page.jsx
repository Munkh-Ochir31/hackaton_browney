'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { processPayment, checkPaymentStatus } from '../../services/api';
import { theme } from '../../lib/theme';

export default function PaymentScreen() {
  const router = useRouter();
  const [reservationData, setReservationData] = useState(null);
  const [tab, setTab] = useState('qr'); // QPay default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invoice, setInvoice] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const data = sessionStorage.getItem('reservationData');
    if (data) {
      setReservationData(JSON.parse(data));
    } else {
      router.replace('/parking');
    }
    return () => clearInterval(pollRef.current);
  }, [router]);

  const handleCreateInvoice = async () => {
    if (!reservationData?.reservationId) {
      setError('Захиалгын ID олдсонгүй');
      return;
    }
    setLoading(true);
    setError('');

    const res = await processPayment({
      reservationId: reservationData.reservationId,
      amount: reservationData.totalPrice,
      method: tab,
    });

    setLoading(false);
    if (res.success) {
      setInvoice(res);
      startPolling(res.paymentId);
    } else {
      setError(res.message);
    }
  };

  const startPolling = (paymentId) => {
    if (!paymentId) return;
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const status = await checkPaymentStatus(paymentId);
      if (status.paid) {
        clearInterval(pollRef.current);
        sessionStorage.setItem('reservationData', JSON.stringify({
          ...reservationData,
          transactionTime: new Date().toLocaleString('mn-MN'),
          transactionId: paymentId,
        }));
        router.push('/success');
      }
    }, 3000);
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
        textAlign: 'center',
      }}>
        <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginBottom: theme.spacing.xs }}>
          {reservationData.parkingName}
        </p>
        <p style={{ color: theme.colors.text, fontSize: theme.fontSize.md, marginBottom: theme.spacing.sm }}>
          {reservationData.timeLabel}
        </p>
        <div style={{ fontSize: theme.fontSize.xl, fontWeight: 'bold', color: theme.colors.accent }}>
          ₮{(reservationData.totalPrice || 0).toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: theme.spacing.lg, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: theme.borderRadius.md, padding: '4px' }}>
        <button
          onClick={() => setTab('qr')}
          style={tabBtnStyle(tab === 'qr')}
        >
          QPay
        </button>
        <button
          onClick={() => setTab('socialpay')}
          disabled
          style={{ ...tabBtnStyle(false), opacity: 0.4 }}
        >
          SocialPay
        </button>
        <button
          onClick={() => setTab('card')}
          disabled
          style={{ ...tabBtnStyle(false), opacity: 0.4 }}
        >
          Карт
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
        {!invoice ? (
          <div style={{ textAlign: 'center', color: theme.colors.textMuted }}>
            <p>QPay-р төлөх бол доорх товчлуурыг дарна уу</p>
          </div>
        ) : (
          <>
            <div style={{
              width: '220px', height: '220px',
              backgroundColor: '#fff',
              borderRadius: theme.borderRadius.md,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: theme.spacing.md,
              overflow: 'hidden',
            }}>
              {invoice.qrImage ? (
                <img
                  src={invoice.qrImage.startsWith('data:') ? invoice.qrImage : `data:image/png;base64,${invoice.qrImage}`}
                  alt="QPay QR"
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div style={{ color: '#000', textAlign: 'center', padding: '8px', fontSize: '11px' }}>
                  QR байхгүй
                </div>
              )}
            </div>
            <p style={{ color: theme.colors.textMuted, textAlign: 'center', fontSize: theme.fontSize.sm }}>
              QPay app-аас QR уншуулна уу
            </p>
            <div style={{
              marginTop: theme.spacing.md,
              padding: '8px 16px',
              backgroundColor: 'rgba(0,230,118,0.1)',
              color: theme.colors.accent,
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.fontSize.sm,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.colors.accent,
                animation: 'pulse 1.5s infinite',
              }}></div>
              Төлбөр шалгаж байна...
            </div>
          </>
        )}
      </div>

      {error && (
        <div style={{
          color: theme.colors.error,
          marginBottom: theme.spacing.md,
          textAlign: 'center',
          padding: theme.spacing.sm,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: theme.borderRadius.md,
        }}>
          {error}
        </div>
      )}

      {!invoice && (
        <button
          onClick={handleCreateInvoice}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: theme.colors.primary,
            color: '#fff',
            padding: '16px',
            borderRadius: theme.borderRadius.md,
            fontWeight: 'bold',
            fontSize: theme.fontSize.md,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <div style={{
              width: '20px', height: '20px',
              border: `2px solid rgba(255,255,255,0.3)`,
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
          ) : 'QPay invoice үүсгэх'}
        </button>
      )}
    </div>
  );
}

const tabBtnStyle = (active) => ({
  flex: 1,
  padding: '12px',
  borderRadius: theme.borderRadius.sm,
  backgroundColor: active ? theme.colors.surface : 'transparent',
  color: active ? theme.colors.text : theme.colors.textMuted,
  fontWeight: active ? 'bold' : 'normal',
  transition: 'all 0.2s',
});
