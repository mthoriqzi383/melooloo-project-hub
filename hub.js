const search = document.getElementById('page-search');
const rows = [...document.querySelectorAll('.page-row')];
const count = document.getElementById('result-count');
const empty = document.getElementById('empty-state');
search.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const row of rows) {
    const match = (row.textContent + ' ' + row.dataset.keywords).toLocaleLowerCase().includes(query);
    row.hidden = !match;
    if (match) visible++;
  }
  count.textContent = `${visible} ${visible === 1 ? 'page' : 'pages'}`;
  empty.hidden = visible !== 0;
});
