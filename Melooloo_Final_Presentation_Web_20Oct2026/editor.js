(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const story = window.MELOOLOO_STORY;
  if (!Array.isArray(story) || story.length !== 66) throw new Error('Presentation data missing.');
  const sections = [
    ['Peluang & model',1,7],['Pasar & merek',8,15],['Operasi & teknologi',20,47],
    ['Tim',48,52],['Investasi',53,56],['Kelayakan',57,64],['Penutup',65,66]
  ];
  const reservedPages = new Set([16,17,18,19,45,46]);
  const order = sections.flatMap(([,first,last]) => Array.from({length:last-first+1},(_,i)=>first+i)).filter(n=>!reservedPages.has(n));
  const key = 'melooloo-slide-draft-v1';
  let draft = {schema:1,deck:'Melooloo Final Presentation 60',author:'',slides:{}};
  let page = 1;
  let selected = null;
  let texts = [];
  let api = null;
  let saveTimer;
  let previewAttempts = 0;
  const quickTimers = new Map();
  const pad = n => String(n).padStart(2,'0');
  const status = message => { $('editorStatus').textContent = message; };
  function sanitize(input) {
    if (!input || input.schema !== 1 || typeof input.slides !== 'object') throw new Error('Format draf tidak sesuai.');
    const result = {schema:1,deck:'Melooloo Final Presentation 60',author:String(input.author || '').slice(0,80),slides:{}};
    for (const [number,slide] of Object.entries(input.slides)) {
      const n = Number(number);
      if (!Number.isInteger(n) || n < 1 || n > 66 || reservedPages.has(n) || !slide || typeof slide !== 'object') continue;
      const next = {text:{}};
      for (const [position,patch] of Object.entries(n >= 8 && n <= 15 ? {} : slide.text || {})) {
        const i = Number(position);
        if (!Number.isInteger(i) || i < 0 || i > 500 || !patch || typeof patch.base !== 'string' || typeof patch.value !== 'string') continue;
        if (patch.base.length > 2000 || patch.value.length > 2000 || !patch.value.trim()) continue;
        next.text[i] = {base:patch.base,from:typeof patch.from === 'string' ? patch.from : patch.base,value:patch.value};
      }
      if (typeof slide.note === 'string' && slide.note.trim()) next.note = slide.note.slice(0,2000);
      if (Object.keys(next.text).length || next.note) result.slides[n] = next;
    }
    return result;
  }
  try { const saved = localStorage.getItem(key); if (saved) draft = sanitize(JSON.parse(saved)); }
  catch { status('Draf lama tidak dapat dibuka. Mulai dari draf kosong.'); }
  $('editorName').value = draft.author;
  const fromHash = Number(location.hash.match(/^#slide=(\d+)$/)?.[1]);
  if (Number.isInteger(fromHash) && order.includes(fromHash)) page = fromHash;
  function save() {
    draft.author = $('editorName').value.slice(0,80);
    try { localStorage.setItem(key,JSON.stringify(draft)); status('Draf tersimpan di browser ini.'); }
    catch { status('Penyimpanan browser penuh. Unduh draf sekarang.'); }
    countChanges();
  }
  function countChanges() {
    const count = Object.values(draft.slides).reduce((sum,slide) => sum + Object.keys(slide.text || {}).length + (slide.note ? 1 : 0),0);
    $('changeCount').textContent = `${count} perubahan`;
    $('exportDraft').disabled = count === 0;
    document.querySelectorAll('.slide-row').forEach(row => {
      const slide = draft.slides[row.dataset.page];
      row.querySelector('i').hidden = !slide || (!Object.keys(slide.text || {}).length && !slide.note);
    });
  }
  function buildSlides() {
    const query = $('slideSearch').value.trim().toLocaleLowerCase('id');
    const host = $('slideList'); host.replaceChildren();
    for (const [label,first,last] of sections) {
      let added = false;
      for (let n=first;n<=last;n++) {
        if (reservedPages.has(n)) continue;
        if (query && !`${n} ${story[n-1].title} ${label}`.toLocaleLowerCase('id').includes(query)) continue;
        if (!added) { const group = document.createElement('div');group.className='slide-group';group.textContent=label.toUpperCase();host.append(group);added=true; }
        const button = document.createElement('button');button.type='button';button.className='slide-row';button.dataset.page=n;
        button.setAttribute('aria-current',n===page?'page':'false');
        const number = document.createElement('b');number.textContent=pad(n);
        const title = document.createElement('span');title.textContent=story[n-1].title;
        const dot = document.createElement('i');dot.setAttribute('aria-label','Ada perubahan');
        button.append(number,title,dot);
        button.addEventListener('click',()=>showPage(n));host.append(button);
      }
    }
    if (!host.children.length) {const empty=document.createElement('p');empty.className='slide-group';empty.textContent='Tidak ada slide yang cocok.';host.append(empty);}
    countChanges();
  }
  function syncCurrent() {
    $('currentNumber').textContent=pad(page);
    $('currentTitle').textContent=story[page-1].title;
    const marketing = page >= 8 && page <= 15;
    document.querySelector('.preview-foot .live-dot + span').textContent = marketing ? 'Tulis usulan pada catatan peninjau' : 'Klik teks pada slide untuk mengedit';
    document.querySelector('.inspector-head p').textContent = marketing ? 'Slide pemasaran baru dapat dipratinjau di sini. Tulis usulan perubahan pada catatan peninjau.' : 'Klik teks di pratinjau, atau isi judul dan pembuka di sini.';
    $('prevSlide').disabled=order.indexOf(page)===0;
    $('nextSlide').disabled=order.indexOf(page)===order.length-1;
    document.querySelectorAll('.slide-row').forEach(row=>row.setAttribute('aria-current',Number(row.dataset.page)===page?'page':'false'));
    $('slideNote').value=draft.slides[page]?.note || '';
    history.replaceState(null,'',`#slide=${page}`);
  }
  function showPage(n) {
    page=n;selected=null;$('editCard').hidden=true;syncCurrent();
    if (api) { api.showPage(n); refreshTexts(); }
    else $('deckFrame').src=`index.html?editor=1#slide=${n}`;
  }
  function refreshTexts() {
    if (!api) return;
    texts=api.getTexts();
    syncQuickFields();
    const query=$('textSearch').value.trim().toLocaleLowerCase('id');
    const list=$('textList');list.replaceChildren();
    for (const entry of texts) {
      if (!entry.visible || (query && !entry.current.toLocaleLowerCase('id').includes(query) && !entry.base.toLocaleLowerCase('id').includes(query))) continue;
      const row=document.createElement('button');row.type='button';row.className='text-row';row.dataset.index=entry.index;
      row.setAttribute('aria-selected',entry.index===selected?'true':'false');
      const index=document.createElement('b');index.textContent=pad(entry.index+1);
      const body=document.createElement('span');body.textContent=entry.current;
      const dot=document.createElement('i');dot.hidden=entry.proposed===null;
      row.append(index,body,dot);row.addEventListener('click',()=>selectText(entry.index));list.append(row);
    }
    if (!list.children.length) {const empty=document.createElement('p');empty.className='slide-group';empty.textContent=page >= 8 && page <= 15 ? 'Slide pemasaran baru ditinjau lewat catatan peninjau di bawah.' : 'Tidak ada teks yang cocok.';list.append(empty);}
  }
  function syncQuickFields() {
    const primary=api.getPrimaryTexts();
    for (const [field,index] of [['quickTitle',primary.title],['quickLead',primary.lead]]) {
      const row=$(field+'Row');
      row.hidden=index===null;
      $(field).dataset.index=index===null?'':String(index);
      const entry=texts.find(item=>item.index===index);
      if (entry && document.activeElement!==$(field)) $(field).value=entry.current;
    }
    $('quickUnavailable').hidden=primary.title!==null || primary.lead!==null;
  }
  function selectText(index) {
    selected=index;const entry=texts.find(item=>item.index===index);if (!entry) return;
    $('editCard').hidden=false;$('selectedTag').textContent=`TEKS ${pad(index+1)} · ${entry.tag.toUpperCase()}`;
    $('editValue').value=entry.current;$('originalValue').textContent=entry.base;
    $('charCount').textContent=`${entry.current.length} / 2000`;
    $('savedState').textContent=entry.proposed===null?'Belum diubah':'Draf tersimpan';
    api.highlight(index);refreshTexts();$('editValue').focus();
  }
  function updateText() {
    if (selected===null) return;
    const entry=texts.find(item=>item.index===selected);if (!entry) return;
    const value=$('editValue').value;
    $('charCount').textContent=`${value.length} / 2000`;
    if (!value.trim()) {$('savedState').textContent='Teks tidak boleh kosong';return;}
    setTextPatch(selected,value);
    $('savedState').textContent='Draf tersimpan';
    api.highlight(selected);
  }
  function setTextPatch(index,value) {
    const entry=texts.find(item=>item.index===index);
    if (!entry || !value.trim()) {status('Teks tidak boleh kosong.');return;}
    const slide=draft.slides[page] || {text:{}};
    if (value===entry.approved) delete slide.text[index];
    else slide.text[index]={base:entry.base,from:entry.approved,value};
    if (!Object.keys(slide.text).length && !slide.note) delete draft.slides[page];
    else draft.slides[page]=slide;
    save();api.setDraft(draft);texts=api.getTexts();
    refreshTexts();
    if (selected===index) $('editValue').value=value;
  }
  function connectPreview() {
    if (api) return;
    try {
      const ready=$('deckFrame').contentWindow.MELOOLOO_EDITOR_API;
      if (!ready) {
        if (++previewAttempts < 50) setTimeout(connectPreview,200);
        else status('Pratinjau tidak dapat dibuka. Muat ulang halaman editor.');
        return;
      }
      api=ready;
      api.setDraft(draft);api.showPage(page);refreshTexts();syncCurrent();
      status('Klik teks pada slide atau ubah judul di panel kanan.');
    } catch (error) { console.error(error);status('Pratinjau tidak dapat dibuka. Muat ulang halaman editor.'); }
  }
  $('deckFrame').addEventListener('load',()=>{previewAttempts=0;connectPreview();});
  setTimeout(connectPreview,1000);
  $('slideSearch').addEventListener('input',buildSlides);
  $('textSearch').addEventListener('input',refreshTexts);
  $('prevSlide').addEventListener('click',()=>showPage(order[Math.max(0,order.indexOf(page)-1)]));
  $('nextSlide').addEventListener('click',()=>showPage(order[Math.min(order.length-1,order.indexOf(page)+1)]));
  $('editValue').addEventListener('input',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(updateText,280);});
  $('editValue').addEventListener('blur',()=>{if (saveTimer) {clearTimeout(saveTimer);saveTimer=null;updateText();}});
  for (const field of ['quickTitle','quickLead']) {
    const input=$(field);
    const commit=()=>{
      const index=Number(input.dataset.index);
      if (input.dataset.index!=='' && input.value.trim()) setTextPatch(index,input.value);
    };
    input.addEventListener('input',()=>{
      clearTimeout(quickTimers.get(field));
      quickTimers.set(field,setTimeout(commit,260));
    });
    input.addEventListener('blur',()=>{
      clearTimeout(quickTimers.get(field));
      quickTimers.delete(field);
      commit();
    });
  }
  addEventListener('message',event=>{
    if (event.origin!==location.origin || event.source!==$('deckFrame').contentWindow || event.data?.type!=='melooloo-editor-pick') return;
    if (event.data.page!==page || !Number.isInteger(event.data.index)) return;
    refreshTexts();
    selectText(event.data.index);
  });
  $('resetText').addEventListener('click',()=>{
    if (selected===null) return;
    const entry=texts.find(item=>item.index===selected);if (!entry) return;
    $('editValue').value=entry.approved;updateText();
  });
  $('slideNote').addEventListener('input',()=>{
    const note=$('slideNote').value.slice(0,2000);
    const slide=draft.slides[page] || {text:{}};
    if (note.trim()) slide.note=note; else delete slide.note;
    if (!Object.keys(slide.text).length && !slide.note) delete draft.slides[page];
    else draft.slides[page]=slide;
    save();
  });
  $('editorName').addEventListener('input',save);
  $('fullscreenPreview').addEventListener('click',()=>document.querySelector('.preview-frame').requestFullscreen?.());
  $('exportDraft').addEventListener('click',()=>{
    const payload={...draft,exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(blob);const anchor=document.createElement('a');
    anchor.href=url;anchor.download=`melooloo-slide-draft-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status('Draf diunduh. Kirim berkas ini kepada pemilik presentasi untuk ditinjau.');
  });
  $('importFile').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if (!file) return;
    if (file.size>2_000_000) {status('Berkas draf terlalu besar (maksimal 2 MB).');event.target.value='';return;}
    try {
      const incoming=sanitize(JSON.parse(await file.text()));
      if (Object.keys(draft.slides).length && !confirm('Ganti draf yang tersimpan di browser ini dengan berkas yang dibuka?')) return;
      draft=incoming;$('editorName').value=draft.author;save();buildSlides();
      if (api) {api.setDraft(draft);refreshTexts();}
      status('Draf berhasil dibuka untuk ditinjau.');
    } catch {status('Berkas draf tidak valid.');}
    finally {event.target.value='';}
  });
  setInterval(()=>{
    if (!api) return;
    const current=api.getPage();
    if (current!==page && order.includes(current)) {page=current;selected=null;$('editCard').hidden=true;syncCurrent();refreshTexts();}
  },500);
  buildSlides();syncCurrent();
})();
