import { Card, CardState } from './game.api';

const EMOJIS = ['⏳', '🚀', '🪐', '👽', '☄️', '🌑', '🌟', '🛸', '🤖', '⚡', '🌌', '🔭'];

export function generateDeck(totalCards: number): Card[] {
  const pairsCount = Math.floor(totalCards / 2);

  // Safety check
  if (pairsCount > EMOJIS.length) {
    console.warn('Not enough unique emojis, recycling...');
  }

  const selectedEmojis = EMOJIS.slice(0, pairsCount);
  const deck: Card[] = [];

  selectedEmojis.forEach((emoji) => {
    const createCard = (): Card => ({
      id: crypto.randomUUID(),
      value: emoji,
      state: CardState.HIDDEN,
    });
    deck.push(createCard(), createCard());
  });

  return shuffle(deck);
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
