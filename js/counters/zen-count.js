export const zenCountSystem = {
  id: 'zen-count',
  name: 'Zen Count',
  description: "Zen Count attribue des valeurs négatives aux 10 et à l'As pour améliorer la précision.",
  trainingChoices: [
    { value: 2, label: '+2' },
    { value: 1, label: '+1' },
    { value: 0, label: '0' },
    { value: -1, label: '−1' },
    { value: -2, label: '−2' },
  ],
  categories: [
    { key: 'low', label: '2 – 6', hint: 'valeur positive' },
    { key: 'mid', label: '7 – 9', hint: '7 = +1, 8-9 = 0' },
    { key: 'high', label: '10 – As', hint: '10 = -2, As = -1' },
  ],
  getRankValue(rankCode) {
    if (['2', '3'].includes(rankCode)) return 1;
    if (['4', '5', '6'].includes(rankCode)) return 2;
    if (rankCode === '7') return 1;
    if (rankCode === '8' || rankCode === '9') return 0;
    if (rankCode === 'A') return -1;
    return -2;
  },
  getCardCategory(rankCode) {
    if (['2', '3', '4', '5', '6'].includes(rankCode)) return 'low';
    if (['7', '8', '9'].includes(rankCode)) return 'mid';
    return 'high';
  },
};
