export const getSlots = async (parkingId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 's1', time: '10:00 - 11:00', label: '10:00 - 11:00', available: false },
        { id: 's2', time: '11:00 - 12:00', label: '11:00 - 12:00', available: true },
        { id: 's3', time: '12:00 - 13:00', label: '12:00 - 13:00', available: true },
        { id: 's4', time: '13:00 - 14:00', label: '13:00 - 14:00', available: false },
        { id: 's5', time: '14:00 - 15:00', label: '14:00 - 15:00', available: true },
        { id: 's6', time: '15:00 - 16:00', label: '15:00 - 16:00', available: true },
      ]);
    }, 600);
  });
};

export const createReservation = async ({ parkingId, slotId, price }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reservationId: `RES-${Math.floor(Math.random() * 100000)}`,
        confirmedAt: new Date().toISOString(),
        total: price,
      });
    }, 600);
  });
};
