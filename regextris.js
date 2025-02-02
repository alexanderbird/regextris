window.addEventListener('DOMContentLoaded', main);
const tilesPerTick = 5;
const hazardRatio = 0.25;
const consequenceTilesPerHazard = 5;
const tickTime = 10;

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
  let consequences = 0;

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
    matchIndices.forEach(index => {
      const toRemove = columns[index].querySelector('.tile');
      if (!toRemove) {
        return;
      }
      if (toRemove.dataset.consequenceTiles) {
        consequences += Number(toRemove.dataset.consequenceTiles);
      }
      columns[index].removeChild(toRemove);
    });
  }

  const timer = document.querySelector('.timer');
  timer.classList.add('timer--no-transitions');
  setTimeout(() => timer.classList.add('timer--tick'), 0);
  setTimeout(() => timer.classList.remove('timer--no-transitions'), 10);
  setTimeout(() => timer.classList.remove('timer--tick'), 20);
  const tilesToAdd = tilesPerTick + consequences;
  for (let i = 0; i < tilesToAdd; i++) {
    const column = pick(columns);
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.classList.add('tile--new');
    const isHazard = Math.random() < hazardRatio;
    if (isHazard) {
      tile.dataset.consequenceTiles = consequenceTilesPerHazard;
      tile.classList.add('tile--hazard');
    }

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
