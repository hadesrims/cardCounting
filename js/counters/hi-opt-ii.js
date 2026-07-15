export const hiOptIiSystem = {
  id: 'hi-opt-ii',
  name: 'Hi-Opt II',
  description: 'Hi-Opt II utilise des valeurs plus riches pour 2-7 et isole les As.',
  trainingChoices: [
    { value: 2, label: '+2' },
    { value: 1, label: '+1' },
    { value: 0, label: '0' },
  ],
  categories: [
    { key: 'low', label: '2 – 6', hint: 'valeur positive' },
    { key: 'mid', label: '7 – 9', hint: 'valeur 0' },
    { key: 'high', label: '10 – As', hint: 'valeur 0' },
  ],
  getRankValue(rankCode) {
    if (['2', '3'].includes(rankCode)) return 1;
    if (['4', '5'].includes(rankCode)) return 2;
    if (['6', '7'].includes(rankCode)) return 1;
    return 0;
  },
  getCardCategory(rankCode) {
    if (['2', '3', '4', '5', '6'].includes(rankCode)) return 'low';
    if (['7', '8', '9'].includes(rankCode)) return 'mid';
    return 'high';
  },
};
