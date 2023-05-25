
export const price = (p: string | number) => {
    if (!p) {
        return Number(0).toLocaleString('es', {
          style: 'currency',
          currency: 'EUR',
        });
      }
      const priceNumber = Number(p);
      return priceNumber.toLocaleString('es', {
        style: 'currency',
        currency: 'EUR',
      });
  }