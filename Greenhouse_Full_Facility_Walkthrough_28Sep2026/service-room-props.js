import * as THREE from 'three';

// Small, room-specific presentation props. All placements sit on existing
// benches/racks or inside existing grade bays. They are a proposed design,
// not an inventory or an approved operating specification.
const geometries={
 box:new THREE.BoxGeometry(1,1,1),
 cylinder:new THREE.CylinderGeometry(1,1,1,12),
 torus:new THREE.TorusGeometry(1,.08,6,22)
};
const materials={
 tray:new THREE.MeshStandardMaterial({name:'Nursery and sample tray recycled PP',color:'#364e48',roughness:.84,metalness:0}),
 pale:new THREE.MeshStandardMaterial({name:'Translucent-look HDPE container',color:'#d1d8cb',roughness:.7,metalness:0}),
 paper:new THREE.MeshStandardMaterial({name:'Matte batch identification card',color:'#efe8d3',roughness:.96,metalness:0,side:THREE.DoubleSide}),
 dark:new THREE.MeshStandardMaterial({name:'Dark rubber and equipment plastic',color:'#344444',roughness:.78,metalness:0}),
 steel:new THREE.MeshStandardMaterial({name:'Brushed stainless small parts',color:'#a7b3ae',roughness:.43,metalness:.7}),
 blue:new THREE.MeshStandardMaterial({name:'Water and EC blue identifier',color:'#438594',roughness:.64,metalness:0}),
 amber:new THREE.MeshStandardMaterial({name:'Amber reagent and service identifier',color:'#ad854e',roughness:.67,metalness:0}),
 green:new THREE.MeshStandardMaterial({name:'Agronomy green identifier',color:'#56846b',roughness:.65,metalness:0}),
 rust:new THREE.MeshStandardMaterial({name:'Muted orange grade identifier',color:'#b27557',roughness:.73,metalness:0})
};

function batcher(scene){
 const batches=new Map(),dummy=new THREE.Object3D();let instanceCount=0;
 function instance(shape,material,position,scale,rotation){
  const key=shape+':'+material;
  if(!batches.has(key))batches.set(key,[]);
  batches.get(key).push({position,scale,rotation});instanceCount++;
 }
 function flush(){
  for(const [key,items] of batches){
   const [shape,material]=key.split(':');
   const mesh=new THREE.InstancedMesh(geometries[shape],materials[material],items.length);
   mesh.name='Proposed service room props / '+key;
   mesh.userData={design_status:'proposed presentation detail',sections:['S04','S07','S09','S17']};
   for(let i=0;i<items.length;i++){
    const a=items[i];dummy.position.set(...a.position);dummy.scale.set(...a.scale);dummy.rotation.set(...(a.rotation||[0,0,0]));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   }
   mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=false;mesh.receiveShadow=true;scene.add(mesh);
  }
  return {drawCalls:batches.size,instances:instanceCount};
 }
 return {instance,flush};
}

export function addServiceRoomProps(scene,layout){
 const rooms=new Map(layout.rooms.map(r=>[r.id,r]));
 const b=batcher(scene),counts={S04:0,S07:0,S09:0,S17:0};
 function put(id,shape,mat,dx,height,dy,sx,sy,sz,rotation){
  const r=rooms.get(id);if(!r)return;
  b.instance(shape,mat,[r.x+dx,r.z+height,-r.y-dy],[sx,sy,sz],rotation);counts[id]++;
 }
 function box(id,mat,dx,height,dy,sx,sy,sz){put(id,'box',mat,dx,height,dy,sx,sy,sz);}
 function cylinder(id,mat,dx,height,dy,r,h){put(id,'cylinder',mat,dx,height,dy,r,h,r);}

 // S04 nursery: shallow rims group the existing pots into moveable flats.
 // ID stakes are on the table edges, never in the central walking aisle.
 for(const x of [.85,2.10])for(const y of [1.78,2.91]){
  for(const side of [-1,1])box('S04','tray',x+side*.30,.92,y,.025,.055,1.12);
  for(const side of [-1,1])box('S04','tray',x,.92,y+side*.56,.625,.055,.025);
 }
 for(const y of [1.65,2.78,3.43])for(const x of [1.16,1.79]){
  box('S04','steel',x,1.03,y,.012,.20,.012);
  box('S04','paper',x,1.13,y,.11,.09,.015);
  box('S04','green',x,1.155,y-.009,.09,.012,.017);
 }
 // Empty flats, stored on the lower shelf of the left nursery bench.
 for(const y of [1.75,2.42,3.09]){
  box('S04','tray',.85,.325,y,.48,.06,.51);
  box('S04','dark',.85,.361,y,.43,.012,.45);
 }

 // S07: reagent bottles are in a catch tray on the existing lower shelf;
 // the A/B stock vessels and metering pumps in the source model stay clear.
 box('S07','tray',1.05,.324,2.60,1.13,.035,.45);
 for(const x of [.50,1.60])box('S07','tray',x,.367,2.60,.026,.075,.45);
 for(const y of [2.38,2.82])box('S07','tray',1.05,.367,y,1.13,.075,.026);
 for(const [x,cap] of [[.66,'blue'],[1.05,'amber'],[1.44,'green']]){
  cylinder('S07','pale',x,.49,2.60,.095,.26);
  cylinder('S07','pale',x,.65,2.60,.047,.065);
  cylinder('S07',cap,x,.69,2.60,.056,.035);
  box('S07','paper',x,.53,2.501,.135,.075,.012);
 }
 // Small graduated check vessel at the clear right edge of the worktop.
 cylinder('S07','pale',1.96,1.025,2.42,.075,.18);
 cylinder('S07','blue',1.96,1.13,2.42,.061,.035);

 // S09: label the existing parts bins rather than duplicating the rack.
 // Rack fronts face the approach from the room's front door.
 for(const [row,mat] of [[0,'blue'],[1,'amber'],[2,'green']])for(let col=0;col<3;col++){
  const x=.18+col*.32,y=.34+row*.79;
  box('S09','paper',x,y,1.906,.185,.06,.008);
  box('S09',mat,x,y+.025,1.896,.155,.012,.009);
 }
 // Pipe couplings and a loop of service hose stay on the bench lower shelf.
 for(const x of [1.42,1.68]){
  cylinder('S09','steel',x,.345,3.35,.075,.07);
  cylinder('S09','dark',x,.388,3.35,.055,.015);
 }
 put('S09','torus','dark',2.20,.345,3.35,.17,.17,.17,[-Math.PI/2,0,0]);
 box('S09','amber',2.57,.337,3.35,.24,.075,.18);

 // S17: grade color cards attach to existing incoming-fruit bays. Sample
 // cases and calibration weights occupy the two otherwise bare bench shelves.
 for(const [x,mat] of [[.80,'green'],[2.00,'amber'],[3.20,'rust']]){
  box('S17','paper',x,.30,.775,.30,.11,.018);
  box('S17',mat,x,.338,.762,.26,.018,.018);
 }
 for(const [x,mat] of [[1.10,'green'],[2.90,'blue']]){
  box('S17','tray',x,.345,3.00,.45,.11,.35);
  box('S17',mat,x,.405,3.00,.41,.022,.31);
  box('S17','steel',x-.105,.48,2.94,.055,.012,.055);
  box('S17','steel',x+.02,.48,2.94,.055,.012,.055);
  box('S17','paper',x,.39,2.811,.28,.06,.009);
 }
 const stats=b.flush();
 return {status:'proposed service-room presentation details',sections:Object.keys(counts),roomInstances:counts,...stats};
}
