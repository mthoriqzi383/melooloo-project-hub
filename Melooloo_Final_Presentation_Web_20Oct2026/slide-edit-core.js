/* Text-only slide overrides. The source story, charts, and figures stay intact. */
(() => {
  'use strict';
  const state = new WeakMap();
  const clean = value => String(value ?? '').trim();
  function nodes(root) {
    const canvas = root.querySelector('.story-canvas');
    if (!canvas) return [];
    const walker = document.createTreeWalker(canvas, NodeFilter.SHOW_TEXT);
    const result = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const remembered = state.get(node);
      const raw = remembered && node.nodeValue === remembered.last ? remembered.base : node.nodeValue;
      if (!clean(raw)) continue;
      result.push({node, index:result.length, base:clean(raw), current:clean(node.nodeValue)});
    }
    return result;
  }
  function validPatch(patch, entry) {
    return patch && typeof patch === 'object' && patch.base === entry.base &&
      typeof patch.value === 'string' && patch.value.length <= 2000;
  }
  function apply(root, page, published, draft) {
    const entries = nodes(root);
    for (const entry of entries) {
      const remembered = state.get(entry.node);
      const raw = remembered && entry.node.nodeValue === remembered.last ? remembered.base : entry.node.nodeValue;
      let value = entry.base;
      const approved = published?.slides?.[page]?.text?.[entry.index];
      const proposed = draft?.slides?.[page]?.text?.[entry.index];
      if (validPatch(approved, entry)) value = approved.value;
      if (validPatch(proposed, entry)) value = proposed.value;
      const leading = raw.match(/^\s*/)?.[0] || '';
      const trailing = raw.match(/\s*$/)?.[0] || '';
      const output = leading + value + trailing;
      entry.node.nodeValue = output;
      state.set(entry.node,{base:raw,last:output});
      entry.current = value;
      entry.approved = validPatch(approved, entry) ? approved.value : entry.base;
      entry.proposed = validPatch(proposed, entry) ? proposed.value : null;
    }
    return entries.map(({index,base,current,approved,proposed,node}) => ({
      index,base,current,approved,proposed,
      tag:node.parentElement?.tagName.toLowerCase() || 'text',
      parent:node.parentElement
    }));
  }
  window.MELOOLOO_SLIDE_EDIT_CORE = {apply};
})();
