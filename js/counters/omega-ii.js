export const omegaIiSystem = {
  id: 'omega-ii',
  name: 'Omega II',
  description: 'Omega II est un système multivariable qui utilise des valeurs positives et négatives larges.',
  trainingChoices: [
    { value: 2, label: '+2' },
    { value: 1, label: '+1' },
    { value: 0, label: '0' },
    { value: -1, label: '−1' },
    { value: -2, label: '−2' },
  ],
  categories: [
    { key: 'low', label: '2 – 6', hint: 'valeur positive' },
    { key: 'mid', label: '7 – 9', hint: 'valeur 0 ou -1' },
    { key: 'high', label: '10 – As', hint: 'valeur négative' },
  ],
  getRankValue(rankCode) {
    if (['2', '3'].includes(rankCode)) return 1;
    if (['4', '5'].includes(rankCode)) return 2;
    if (rankCode === '6') return 1;
    if (rankCode === '7' || rankCode === '8') return 0;
    if (rankCode === '9') return -1;
    if (rankCode === 'A') return 0;
    return -2;
  },
  getCardCategory(rankCode) {
    if (['2', '3', '4', '5', '6'].includes(rankCode)) return 'low';
    if (['7', '8', '9'].includes(rankCode)) return 'mid';
    return 'high';
  },
};
