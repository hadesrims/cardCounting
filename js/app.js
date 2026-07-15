import { countingSystems, getSystemById } from './counters/index.js';

const TRAINING_MODE = false;
const CARDS_BEFORE_GUESS = 50;

const SUITS = [
  { code: 'S', symbol: '♠', name: 'Pique', color: 'black' },
  { code: 'H', symbol: '♥', name: 'Cœur', color: 'red' },
  { code: 'D', symbol: '♦', name: 'Carreau', color: 'red' },
  { code: 'C', symbol: '♣', name: 'Trèfle', color: 'black' },
];

const RANKS = [
  { code: 'A', label: 'As' },
  { code: '2', label: '2' },
  { code: '3', label: '3' },
  { code: '4', label: '4' },
  { code: '5', label: '5' },
  { code: '6', label: '6' },
  { code: '7', label: '7' },
  { code: '8', label: '8' },
  { code: '9', label: '9' },
  { code: '0', label: '10' },
  { code: 'J', label: 'Valet' },
  { code: 'Q', label: 'Dame' },
  { code: 'K', label: 'Roi' },
];

let deck = [];
let revealedCount = 0;
let viewIndex = -1;
let runningCount = 0;
let guessPhaseActive = false;
let currentSystem = countingSystems[0];

const cardImage = document.getElementById('card-image');
const cardCaption = document.getElementById('card-caption');
const counterPosition = document.getElementById('counter-position');
const counterRemaining = document.getElementById('counter-remaining');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnNew = document.getElementById('btn-new');
const btnNew2 = document.getElementById('btn-new-2');
const cardSection = document.getElementById('card-section');
const trainingPanel = document.getElementById('training-panel');
const trainingHint = document.getElementById('training-hint');
const guessSection = document.getElementById('guess-section');
const guessFields = document.getElementById('guess-fields');
const btnVerify = document.getElementById('btn-verify');
const guessResults = document.getElementById('guess-results');
const footerHint = document.getElementById('footer-hint');
const counterSystemSelect = document.getElementById('counter-system');
const trainingButtonsContainer = document.getElementById('training-buttons');
const systemDescription = document.getElementById('system-description');
const ruleValues = document.getElementById('rule-values');
const ruleCategories = document.getElementById('rule-categories');
const headerSystemName = document.getElementById('system-name');

function getCardImageRemoteUrl(cardCode) {
  return `https://deckofcardsapi.com/static/img/${cardCode}.png`;
}

function getCardImageFallback(card) {
  const fill = card.suitColor === 'red' ? '#d1584a' : '#1c1c1c';
  const rankText = card.rankLabel === '10' ? '10' : card.rankLabel;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="448" viewBox="0 0 320 448">
      <rect x="4" y="4" width="312" height="440" rx="28" ry="28" fill="#f9f4e6" stroke="#1d1d1d" stroke-width="8"/>
      <text x="30" y="70" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="54" font-weight="700" fill="${fill}">${rankText}</text>
      <text x="30" y="118" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="40" fill="${fill}">${card.suitSymbol}</text>
      <text x="160" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="180" fill="${fill}" opacity="0.18">${card.suitSymbol}</text>
      <text x="30" y="420" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="24" fill="#333">${card.suitName}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createDeck(system) {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        code: rank.code + suit.code,
        rankLabel: rank.label,
        suitSymbol: suit.symbol,
        suitName: suit.name,
        suitColor: suit.color,
        hiLo: system.getRankValue(rank.code),
        category: system.getCardCategory(rank.code),
        imageUrl: getCardImageRemoteUrl(rank.code + suit.code),
      });
    }
  }
  return deck;
}

function shuffleDeck(sourceDeck) {
  const shuffled = [...sourceDeck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderCard() {
  const card = deck[viewIndex];
  if (!card) return;
  cardImage.alt = `${card.rankLabel} de ${card.suitName}`;
  cardImage.src = card.imageUrl;
  cardImage.onerror = () => {
    cardImage.src = getCardImageFallback(card);
  };
  cardCaption.textContent = `${card.rankLabel} ${card.suitSymbol}`;
  cardCaption.style.color = card.suitColor === 'red' ? 'var(--red-suit)' : 'var(--cream)';
}

function updateCounter() {
  counterPosition.textContent = `${viewIndex + 1} / ${deck.length}`;
  counterRemaining.textContent = `${deck.length - revealedCount}`;
  const atFrontier = viewIndex === revealedCount - 1;
  btnPrev.disabled = viewIndex <= 0;
  btnNext.disabled = viewIndex >= deck.length - 1 && !(TRAINING_MODE && atFrontier);
}

function refreshTrainingPanel() {
  const atFrontier = viewIndex === revealedCount - 1 && revealedCount > 0;
  const shouldShow = TRAINING_MODE && atFrontier && !guessPhaseActive;
  trainingPanel.hidden = !shouldShow;
  if (shouldShow) trainingHint.textContent = '';
}

function goNext() {
  if (guessPhaseActive) return;
  if (viewIndex < revealedCount - 1) {
    viewIndex++;
    renderCard();
    updateCounter();
    refreshTrainingPanel();
    return;
  }
  if (TRAINING_MODE) {
    showTrainingHint('Répondez d’abord à la valeur Hi-Lo de cette carte.');
    return;
  }
  revealNextCard();
}

function goPrev() {
  if (guessPhaseActive) return;
  if (viewIndex <= 0) return;
  viewIndex--;
  renderCard();
  updateCounter();
  refreshTrainingPanel();
}

function revealNextCard() {
  if (revealedCount >= deck.length) return;
  revealedCount++;
  viewIndex = revealedCount - 1;
  updateRunningCount(deck[viewIndex]);
  renderCard();
  updateCounter();
  refreshTrainingPanel();
  checkEndGameTrigger();
}

function updateRunningCount(card) {
  runningCount += card.hiLo;
}

function showTrainingHint(message) {
  trainingHint.textContent = message;
}

function submitTrainingAnswer(value) {
  if (!TRAINING_MODE || guessPhaseActive) return;
  if (viewIndex !== revealedCount - 1) return;
  const card = deck[viewIndex];
  if (value === card.hiLo) {
    revealNextCard();
  } else {
    showTrainingHint('Incorrect, réessayez.');
  }
}

function checkEndGameTrigger() {
  if (!guessPhaseActive && revealedCount >= CARDS_BEFORE_GUESS) {
    enterGuessPhase();
  }
}

function enterGuessPhase() {
  guessPhaseActive = true;
  cardSection.hidden = true;
  guessSection.hidden = false;
  guessResults.hidden = true;
  guessResults.innerHTML = '';
  buildGuessFields();
  guessFields.querySelectorAll('input').forEach((input) => {
    input.value = 0;
    input.disabled = false;
  });
  btnVerify.disabled = false;
  footerHint.textContent = '';
}

function buildGuessFields() {
  guessFields.innerHTML = '';
  currentSystem.categories.forEach((category) => {
    const field = document.createElement('div');
    field.className = 'guess-field';
    field.innerHTML = `
      <label for="input-${category.key}">${category.label}</label>
      <small>${category.hint}</small>
      <input type="number" id="input-${category.key}" min="0" value="0">
    `;
    guessFields.appendChild(field);
  });
}

function buildTrainingButtons() {
  trainingButtonsContainer.innerHTML = '';
  currentSystem.trainingChoices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.value = String(choice.value);
    button.textContent = choice.label;
    button.addEventListener('click', () => submitTrainingAnswer(Number(choice.value)));
    trainingButtonsContainer.appendChild(button);
  });
}

function checkRemainingGuess() {
  if (!guessPhaseActive) return;
  const remaining = deck.slice(revealedCount);
  const actual = currentSystem.categories.reduce((acc, category) => {
    acc[category.key] = 0;
    return acc;
  }, {});
  remaining.forEach((card) => {
    actual[card.category] = (actual[card.category] || 0) + 1;
  });

  const guessed = currentSystem.categories.reduce((acc, category) => {
    const input = document.getElementById(`input-${category.key}`);
    acc[category.key] = Number.parseInt(input.value, 10) || 0;
    return acc;
  }, {});

  const diff = currentSystem.categories.reduce((acc, category) => {
    acc[category.key] = guessed[category.key] - actual[category.key];
    return acc;
  }, {});

  const exactMatches = Object.values(diff).filter((d) => d === 0).length;
  const totalAbsError = Object.values(diff).reduce((sum, d) => sum + Math.abs(d), 0);

  const rowsHtml = currentSystem.categories
    .map((category) => formatRow(
      category.label,
      guessed[category.key],
      actual[category.key],
      diff[category.key],
    ))
    .join('');

  const signedRC = runningCount > 0 ? `+${runningCount}` : `${runningCount}`;

  guessResults.innerHTML = `
    ${rowsHtml}
    <div class="row"><span>Score</span><span>${exactMatches}/3 catégories exactes (écart total : ${totalAbsError})</span></div>
    <div class="row final"><span>Running Count final</span><span>${signedRC}</span></div>
  `;
  guessResults.hidden = false;

  guessFields.querySelectorAll('input').forEach((input) => {
    input.disabled = true;
  });
  btnVerify.disabled = true;
}

function formatRow(label, guessedValue, actualValue, diff) {
  const cls = diff === 0 ? 'ok' : 'ko';
  const diffText = diff === 0 ? 'exact' : (diff > 0 ? `+${diff}` : `${diff}`);
  return `<div class="row"><span>${label}</span><span class="${cls}">réel : ${actualValue} — vous : ${guessedValue} (${diffText})</span></div>`;
}

function newGame() {
  deck = shuffleDeck(createDeck(currentSystem));
  revealedCount = 0;
  viewIndex = -1;
  runningCount = 0;
  guessPhaseActive = false;
  cardSection.hidden = false;
  guessSection.hidden = true;
  guessResults.hidden = true;
  footerHint.textContent = '→ carte suivante   ← revoir   Espace nouvelle partie';
  buildTrainingButtons();
  renderSystemRules();
  revealNextCard();
}

function renderSystemRules() {
  systemDescription.textContent = currentSystem.description;
  ruleValues.innerHTML = `
    <table class="rule-table">
      <thead>
        <tr><th>Carte</th><th>Valeur</th></tr>
      </thead>
      <tbody>
        ${RANKS.map((rank) => {
          const value = currentSystem.getRankValue(rank.code);
          return `<tr><td>${rank.label}</td><td>${value > 0 ? `+${value}` : value}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
  ruleCategories.innerHTML = currentSystem.categories
    .map((category) => `<div class="rule-tag">${category.label} — ${category.hint}</div>`)
    .join('');
}

function populateSystemSelector() {
  counterSystemSelect.innerHTML = countingSystems
    .map((system) => `<option value="${system.id}">${system.name}</option>`)
    .join('');
  counterSystemSelect.value = currentSystem.id;
}

function updateCurrentSystem(systemId) {
  currentSystem = getSystemById(systemId);
  document.title = `Comptage ${currentSystem.name} — Entraînement Blackjack`;
  headerSystemName.textContent = currentSystem.name;
}

counterSystemSelect.addEventListener('change', (event) => {
  updateCurrentSystem(event.target.value);
  newGame();
});

btnNext.addEventListener('click', goNext);
btnPrev.addEventListener('click', goPrev);
btnNew.addEventListener('click', newGame);
btnNew2.addEventListener('click', newGame);
btnVerify.addEventListener('click', checkRemainingGuess);

document.addEventListener('keydown', (event) => {
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      goNext();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      goPrev();
      break;
    case ' ':
      event.preventDefault();
      newGame();
      break;
    case '+':
    case '=':
      submitTrainingAnswer(1);
      break;
    case '0':
      submitTrainingAnswer(0);
      break;
    case '-':
      submitTrainingAnswer(-1);
      break;
  }
});

updateCurrentSystem(currentSystem.id);
populateSystemSelector();
newGame();
