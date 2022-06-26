const container = document.querySelector('#grid');
for (let i = 0; i < 100; i++) {
  const row = document.createElement('div');
  row.classList.add('item');
  row.dataset.id = i;
  row.innerHTML = `${i}`;
  container.appendChild(row);
}

const areaSelector = new AreaSelector({
  element: document.querySelector('#grid'),
  target: '.item',
  datasetKeyForSelected: 'id',
  onSelect: (selected) => {
    console.log(selected);
  },
});
