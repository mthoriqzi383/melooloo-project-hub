import * as THREE from 'three';

// Replace measured source components with their standalone GLB equivalents.
// All replacement parts retain the same world transforms and section metadata.
export async function applyComplexAssets(root,loader,source,onProgress){
 const catalog=await fetch('./assets/components/catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Complex asset catalog is missing');return r.json();});
 const specs=catalog.assets.filter(a=>a.source===source),lookup=new Map(),sharedMaterials=new Map();root.updateMatrixWorld(true);
 root.traverse(o=>{if(o.isMesh){lookup.set(o.userData.name||o.name,o);for(const m of Array.isArray(o.material)?o.material:[o.material])sharedMaterials.set(m.name,m);}});
 function placements(a){
  if(a.id==='service_pump')return [
   {origin:a.originNative,rename:n=>n,key:'spare'},
   {origin:[38.2,11.4,5.923],rename:n=>n.replace('HF_ROOM_S08_','HF_ROOM_S09_'),key:'workshop',section:'S09'}];
  if(a.id==='air_sensor')return [
   {origin:a.originNative,rename:n=>n,key:'front'},
   {origin:[.3,10,0],rename:n=>n.replace('_AIR_FRONT_','_AIR_MIDDLE_').replace('TempSensorPole.003','TempSensorPole.004'),key:'middle'},
   {origin:[.3,17,0],rename:n=>n.replace('_AIR_FRONT_','_AIR_REAR_').replace('TempSensorPole.003','TempSensorPole.005'),key:'rear'}];
  if(a.id==='solution_probe_station')return [
   {origin:a.originNative,rename:n=>n,key:'loop1'},
   {origin:[2.2,18,.55],rename:n=>n.replace('_PH_1_','_PH_2_').replace('_EC_1_','_EC_2_'),key:'loop2'}];
  return [{origin:a.originNative,rename:n=>n,key:'primary'}];
 }
 for(const a of specs)for(const p of placements(a))for(const n of a.partNames)if(!lookup.has(p.rename(n)))throw Error('Missing source part for '+a.id+': '+p.rename(n));
 // Fetch a few independent assets at once so the public walkthrough does not
 // wait for each model's network round trip before starting the next one.
 const prototypes=new Array(specs.length);let next=0,finished=0;
 await Promise.all(Array.from({length:Math.min(4,specs.length)},async()=>{
  while(next<specs.length){
   const i=next++,a=specs[i];
   prototypes[i]=(await loader.loadAsync('./assets/components/'+a.file+'?v='+a.sha256.slice(0,12))).scene;
   onProgress?.(++finished,specs.length);
  }
 }));
 let count=0,instances=0;
 for(let i=0;i<specs.length;i++){
  const a=specs[i],prototype=prototypes[i];
  prototype.updateMatrixWorld(true);let parts=0;prototype.traverse(o=>{if(o.isMesh)parts++;});if(parts!==a.parts)throw Error('Incomplete GLB component '+a.id);
  for(const p of placements(a)){
  const asset=prototype.clone(true),origin=new THREE.Matrix4().makeTranslation(p.origin[0],p.origin[2],-p.origin[1]);
  asset.matrix.copy(root.matrixWorld.clone().invert().multiply(origin));asset.matrixAutoUpdate=false;
  asset.name='Reusable '+a.id+' '+p.key;asset.userData.asset_id=a.id;root.add(asset);
  asset.traverse(o=>{if(!o.isMesh)return;const n=p.rename(o.userData.name||o.name);o.name=n;o.userData={...o.userData,...lookup.get(n)?.userData,name:n,reusable_component:a.id,section_id:p.section||a.section,component_placement:p.key};
   const share=m=>{const prior=sharedMaterials.get(m.name);if(prior&&!m.name.includes('Label'))return prior;sharedMaterials.set(m.name,m);return m;};o.material=Array.isArray(o.material)?o.material.map(share):share(o.material);
   for(const m of Array.isArray(o.material)?o.material:[o.material]){m.userData.finished=true;m.envMapIntensity=.7;if(m.transparent)m.depthWrite=false;}o.castShadow=!o.material.transparent;o.receiveShadow=true;
  });
  for(const n of a.partNames)lookup.get(p.rename(n)).removeFromParent();count+=parts;instances++;
  }
 }
 root.updateMatrixWorld(true);return{assets:specs.map(a=>a.id),instances,parts:count};
}
