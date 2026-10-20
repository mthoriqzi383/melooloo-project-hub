import * as THREE from 'three';

// Public-map orientation is north-up: model x=east, model y=north. The existing
// 78 x 86 m campus is a proposed fit, not a surveyed Mall Artha Gading roof.
export function addMallArthaGadingContext(scene) {
  const root = new THREE.Group();
  root.name = 'Conceptual Mall Artha Gading / North Jakarta context';
  scene.add(root);
  const counts = {};
  const palettes = {
    earth: 0x928d83, road: 0x30383b, roadEdge: 0x68716b,
    roof: 0xc2c7c1, roofLight: 0xd8d9d1, concrete: 0xaeb7b8,
    glass: 0x688694, darkGlass: 0x48616b, frame: 0xe0e3df,
    blue: 0x688b99, orange: 0xb88354, green: 0x789580,
    white: 0xeeeeea, line: 0xdad9cc, yellow: 0xc5ae69,
    tree: 0x527c65, tree2: 0x6c9471, trunk: 0x665a4c,
    midrise: 0xaab8b8, tower: 0xb4c1c0, parapet: 0xb7c0bd,
    metal: 0x828f91, shadow: 0x78888b, unit: 0xc8d1d0,
  };
  const groups = new Map();
  function box(kind, x, y, bottom, width, depth, height) {
    if (!groups.has(kind)) groups.set(kind, []);
    groups.get(kind).push([x, bottom + height / 2, -y, width, height, depth]);
    counts[kind] = (counts[kind] || 0) + 1;
  }
  const rng = (() => { let n = 7294401; return () => ((n = (1664525 * n + 1013904223) >>> 0) / 4294967296); })();
  function facadeTexture(kind) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cols = kind === 'tower' ? 8 : kind === 'concrete' ? 16 : 12;
    const rows = kind === 'tower' ? 24 : kind === 'concrete' ? 8 : 13;
    const cw = 512 / cols, rh = 512 / rows;
    ctx.fillStyle = kind === 'tower' ? '#aebcbd' : kind === 'concrete' ? '#b9c0b9' : '#bfc7c3';
    ctx.fillRect(0, 0, 512, 512);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = c * cw, y = r * rh, dark = rng() > .82;
      ctx.fillStyle = r % 4 === 0 ? '#a5b3b3' : '#c6ceca';
      ctx.fillRect(x + 1, y + 2, cw - 2, rh - 4);
      ctx.fillStyle = '#818f90';
      ctx.fillRect(x + cw * .12, y + rh * .19, cw * .79, rh * .59);
      ctx.fillStyle = dark ? '#52616a' : (c + r) % 3 === 0 ? '#66818c' : '#809aa1';
      ctx.fillRect(x + cw * .15, y + rh * .21, cw * .73, rh * .53);
      ctx.fillStyle = 'rgba(235,246,242,.30)';
      ctx.fillRect(x + cw * .18, y + rh * .23, cw * .12, rh * .49);
      ctx.fillStyle = '#6e7b7d';
      ctx.fillRect(x + cw * .5, y + rh * .21, cw * .035, rh * .53);
      ctx.fillStyle = '#d2d7d0';
      ctx.fillRect(x, y + rh * .8, cw, rh * .10);
    }
    for (let i = 0; i < 4300; i++) {
      const v = Math.round(90 + rng() * 80);
      ctx.fillStyle = `rgba(${v},${v},${v},.022)`;
      ctx.fillRect(rng() * 512, rng() * 512, 1.5, 1.5);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  // City street datum sits below the proposed production podium and 5 m GH deck.
  box('earth', 39, -120, -20.9, 960, 1300, .75);
  box('road', -97, 8, -20.08, 27, 790, .12); // Yos Sudarso corridor, west
  box('road', 39, -112, -20.07, 340, 23, .12);
  box('road', 157, -2, -20.07, 17, 440, .12);
  box('roadEdge', -78, 8, -20.02, 3.2, 790, .12);
  box('roadEdge', -116, 8, -20.02, 3.2, 790, .12);
  box('roadEdge', 39, -97, -20.02, 340, 2.4, .12);
  box('roadEdge', 39, -127, -20.02, 340, 2.4, .12);
  for (let y = -370; y <= 380; y += 13) {
    box('line', -103.5, y, -19.93, .18, 5, .015);
    box('line', -90.5, y, -19.93, .18, 5, .015);
  }
  for (let x = -120; x <= 180; x += 13) box('line', x, -112, -19.93, 5, .18, .015);
  box('yellow', -97, 8, -19.91, .12, 790, .014);

  // The lower mall body makes it clear that the greenhouse is above a large
  // commercial building. Its facade and roof outline are illustrative.
  box('concrete', 39, 39, -20, 132, 162, 19.95);
  box('roof', 39, 39, -.32, 136, 166, .17);
  box('glass', -27.2, 39, -17.9, .32, 146, 12.4);
  box('glass', 105.2, 39, -17.9, .32, 146, 12.4);
  box('glass', 39, -42.1, -17.9, 116, .32, 12.4);
  box('glass', 39, 120.1, -17.9, 116, .32, 12.4);
  for (let z = -17.8; z < -5.4; z += 3.1) {
    box('frame', -27.45, 39, z, .38, 147, .16);
    box('frame', 105.45, 39, z, .38, 147, .16);
    box('frame', 39, -42.35, z, 117, .38, .16);
    box('frame', 39, 120.35, z, 117, .38, .16);
  }
  for (let y = -33; y < 118; y += 5.3) {
    box('frame', -27.55, y, -17.7, .3, .13, 12.3);
    box('frame', 105.55, y, -17.7, .3, .13, 12.3);
  }
  for (let x = -20; x < 104; x += 5.4) {
    box('frame', x, -42.5, -17.7, .13, .3, 12.3);
    box('frame', x, 120.5, -17.7, .13, .3, 12.3);
  }
  // Colored frontage rhythm refers to the mall's documented colored panels.
  for (let i = 0; i < 21; i++) {
    const color = ['orange', 'blue', 'green'][i % 3];
    box(color, -26.4, -31 + i * 7, -5.2, 1.2, 3.3, 4.45);
  }
  box('darkGlass', -27.8, -16, -15.2, .55, 24, 8.7);
  box('frame', -28.2, -16, -6.6, .8, 25, .42);

  // Roof around the production footprint, with visible service plant, drainage,
  // access bands and perimeter guard. None represents a measured roof detail.
  box('roofLight', -13.7, 43, 4.73, 27.1, 112, .17);
  box('roofLight', 91.5, 43, 4.73, 26.8, 112, .17);
  box('roofLight', 39, 103.2, 4.73, 132, 34, .17);
  box('roofLight', 39, -22.2, 4.73, 132, 43.6, .17);
  for (const [x, y, w, d] of [[-27,39,.65,161],[105,39,.65,161],[39,-41,131,.65],[39,119,131,.65]]) {
    box('parapet', x, y, 4.79, w, d, 1.15);
    box('metal', x, y, 5.96, w, d, .07);
  }
  for (let y = -11; y < 116; y += 6) {
    box('metal', -11, y, 5.01, .08, .9, .035);
    box('metal', 93, y, 5.01, .08, .9, .035);
  }
  for (let x = -17; x <= 100; x += 5) box('metal', x, 101, 5.01, .8, .08, .035);
  for (let i = 0; i < 12; i++) {
    const side = i < 6 ? -16 : 94;
    const y = 13 + (i % 6) * 15;
    box('shadow', side, y, 4.91, 4.8, 3.7, .09);
    box('unit', side, y, 5.0, 3.9, 2.9, 1.25);
    box('metal', side, y, 6.25, 4.1, 3.1, .1);
    for (let j = -1; j <= 1; j++) box('darkGlass', side + j * .85, y, 6.36, .58, .58, .025);
  }
  // Rows of south-facing plant housings are visible from the roof corners.
  for (let i = 0; i < 7; i++) {
    const x = -17 + i * 17;
    box('shadow', x, 108, 4.89, 7.6, 3.5, .06);
    box('unit', x, 108, 4.96, 6.7, 2.7, 1.65);
    box('metal', x, 108, 6.63, 6.9, 2.9, .08);
  }
  for (let y = -36; y <= 107; y += 18) {
    box('white', -23, y, 5.9, .18, .18, 2.1);
    box('white', 101, y, 5.9, .18, .18, 2.1);
  }

  // Avenue trees, planted verges and cars at street level are low-detail
  // silhouettes: visually useful when flying, inexpensive during room walking.
  for (let y = -335; y < 320; y += 15) {
    for (const x of [-123, -72]) {
      box('trunk', x, y, -19.8, .32, .32, 3.25);
      box(y % 2 ? 'tree' : 'tree2', x, y, -16.6, 3.5, 3.5, 3.35);
    }
  }
  for (let x = -40; x <= 130; x += 14) {
    box('trunk', x, -134, -19.8, .3, .3, 2.8);
    box('tree', x, -134, -17, 2.8, 2.8, 3.1);
  }
  for (let i = 0; i < 34; i++) {
    const y = -342 + i * 20.3, lane = i % 2 ? -103 : -91;
    box(i % 5 ? 'white' : 'orange', lane, y, -19.84, 1.75, 3.5, .88);
    box('darkGlass', lane, y - .15, -18.97, 1.42, 1.56, .08);
  }

  // Midrise fabric and the southern MOI mass follow map direction, while all
  // heights, profiles and the construction around the mall remain conceptual.
  const blocks = [
    [-193, 118, 46, 66, 24], [-197, 2, 44, 48, 33], [-185, -77, 56, 62, 28],
    [-42, 203, 47, 55, 25], [35, 210, 54, 56, 41], [119, 194, 50, 74, 33],
    [218, 143, 55, 62, 28], [238, 30, 48, 58, 38], [220, -76, 55, 53, 24],
    [128, -202, 65, 58, 26], [12, -212, 44, 43, 31], [-143, -194, 55, 53, 29],
  ];
  for (const [x, y, w, d, h] of blocks) {
    const height = h + Math.round(rng() * 12);
    box('midrise', x, y, -20, w, d, height);
    box('roof', x, y, -20 + height, w + .7, d + .7, .28);
    for (let k = 0; k < 4; k++) {
      box('darkGlass', x - w / 2 - .08, y - d / 2 + 6 + k * (d - 12) / 3, -13, .12, 2.7, height - 12);
      box('darkGlass', x + w / 2 + .08, y - d / 2 + 6 + k * (d - 12) / 3, -13, .12, 2.7, height - 12);
    }
  }
  for (const [x, y, h] of [[-197, -240, 76], [-133, -252, 89], [202, -245, 94],
      [241, 227, 67], [-230, 226, 58], [88, 274, 79]]) {
    box('tower', x, y, -20, 24, 27, h);
    box('glass', x - 12.1, y, -17, .13, 22, h - 6);
    box('glass', x + 12.1, y, -17, .13, 22, h - 6);
    for (let z = -12; z < h - 20; z += 4.1) box('frame', x, y, z, 24.3, 27.3, .12);
    box('roofLight', x, y, h - 20, 25, 28, .4);
  }
  // MOI is roughly 0.65 km south of MAG in OpenStreetMap; its skyline form
  // is a distant orientation cue, not a measured replica.
  box('midrise', 55, -590, -20, 196, 107, 28);
  box('roofLight', 55, -590, 8, 198, 109, .3);
  for (const x of [-25, 103, 151]) box('tower', x, -614, -20, 26, 32, 95 + (x % 3) * 8);

  const geometry = new THREE.BoxGeometry(1, 1, 1), canopy = new THREE.SphereGeometry(.5, 8, 5), dummy = new THREE.Object3D();
  const facades = Object.fromEntries(['concrete', 'midrise', 'tower'].map(kind => [kind, facadeTexture(kind)]));
  for (const [kind, placements] of groups) {
    let material = new THREE.MeshStandardMaterial({color: palettes[kind], roughness: kind === 'glass' || kind === 'darkGlass' ? .38 : .87, metalness: kind === 'metal' ? .54 : .08});
    if (facades[kind]) {
      const wall = new THREE.MeshStandardMaterial({map:facades[kind],color:0xffffff,roughness:.68,metalness:.04});
      const cap = new THREE.MeshStandardMaterial({color:kind==='concrete'?0xb6bebb:0xbfc9c7,roughness:.9});
      material = [wall,wall,cap,cap,wall,wall];
    }
    const mesh = new THREE.InstancedMesh(kind === 'tree' || kind === 'tree2' ? canopy : geometry, material, placements.length);
    mesh.name = 'Jakarta context / ' + kind;
    for (let i = 0; i < placements.length; i++) {
      const [x, y, z, sx, sy, sz] = placements[i];
      dummy.position.set(x, y, z); dummy.scale.set(sx, sy, sz); dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.computeBoundingSphere();
    root.add(mesh);
  }
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1010, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'varying vec3 vP; void main(){float t=clamp((normalize(vP).y+.06)*1.35,0.0,1.0);vec3 horizon=vec3(.79,.84,.85);vec3 zenith=vec3(.45,.64,.77);gl_FragColor=vec4(mix(horizon,zenith,smoothstep(0.0,1.0,t)),1.0);}'
  }));
  sky.name = 'Jakarta daylight sky gradient'; sky.frustumCulled = false; root.add(sky);
  return {reference:'Mall Artha Gading, Jl. Artha Gading Selatan No. 1, Jakarta Utara', orientation:'model axes: +x east, +y north', proposed:true, instances:Object.values(counts).reduce((a,b)=>a+b,0), groups:counts};
}
