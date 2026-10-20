import * as THREE from 'three';

// S13 is a proposed restroom, not a specification of existing mall facilities.
// Detail the current fixtures in place so the room and walking route stay intact.
const laminate=new THREE.MeshStandardMaterial({name:'S13 satin forest laminate',color:'#235040',roughness:.56,metalness:0});
const polished=new THREE.MeshStandardMaterial({name:'S13 satin stainless hardware',color:'#aab7b3',roughness:.32,metalness:.7});
const darkVent=new THREE.MeshStandardMaterial({name:'S13 dark ventilation opening',color:'#3e4d49',roughness:.9,metalness:0});
const ventSlat=new THREE.MeshStandardMaterial({name:'S13 powder coated vent slat',color:'#d2d7d2',roughness:.66,metalness:.22});
const grout=new THREE.MeshStandardMaterial({name:'S13 recessed tile joint',color:'#aeb7b1',roughness:1,metalness:0});
const mirror=new THREE.MeshPhysicalMaterial({name:'S13 polished mirror face',color:'#e6f0ec',metalness:1,roughness:.075,envMapIntensity:1.35,side:THREE.DoubleSide});
const box=new THREE.BoxGeometry(1,1,1);
const dummy=new THREE.Object3D();

function addInstances(scene,name,material,placements){
 const mesh=new THREE.InstancedMesh(box,material,placements.length);
 mesh.name=name;mesh.userData={section_id:'S13',design_status:'proposed presentation fixture detail'};
 placements.forEach((p,i)=>{dummy.position.set(...p.position);dummy.scale.set(...p.scale);dummy.rotation.set(0,0,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
 mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=false;mesh.receiveShadow=true;scene.add(mesh);
 return placements.length;
}

export function addStaffSanitationDetail(facility,scene){
 const nodes=new Map();facility.traverse(o=>{const name=o.userData.name||o.name;if(name.startsWith('WT_')&&name.includes('S13'))nodes.set(name,o);});
 const doorNames=['WT_DoorLeaf_S13_WC1.001','WT_DoorLeaf_S13_WC2.001'];
 const hingeNames=['WT_DoorHinge_S13_WC1.001','WT_DoorHinge_S13_WC2.001'];
 const required=[...doorNames,...hingeNames,'WT_S13_Mirror.001'];
 for(const name of required)if(!nodes.has(name))throw Error('S13 fixture missing: '+name);

 // The existing cubicle leaves move with their Blender-authored hinges.
 // Lift the lower edge to a believable privacy-panel clearance.
 for(const name of doorNames){
  const leaf=nodes.get(name);leaf.material=laminate;leaf.position.y=1.085;leaf.scale.y=1.83;
 }
 for(const name of hingeNames){
  const hinge=nodes.get(name);
  const plate=new THREE.Mesh(new THREE.BoxGeometry(.095,.17,.014),polished);
  plate.name=name+' lever plate';plate.position.set(.60,1.07,.028);hinge.add(plate);
  const lever=new THREE.Mesh(new THREE.BoxGeometry(.16,.018,.025),polished);
  lever.name=name+' door lever';lever.position.set(.66,1.07,.055);hinge.add(lever);
  for(const height of [.34,1.62]){
   const pin=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.085,10),polished);
   pin.name=name+' hinge barrel';pin.position.set(.018,height,.032);hinge.add(pin);
  }
 }
 // A true planar reflection would double scene rendering while walking. A
 // clean, high-metalness face uses the existing static room environment map.
 nodes.get('WT_S13_Mirror.001').material=mirror;

 const tile=[];
 for(let x=49.30;x<=51.30+.001;x+=.50)tile.push({position:[x,5.054,-10],scale:[.005,.002,3.86]});
 for(let y=8.25;y<=11.75+.001;y+=.50)tile.push({position:[50.35,5.054,-y],scale:[2.86,.002,.005]});
 const tileJoints=addInstances(scene,'S13 porcelain floor grout lines',grout,tile);

 // Back-wall extractor cue, above the two cubicles; airflow and duct route
 // are intentionally not asserted by this visual detail.
 const vent=[{position:[50.20,7.44,-11.94],scale:[.48,.30,.012]}];
 addInstances(scene,'S13 vent recess',darkVent,vent);
 const slats=[];
 for(let i=0;i<7;i++)slats.push({position:[50.20,7.32+i*.038,-11.917],scale:[.42,.016,.018]});
 slats.push({position:[49.955,7.44,-11.918],scale:[.018,.31,.025]});
 slats.push({position:[50.445,7.44,-11.918],scale:[.018,.31,.025]});
 const ventPieces=addInstances(scene,'S13 extractor grille and frame',ventSlat,slats)+vent.length;
 return {section:'S13',retintedDoors:doorNames.length,movingDoorHardware:8,mirrorFinish:'environment reflection',tileJoints,ventPieces,designStatus:'proposed, not surveyed'};
}
