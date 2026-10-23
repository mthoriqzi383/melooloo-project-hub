(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const first = Number(document.body.dataset.first);
  const last = Number(document.body.dataset.last);
  const kind = document.body.dataset.kind || 'utama';
  if (!Number.isInteger(first) || !Number.isInteger(last) || first > last) throw new Error('Invalid slide range.');
  const source = window.MELOOLOO_ORIGINAL_MARKETING || {};
  const all = Array.isArray(source) ? source : Array.isArray(source.slides) ? source.slides : [
    ...(Array.isArray(source.main) ? source.main : []),
    ...(Array.isArray(source.backup) ? source.backup : [])
  ];
  const manifest = new Map(all.map((item, index) => [Number(item.source ?? item.number ?? item.slide ?? index + 1), item]));
  const format = value => String(value).padStart(2, '0');
  const info = number => {
    const entry = manifest.get(number) || {};
    const rawImage = String(entry.image || entry.src || entry.file || `slides/slide-${format(number)}.png`);
    return {
      number,
      title: String(entry.title || entry.name || (number === 22 ? 'Slide cadangan untuk tanya jawab' : `Slide pemasaran ${number}`)),
      image: rawImage.startsWith('marketing-original/') ? rawImage.slice('marketing-original/'.length) : rawImage,
      text: String(entry.text || '')
    };
  };
  const records = Array.from({length: last - first + 1}, (_, index) => info(first + index));
  const fromHash = () => {
    const number = Number(location.hash.match(/^#slide=(\d+)$/)?.[1]);
    return number >= first && number <= last ? number : first;
  };
  let current = fromHash();
  let drawerBuilt = false;
  let priorFocus;
  const preload = new Set();
  function prefetch(number) {
    if (number < first || number > last || preload.has(number)) return;
    preload.add(number);
    const image = new Image();
    image.src = info(number).image;
  }
  function show(number, changeHash = true) {
    current = Math.max(first, Math.min(last, number));
    const entry = info(current);
    const position = current - first + 1;
    const img = $('slideImage');
    const well = $('slideWell');
    well.classList.add('is-loading');
    $('slideError').hidden = true;
    img.alt = `Slide ${current} dari PowerPoint pemasaran asli: ${entry.title}`;
    img.src = entry.image;
    $('slideTranscript').textContent = entry.text || `Teks slide ${current} belum tersedia.`;
    $('slideText').textContent = $('slideTranscript').textContent;
    $('textModalTitle').textContent = `Slide ${format(current)} · ${entry.title}`;
    $('slideTitle').textContent = entry.title;
    $('slideLabel').textContent = `${kind === 'cadangan' ? 'Cadangan' : 'Materi utama'} · PowerPoint asli · slide ${format(current)}`;
    $('slideCounter').innerHTML = `${format(position)} <span>/ ${format(records.length)}</span>`;
    $('progressFill').style.width = `${position / records.length * 100}%`;
    $('prevButton').disabled = current === first;
    $('nextButton').disabled = current === last;
    document.title = `${format(current)} · ${entry.title} | Melooloo`;
    if (drawerBuilt) for (const button of $('drawerList').querySelectorAll('.slide-choice')) button.setAttribute('aria-current', Number(button.dataset.slide) === current ? 'page' : 'false');
    if (changeHash) history.replaceState(null, '', `#slide=${current}`);
    prefetch(current - 1);
    prefetch(current + 1);
  }
  $('slideImage').addEventListener('load', () => $('slideWell').classList.remove('is-loading'));
  $('slideImage').addEventListener('error', () => {
    $('slideWell').classList.remove('is-loading');
    $('slideError').hidden = false;
    $('slideError').querySelector('span').textContent = `Berkas ${info(current).image} belum tersedia.`;
  });
  function buildDrawer() {
    if (drawerBuilt) return;
    const fragment = document.createDocumentFragment();
    for (const entry of records) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'slide-choice';
      button.dataset.slide = String(entry.number);
      button.setAttribute('aria-current', entry.number === current ? 'page' : 'false');
      const thumb = document.createElement('img');
      thumb.src = entry.image;
      thumb.alt = '';
      thumb.loading = 'lazy';
      thumb.decoding = 'async';
      const body = document.createElement('span');
      const label = document.createElement('b'); label.textContent = `SLIDE ${format(entry.number)}`;
      const title = document.createElement('strong'); title.textContent = entry.title;
      body.append(label, title);
      button.append(thumb, body);
      button.addEventListener('click', () => { show(entry.number); closeDrawer(); });
      fragment.append(button);
    }
    $('drawerList').append(fragment);
    drawerBuilt = true;
  }
  function openDrawer() {
    priorFocus = document.activeElement;
    buildDrawer();
    $('drawer').hidden = false;
    $('scrim').hidden = false;
    $('drawerClose').focus();
    $('drawerList').querySelector('[aria-current="page"]')?.scrollIntoView({block: 'center'});
  }
  function closeDrawer() {
    if ($('drawer').hidden) return;
    $('drawer').hidden = true;
    $('scrim').hidden = true;
    priorFocus?.focus?.();
  }
  let priorTextFocus;
  function openText() {
    priorTextFocus = document.activeElement;
    $('textModal').hidden = false;
    $('textModalClose').focus();
  }
  function closeText() {
    if ($('textModal').hidden) return;
    $('textModal').hidden = true;
    priorTextFocus?.focus?.();
  }
  $('prevButton').addEventListener('click', () => show(current - 1));
  $('nextButton').addEventListener('click', () => show(current + 1));
  $('transcriptButton').addEventListener('click', openText);
  $('textModalClose').addEventListener('click', closeText);
  $('textModal').addEventListener('click', event => { if (event.target === $('textModal')) closeText(); });
  $('contentsButton').addEventListener('click', openDrawer);
  $('drawerClose').addEventListener('click', closeDrawer);
  $('scrim').addEventListener('click', closeDrawer);
  $('fullscreenButton').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (!$('textModal').hidden) closeText(); else closeDrawer(); return; }
    if (!$('textModal').hidden) {
      if (event.key === 'Tab') { event.preventDefault(); $('textModalClose').focus(); }
      return;
    }
    if (!$('drawer').hidden) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(first); }
    else if (event.key === 'End') { event.preventDefault(); show(last); }
    else if (event.key.toLowerCase() === 'f') $('fullscreenButton').click();
  });
  addEventListener('hashchange', () => show(fromHash(), false));
  show(current, false);
})();
