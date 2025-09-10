export const formatNumber = (value: number): string => {
  try {
    return new Intl.NumberFormat('uk-UA').format(value);
  } catch {
    return String(value);
  }
};


