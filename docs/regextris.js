window.addEventListener('DOMContentLoaded', main);
const tilesPerTick = 4;
const tickTime = 20;
const letters = [
  'abcABC123'.repeat(4),
  '-_'.repeat(2),
  '+^$'
].join('').split('')
const colors = [
  { id: 1, foreground: '#FFFEF8', background: '#AF47D2' },
  { id: 2, foreground: '#5D0E41', background: '#FF8F00' },
]

const ENTER_KEY_CODE = 13;

function main() {
  document.body.style.setProperty('--tick-time', `${tickTime}s`);
  let interval = startGameLoop();
  onTick();
  document.querySelector('.input input').addEventListener('keyup', event => {
    if (event.keyCode === ENTER_KEY_CODE) {
      clearInterval(interval);
      interval = startGameLoop();
      onTick();
    }
    onInputChange();
  });
}

function startGameLoop() {
  return setInterval(() => {
    onTick();
  }, tickTime * 1000);
}


function getMatchedTiles() {
  const columns = Array.from(document.querySelectorAll('.board__column'));
  const regex = parseRegex(document.querySelector('.input input').value);
  if (regex) {
    const bottomRow = columns.map(x => x.querySelector('.tile')?.textContent || ' ').join('');
    let matches = Array.from(bottomRow.matchAll(regex));
    const matchIndices = matches
      .map(x => x.toString().split('').map((_, i) => x.index + i))
      .flat();
    const matchedTiles = matchIndices
      .map(index => ({ column: columns[index], tile: columns[index].querySelector('.tile') }))
      .filter(x => !!x.tile);

    const matchedColors = Array.from(new Set(matchedTiles.map(x => x.tile.dataset.color)));
    return { matchedTiles, matchedColors };
  }
  return { matchedTiles: [], matchedColors: [] };
}

function onTick() {
  const columns = Array.from(document.querySelectorAll('.board__column'));

  const { matchedColors, matchedTiles } = getMatchedTiles();
  if (matchedColors.length === 1) {
    matchedTiles.forEach(({ column, tile }) => column.removeChild(tile));
    document.querySelector('.input input').value = '';
    onInputChange();
  }

  const timerSlider = document.querySelector('.timer__slider');
  timerSlider.style.animation = 'none';
  timerSlider.offsetHeight;
  timerSlider.style.animation = null; 
  for (let i = 0; i < tilesPerTick; i++) {
    const column = pick(columns);
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.classList.add('tile--new');
    const color = pick(colors);
    tile.dataset.color = color.id;
    tile.style.setProperty('--color-foreground', color.foreground);
    tile.style.setProperty('--color-background', color.background);

    const letter = pick(letters);
    tile.textContent = letter;
    column.appendChild(tile);
    setTimeout(() => {
      tile.classList.remove('tile--new');
    }, 30);
  }
}

function onInputChange() {
  Array.from(document.querySelectorAll('.board__column')).forEach(column => column.classList.remove('board__column--selected'));
  document.querySelector('.game').classList.remove('game--too-many-colors');
  const { matchedTiles, matchedColors } = getMatchedTiles();
  if (matchedColors.length > 1) {
    document.querySelector('.game').classList.add('game--too-many-colors');
  }
  matchedTiles.forEach(({ tile, column }) => {
    column.classList.add('board__column--selected');
  });
}

function pick(list) {
  return list[Math.round(Math.random() * (list.length - 1))];
}

function parseRegex(text) {
  try {
    return new RegExp(text, 'g');
  } catch(ignored) {
    return false;
  }
}
