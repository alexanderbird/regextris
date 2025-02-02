window.addEventListener('DOMContentLoaded', main);
const tilesPerTick = 5;
const tickTime = 10;
const colors = [
  { id: 1, foreground: '#FFFF80', background: '#26355D' },
  { id: 2, foreground: '#FFFEF8', background: '#AF47D2' },
  { id: 3, foreground: '#5D0E41', background: '#FF8F00' },
  { id: 4, foreground: '#000000', background: '#FFDB00' } 
]

function main() {
  document.body.style.setProperty('--tick-time', `${tickTime}s`);
  setInterval(() => {
    onTick();
  }, tickTime * 1000);
  onTick();
}

const letters = 'aA1'.split('');

function onTick() {
  const columns = Array.from(document.querySelectorAll('.board__column'));

  const regex = parseRegex(document.querySelector('.input input').value.trim());
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
    if (matchedColors.length > 1) {
      console.log('multicolor match; doing nothing');
    } else {
      matchedTiles.forEach(({ column, tile }) => column.removeChild(tile));
    }

  }

  const timer = document.querySelector('.timer');
  timer.classList.add('timer--no-transitions');
  setTimeout(() => timer.classList.add('timer--tick'), 0);
  setTimeout(() => timer.classList.remove('timer--no-transitions'), 10);
  setTimeout(() => timer.classList.remove('timer--tick'), 20);
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
  document.querySelector('.input input').value = '';
}

function pick(list) {
  return list[Math.round(Math.random() * (list.length - 1))];
}

function parseRegex(text) {
  try {
    return new RegExp(text);
  } catch(ignored) {
    return false;
  }

}
