import * as THREE from 'three';
import {mergeGeometries} from './vendor/utils/BufferGeometryUtils.js';

// Proposed visual terminations on the existing G11 sensor network. The Blender
// module already contains 3 temperature/RH heads, 4 pH/EC probes, 1 flow
// pickup, signal leads, service loops, clips, and low conduit. These fittings
// sit at those existing cable ends; they add no sensors or new cable routes.
const satin=new THREE.MeshStandardMaterial({
 name:'G11 proposed sensor connector alloy',color:'#a6b1ac',metalness:.65,roughness:.41,
});
const shell=new THREE.MeshStandardMaterial({
 name:'G11 proposed weatherproof junction shells',color:'#d5ded9',metalness:.08,roughness:.72,
});
const rubber=new THREE.MeshStandardMaterial({
 name:'G11 proposed cable strain relief',color:'#364541',metalness:0,roughness:.86,
});
const seal=new THREE.MeshStandardMaterial({
 name:'G11 proposed enclosure gaskets',color:'#52625b',metalness:0,roughness:.91,
});
const box=new THREE.BoxGeometry(1,1,1);
const bolt=new THREE.CylinderGeometry(.0045,.0045,.004,6);
const faceBolt=new THREE.CylinderGeometry(.0045,.0045,.004,6).rotateX(Math.PI/2);
const pos=new THREE.Vector3(),scale=new THREE.Vector3(),matrix=new THREE.Matrix4();
const identity=new THREE.Quaternion();

function connectorGeometry(){
 const parts=[
  new THREE.CylinderGeometry(.027,.027,.008,12).translate(0,-.018,0),
  new THREE.CylinderGeometry(.021,.021,.026,6).translate(0,-.001,0),
  new THREE.CylinderGeometry(.017,.021,.012,12).translate(0,.018,0),
 ];
 const combined=mergeGeometries(parts,false);
 for(const part of parts)part.dispose();
 return combined;
}
function bootGeometry(){
 const parts=[
  new THREE.CylinderGeometry(.009,.016,.035,10).translate(0,.0175,0),
  new THREE.TorusGeometry(.014,.0025,4,10).rotateX(Math.PI/2).translate(0,.004,0),
  new THREE.TorusGeometry(.011,.002,4,10).rotateX(Math.PI/2).translate(0,.019,0),
 ];
 const combined=mergeGeometries(parts,false);
 for(const part of parts)part.dispose();
 return combined;
}
function place(groups,key,gh,x,depth,height,sx=1,sy=1,sz=1){
 pos.set(gh.x+x,gh.z+height,-gh.y-depth);
 scale.set(sx,sy,sz);
 groups[key].push(matrix.compose(pos,identity,scale).clone());
}
function addBatch(scene,name,geometry,material,transforms){
 const mesh=new THREE.InstancedMesh(geometry,material,transforms.length);
 mesh.name=name;
 mesh.userData={design_status:'proposed G11 sensor termination detail',module_count:18};
 for(let i=0;i<transforms.length;i++)mesh.setMatrixAt(i,transforms[i]);
 mesh.instanceMatrix.needsUpdate=true;
 mesh.computeBoundingSphere();
 mesh.castShadow=false;mesh.receiveShadow=true;
 scene.add(mesh);
 return mesh;
}

export function addSensorTerminations(scene,greenhouses){
 const g={connectors:[],boots:[],junctions:[],lids:[],seals:[],faceFasteners:[],topFasteners:[]};
 for(const gh of greenhouses){
  // Existing probe heads are centered at y=18.000 m, with cap rings at
  // elevation .811 m and 3 mm leads starting at .845 m. The sockets enclose
  // the tiny exported gland and let the lead emerge through a rubber boot.
  for(const x of [.915,1.085,2.115,2.285]){
   place(g,'connectors',gh,x,18,.839);
   place(g,'boots',gh,x,18,.861);
  }
  // One matching connector on the existing flow-meter pickup at x=2.8.
  place(g,'connectors',gh,2.8,17.65,.388,.78,.78,.78);
  place(g,'boots',gh,2.8,17.65,.405,.78,.78,.78);

  // The air-sensor cables already descend their poles to a clipped signal
  // conduit at x=.12 and elevation .20 m. Small weatherproof tees clarify
  // this interface without drawing unsupported spans through crop rows.
  for(const depth of [3,10,17]){
   place(g,'junctions',gh,.12,depth,.246,.106,.070,.095);
   place(g,'seals',gh,.12,depth-.049,.246,.112,.074,.004);
   place(g,'lids',gh,.12,depth-.053,.246,.096,.062,.008);
   for(const x of [.081,.159])for(const y of [.220,.272])
    place(g,'faceFasteners',gh,x,depth-.058,y);
  }
  // The exported wet-sensor junction already sits at (.12,17.32,.22).
  // A shallow, screw-fastened cover finishes that existing enclosure.
  place(g,'seals',gh,.12,17.32,.257,.103,.006,.078);
  place(g,'lids',gh,.12,17.32,.263,.093,.009,.068);
  for(const x of [.084,.156])for(const depth of [17.295,17.345])
   place(g,'topFasteners',gh,x,depth,.271);
 }
 const objects=[
  addBatch(scene,'G11 · sensor bayonet connectors',connectorGeometry(),satin,g.connectors),
  addBatch(scene,'G11 · molded lead strain relief',bootGeometry(),rubber,g.boots),
  addBatch(scene,'G11 · air signal junction bodies',box,shell,g.junctions),
  addBatch(scene,'G11 · junction gaskets',box,seal,g.seals),
  addBatch(scene,'G11 · junction covers',box,shell,g.lids),
  addBatch(scene,'G11 · air junction cover fasteners',faceBolt,satin,g.faceFasteners),
  addBatch(scene,'G11 · wet junction cover fasteners',bolt,satin,g.topFasteners),
 ];
 return {
  status:'proposed visual sensor terminations; existing sensor count unchanged',
  modules:greenhouses.length,drawCalls:objects.length,
  instances:Object.fromEntries(Object.entries(g).map(([key,value])=>[key,value.length])),
 };
}
