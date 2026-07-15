export const hiLoSystem = {
  id: 'hi-lo',
  name: 'Hi-Lo',
  description: 'Système de comptage standard Hi-Lo pour les cartes 2–6 / 7–9 / 10–As.',
  trainingChoices: [
    { value: 1, label: '+1' },
    { value: 0, label: '0' },
    { value: -1, label: '−1' },
  ],
  categories: [
    { key: 'low',  label: '2 – 6', hint: 'valeur +1' },
    { key: 'mid',  label: '7 – 9', hint: 'valeur 0' },
    { key: 'high', label: '10 – As', hint: 'valeur −1' },
  ],
  getRankValue(rankCode) {
    if (['2', '3', '4', '5', '6'].includes(rankCode)) return 1;
    if (['7', '8', '9'].includes(rankCode)) return 0;
    return -1;
  },
  getCardCategory(rankCode) {
    if (['2', '3', '4', '5', '6'].includes(rankCode)) return 'low';
    if (['7', '8', '9'].includes(rankCode)) return 'mid';
    return 'high';
  },
};
