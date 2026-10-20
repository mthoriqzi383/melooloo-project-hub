import * as THREE from 'three';

// Visual-only finish on the proposed S26 delivery reefer. This is a generic
// insulated van, not a surveyed fleet vehicle or a specified manufacturer.
// Blender X/Y/Z becomes web X/-Z/Y. The existing cargo body spans X
// 11.975–13.625, web Z 2.24–4.72, and web height .68–2.26 metres.
const box=new THREE.BoxGeometry(1,1,1);
const satin=new THREE.MeshStandardMaterial({name:'S26 reefer · satin aluminum side trim',color:'#a1aaa6',roughness:.57,metalness:.50});
const joint=new THREE.MeshStandardMaterial({name:'S26 reefer · insulated-panel shadow joints',color:'#7e8984',roughness:.83,metalness:.06});
const rubber=new THREE.MeshStandardMaterial({name:'S26 reefer · dark rub rail and mudflaps',color:'#35413e',roughness:.92,metalness:0});
const amber=new THREE.MeshStandardMaterial({name:'S26 reefer · amber side markers',color:'#c79543',roughness:.35,metalness:.02,emissive:'#855017',emissiveIntensity:.20});
const red=new THREE.MeshStandardMaterial({name:'S26 reefer · red rear clearance markers',color:'#9f3d38',roughness:.37,metalness:.02,emissive:'#5b1815',emissiveIntensity:.17});

function instanced(scene,name,material,parts){
 const mesh=new THREE.InstancedMesh(box,material,parts.length);
 mesh.name=name;
 mesh.userData={design_status:'proposed generic S26 delivery reefer finish',instance_count:parts.length};
 const dummy=new THREE.Object3D();
 parts.forEach(([x,y,z,w,h,d],i)=>{
  dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();
  mesh.setMatrixAt(i,dummy.matrix);
 });
 mesh.instanceMatrix.needsUpdate=true;
 mesh.computeBoundingSphere();
 mesh.castShadow=false;
 scene.add(mesh);
 return mesh;
}

export function addReeferDetail(scene){
 const parts={satin:[],joint:[],rubber:[],amber:[],red:[]};
 for(const side of [-1,1]){
  const x=12.8+side*.831; // surface .825 from centre; shallow trim laps the shell
  // Almost flush end joints and roof seal give the insulated side a scale.
  for(const z of [2.32,4.61])parts.joint.push([x,1.47,z,.012,1.43,.010]);
  parts.joint.push([x,2.205,3.465,.012,.009,2.30]);
  // Satin edge extrusion, with a restrained dark side-impact rail below the
  // brand already baked into the GLB. Its visible face projects ~25 mm.
  parts.satin.push([x,2.245,3.465,.022,.018,2.30]);
  parts.satin.push([x,1.005,3.465,.034,.012,2.22]);
  parts.rubber.push([x+side*.005,.967,3.465,.036,.055,2.20]);
  for(const z of [2.62,3.46,4.30])parts.satin.push([x,1.005,z,.042,.074,.028]);
  // Cargo side reflectors are mounted on the body, above the existing sill.
  parts.amber.push([x+side*.005,.778,4.49,.030,.049,.124]);
  parts.amber.push([x+side*.005,2.116,4.51,.030,.047,.105]);
  parts.red.push([x+side*.005,.778,2.45,.030,.049,.124]);
  parts.red.push([x+side*.005,2.116,2.45,.030,.047,.105]);
  // A small cab side repeater complements the existing front headlights.
  parts.amber.push([12.8+side*.818,.945,5.575,.030,.046,.118]);
  // Rear mudflap falls behind the existing wheel, inside the original width.
  parts.rubber.push([12.8+side*.665,.170,2.405,.32,.250,.023]);
  // Short chassis/underrun reveal under the insulated body; no new route or
  // loading clearance is implied by this visual surface detail.
  parts.rubber.push([12.8+side*.794,.488,3.905,.040,.060,1.29]);
 }
 const meshes=[
  instanced(scene,'S26 reefer · satin cargo extrusions',satin,parts.satin),
  instanced(scene,'S26 reefer · insulated panel joints',joint,parts.joint),
  instanced(scene,'S26 reefer · rub rails and mudflaps',rubber,parts.rubber),
  instanced(scene,'S26 reefer · amber side and cab markers',amber,parts.amber),
  instanced(scene,'S26 reefer · red rear markers',red,parts.red),
 ];
 return {
  section:'S26',status:'proposed generic reefer finish; exact vehicle and dock unverified',
  drawCalls:meshes.length,parts:Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,v.length])),
  totalParts:meshes.reduce((n,m)=>n+m.count,0),
 };
}
