window.addEventListener('DOMContentLoaded', main);
const tilesPerTick = 4;
const tickTime = 20;
const letters = 'abcABC123abcABC123abcABC123-'.split('');
const colors = [
  { id: 1, foreground: '#FFFF80', background: '#26355D' },
  { id: 2, foreground: '#FFFEF8', background: '#AF47D2' },
  { id: 3, foreground: '#5D0E41', background: '#FF8F00' },
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
    const matches = bottomRow.match(regex) || [];
    const matchIndices = Array.from(new Set(matches
      .reduce((result, match) => {
        const currentCursor = result.length ? result[0] + 1 : 0;
        const matchIndex = bottomRow.indexOf(match, currentCursor);
        match.split('').map((_, i) => result.unshift(matchIndex + i));
        return result;
      }, [])
    ));
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
    });
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
