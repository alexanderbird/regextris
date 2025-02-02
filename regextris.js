window.addEventListener('DOMContentLoaded', main);

function main() {
  setInterval(() => {
    onTick();
  }, 4 * 1000);
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
        const currentCursor = result[0] || 0;
        const matchIndex = bottomRow.indexOf(match, currentCursor + 1);
        match.split('').map((_, i) => result.unshift(matchIndex + i));
        return result;
      }, [])
    ));
    matchIndices.forEach(index => columns[index].removeChild(columns[index].querySelector('.tile')));
  }

  const timer = document.querySelector('.timer');
  timer.classList.add('timer--no-transitions');
  setTimeout(() => timer.classList.add('timer--tick'), 0);
  setTimeout(() => timer.classList.remove('timer--no-transitions'), 10);
  setTimeout(() => timer.classList.remove('timer--tick'), 20);
  const count = 5;
  for (let i = 0; i < count; i++) {
    const column = pick(columns);
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.classList.add('tile--new');

    const letter = pick(letters);
    tile.textContent = letter;
    column.appendChild(tile);
    setTimeout(() => {
      tile.classList.remove('tile--new');
    });
  }
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
