import api from './apiClient';

export const getSlots = async (parkingId) => {
  const slots = [];
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);

  for (let i = 0; i < 6; i++) {
    const slotStart = new Date(start.getTime() + i * 60 * 60 * 1000);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
    const label = `${pad(slotStart.getHours())}:00 - ${pad(slotEnd.getHours())}:00`;
    slots.push({
      id: `s${i + 1}`,
      time: label,
      label,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      available: true,
    });
  }
  return slots;
};

const pad = (n) => String(n).padStart(2, '0');

export const createReservation = async ({ parkingId, slotId, price, slot, vehiclePlate = 'УБА1234' }) => {
  try {
    const startTime = slot?.startTime || new Date().toISOString();
    const endTime = slot?.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const res = await api.createReservation({
      parkingId,
      vehiclePlate,
      startTime,
      endTime,
    });

    const r = res.data?.reservation || res.data;
    return {
      success: true,
      reservationId: r._id,
      reservationCode: r.reservationCode,
      qrCode: r.qrCode,
      total: r.totalAmount,
      confirmedAt: r.createdAt,
    };
  } catch (err) {
    if (err.status === 401) {
      return { success: false, message: 'Нэвтрэх шаардлагатай', requiresAuth: true };
    }
    return {
      success: false,
      message: err.message || 'Захиалга үүсгэж чадсангүй',
    };
  }
};

export const cancelReservation = async (id) => {
  try {
    await api.cancelReservation(id);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getMyReservations = async (status) => {
  try {
    const res = await api.getMyReservations(status);
    return res.data || [];
  } catch {
    return [];
  }
};
