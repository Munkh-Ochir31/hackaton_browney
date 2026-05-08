import api from './apiClient';

export const processPayment = async ({ reservationId, amount, method = 'qpay' }) => {
  if (!reservationId) {
    return { success: false, message: 'reservationId дутуу байна' };
  }
  try {
    const res = await api.createInvoice(reservationId);
    const data = res.data || res;
    return {
      success: true,
      transactionId: data.payment?._id || data._id,
      paymentId: data.payment?._id,
      qrText: data.qrText,
      qrImage: data.qrImage,
      urls: data.urls,
      amount,
      method,
      message: 'QPay invoice үүслээ',
    };
  } catch (err) {
    return {
      success: false,
      transactionId: null,
      message: err.message || 'Төлбөр үүсгэж чадсангүй',
    };
  }
};

export const checkPaymentStatus = async (paymentId) => {
  try {
    const res = await api.getPaymentStatus(paymentId);
    const p = res.data || res;
    return {
      paid: p.status === 'paid',
      status: p.status,
    };
  } catch (err) {
    return { paid: false, status: 'unknown' };
  }
};
