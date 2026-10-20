import * as THREE from 'three';

// Visual proposal for the S26 transfer apron. The actual mall loading dock,
// lift interface, traffic control and required clearances have not been surveyed.
function instances(name,geometry,material,placements){
 const mesh=new THREE.InstancedMesh(geometry,material,placements.length);
 mesh.name=name;mesh.userData.design_status='proposed S26 loading interface';
 const p=new THREE.Object3D();
 placements.forEach((v,i)=>{
  p.position.set(v[0],v[1],v[2]);p.rotation.set(0,v[6]||0,0);
  p.scale.set(v[3]||1,v[4]||1,v[5]||1);p.updateMatrix();mesh.setMatrixAt(i,p.matrix);
 });
 mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=false;
 return mesh;
}
function signTexture(){
 const c=document.createElement('canvas');c.width=768;c.height=240;
 const g=c.getContext('2d');g.fillStyle='#244637';g.fillRect(0,0,768,240);
 g.fillStyle='#d6e5d2';g.fillRect(22,21,9,198);
 g.fillStyle='#f0f3e9';g.font='700 72px Arial';g.fillText('BAY 01',58,103);
 g.font='600 36px Arial';g.fillText('COLD CHAIN TRANSFER',60,166);
 g.fillStyle='#b9d1bd';g.font='23px Arial';g.fillText('PROPOSED LOADING INTERFACE',60,207);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}
export function addDockDetail(scene){
 const white=new THREE.MeshStandardMaterial({name:'S26 white traffic marking',color:'#f0efdf',roughness:.98,metalness:0});
 const amber=new THREE.MeshStandardMaterial({name:'S26 amber traffic marking',color:'#dec34d',roughness:.95,metalness:0});
 const housing=new THREE.MeshStandardMaterial({name:'S26 luminaire powdercoat',color:'#5b6865',roughness:.57,metalness:.43});
 const lens=new THREE.MeshStandardMaterial({name:'S26 diffused LED panel',color:'#e8f2e9',roughness:.37,emissive:'#e8f4ed',emissiveIntensity:.75});
 const steel=new THREE.MeshStandardMaterial({name:'S26 dock safety steel',color:'#c89f36',roughness:.55,metalness:.24});
 const stripe=new THREE.MeshStandardMaterial({name:'S26 retroreflective bollard band',color:'#e8e8de',roughness:.4,emissive:'#ffffff',emissiveIntensity:.08});
 const box=new THREE.BoxGeometry(1,1,1);
 // Web X/Z correspond to Blender X/-Y. The truck spans roughly X 11.95–13.65,
 // Z 2.14–5.94. `separateCoplanarFloors` raises the S26 floor by 25 mm to
 // prevent flicker, so paint inside the room must sit above that raised top.
 // The stop line and short side tails step down to the unraised apron.
 // These clearances are conceptual, not surveyed.
 const roomPaintY=.030,apronPaintY=.005;
 const hatchPaint=Array.from({length:9},(_,i)=>[10.25,roomPaintY,.88+i*.57,1.26,.006,.09,-Math.PI/4]);
 const bayPaint=[
  [11.15,roomPaintY,3.16,.12,.006,5.60],
  [11.15,apronPaintY,6.17,.12,.006,.34],
  [14.45,apronPaintY,3.35,.12,.006,5.98],
  [12.55,roomPaintY,.36,2.80,.006,.12],
  [14.225,apronPaintY,.36,.45,.006,.12],
  [12.80,apronPaintY,6.34,3.42,.006,.12],
  ...hatchPaint,
 ];
 const pedestrianPaint=[
  [9.55,roomPaintY,3.21,.09,.006,5.90],
  [10.95,roomPaintY,3.21,.09,.006,5.90],
 ];
 const elements=[
  instances('S26 · vehicle-aligned loading bay paint',box,amber,bayPaint),
  instances('S26 · pedestrian keep-clear hatch paint',box,white,pedestrianPaint),
  instances('S26 · canopy luminaire housings',box,housing,[[9.9,3.114,1.10,.94,.042,.23],[12.95,3.114,1.10,.94,.042,.23],[9.9,3.114,3.56,.94,.042,.23],[12.95,3.114,3.56,.94,.042,.23]]),
  instances('S26 · diffused LED luminaires',box,lens,[[9.9,3.086,1.10,.82,.010,.14],[12.95,3.086,1.10,.82,.010,.14],[9.9,3.086,3.56,.82,.010,.14],[12.95,3.086,3.56,.82,.010,.14]]),
  instances('S26 · protected wall bollards',new THREE.CylinderGeometry(.065,.072,.83,10),steel,[[9.22,.43,.48,1,1,1],[13.78,.43,.48,1,1,1]]),
  instances('S26 · bollard reflector bands',new THREE.CylinderGeometry(.068,.068,.09,10),stripe,[[9.22,.68,.48,1,1,1],[13.78,.68,.48,1,1,1]]),
 ];
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.56,.49),new THREE.MeshStandardMaterial({name:'S26 bay sign',map:signTexture(),roughness:.77,side:THREE.DoubleSide}));
 sign.name='S26 · proposed cold-chain bay identification';sign.position.set(10.52,2.54,.105);sign.userData.design_status='proposed S26 bay identification';elements.push(sign);
 for(const o of elements)scene.add(o);
 return {section:'S26',drawCalls:elements.length,instancedParts:elements.slice(0,-1).reduce((n,m)=>n+m.count,0),status:'proposed; loading dock geometry and clearance unverified'};
}
