
export const price = (p: string | number) => {
    if (!p) {
        return Number(0).toLocaleString('de-DE', {
          style: 'currency',
          currency: 'EUR',
        });
      }
      const priceNumber = Number(p);
      return priceNumber.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
      });
  }