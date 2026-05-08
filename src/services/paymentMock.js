export const processPayment = async ({ amount, method, cardData }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = Date.now() % 2 === 0; // 50% chance success for demo predictability
      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
          message: 'Төлбөр амжилттай',
        });
      } else {
        resolve({
          success: false,
          transactionId: null,
          message: 'Төлбөр амжилтгүй боллоо. Дахин оролдоно уу.',
        });
      }
    }, 800);
  });
};
