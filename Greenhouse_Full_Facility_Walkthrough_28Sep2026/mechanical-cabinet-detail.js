import * as THREE from 'three';

// Proposed presentation hardware for the existing G07 dehumidifier in every
// greenhouse module. The exported asset already has a filter grille, display,
// casters and condensate pipe. These details register to their measured mesh
// bounds and do not replace or duplicate those components.
const powderCoat=new THREE.MeshStandardMaterial({
 name:'G07 proposed satin powder-coated access hatch',color:'#dfe4e0',metalness:.14,roughness:.64,
});
const gasket=new THREE.MeshStandardMaterial({
 name:'G07 proposed dark EPDM panel joints',color:'#3e4b49',metalness:0,roughness:.9,
});
const satinMetal=new THREE.MeshStandardMaterial({
 name:'G07 proposed brushed stainless fittings',color:'#9ca8a5',metalness:.72,roughness:.4,
});
const grille=new THREE.MeshStandardMaterial({
 name:'G07 proposed charcoal side ventilation',color:'#4a5957',metalness:.36,roughness:.58,
});
const box=new THREE.BoxGeometry(1,1,1);
const cylinder=new THREE.CylinderGeometry(1,1,1,12);
const drainRing=new THREE.TorusGeometry(.028,.006,5,12);
const qFront=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2);
const identity=new THREE.Quaternion();
const p=new THREE.Vector3(),s=new THREE.Vector3(),m=new THREE.Matrix4();

function plaqueMaterial(){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;
 const c=canvas.getContext('2d');
 c.fillStyle='#e9ede8';c.fillRect(0,0,512,160);
 c.strokeStyle='#687775';c.lineWidth=8;c.strokeRect(5,5,502,150);
 c.fillStyle='#f3bf59';c.beginPath();c.moveTo(27,120);c.lineTo(80,35);c.lineTo(133,120);c.closePath();c.fill();
 c.fillStyle='#243c37';c.font='bold 66px Arial';c.fillText('!',69,107);
 c.font='bold 31px Arial';c.fillText('HUMIDITY UNIT',152,70);
 c.font='24px Arial';c.fillText('SERVICE ACCESS',152,113);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
 return new THREE.MeshStandardMaterial({name:'G07 proposed service-access label',map:tex,roughness:.72,metalness:0,side:THREE.DoubleSide});
}

function put(groups,key,gh,x,y,z,sx,sy,sz,q=identity){
 p.set(gh.x+x,gh.z+y,-gh.y+z);s.set(sx,sy,sz);
 groups[key].push(m.compose(p,q,s).clone());
}
function batch(scene,name,geometry,material,matrices){
 const mesh=new THREE.InstancedMesh(geometry,material,matrices.length);
 mesh.name=name;mesh.userData={design_status:'proposed G07 cabinet hardware',module_count:18,instance_count:matrices.length};
 for(let i=0;i<matrices.length;i++)mesh.setMatrixAt(i,matrices[i]);
 mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
 mesh.castShadow=false;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}

export function addMechanicalCabinetDetail(scene,greenhouses){
 const groups={panels:[],seams:[],metal:[],vents:[],locks:[],labels:[],drains:[]};
 for(const gh of greenhouses){
  // The 0.60 × 1.10 × 0.55 m body is centered at local (6.30, .55, -19.15).
  // Front faces +Z (towards the work aisle); its exported surface is -18.875.
  // A shallow lower hatch leaves the original upper filter and display clear.
  put(groups,'panels',gh,6.30,.302,-18.868,.477,.388,.006);
  for(const x of [6.057,6.543])put(groups,'seams',gh,x,.302,-18.857,.005,.394,.005);
  for(const y of [.105,.499])put(groups,'seams',gh,6.30,y,-18.857,.490,.005,.005);
  // Offset hinges and a quarter-turn lock make the hatch read as serviceable.
  for(const y of [.199,.402])put(groups,'metal',gh,6.064,y,-18.839,.024,.055,.018);
  put(groups,'metal',gh,6.503,.300,-18.840,.041,.085,.018);
  put(groups,'locks',gh,6.503,.301,-18.822,.014,.008,.014,qFront);
  put(groups,'seams',gh,6.30,.041,-18.851,.556,.039,.007); // shadowed caster/kick reveal
  // Side intake: the cabinet's x-positive face is otherwise an unbroken box.
  put(groups,'vents',gh,6.608,.785,-19.15,.008,.373,.375);
  for(let i=0;i<6;i++)put(groups,'metal',gh,6.626,.637+i*.060,-19.15,.014,.012,.323);
  for(const z of [-19.338,-18.962])put(groups,'seams',gh,6.618,.785,z,.004,.380,.004);
  put(groups,'labels',gh,6.261,.443,-18.850,.193,.060,1);
  // Existing condensate tube exits the rear face at y=.12. This small collar
  // terminates that connection without inventing a new drain route.
  put(groups,'drains',gh,6.30,.12,-19.453,1,1,1);
 }
 const elements=[
  batch(scene,'G07 cabinet · lower access panel',box,powderCoat,groups.panels),
  batch(scene,'G07 cabinet · door joints and caster reveal',box,gasket,groups.seams),
  batch(scene,'G07 cabinet · hinges, latch and side louvers',box,satinMetal,groups.metal),
  batch(scene,'G07 cabinet · recessed side intake',box,grille,groups.vents),
  batch(scene,'G07 cabinet · quarter-turn locks',cylinder,grille,groups.locks),
  batch(scene,'G07 cabinet · proposed service label',new THREE.PlaneGeometry(1,1),plaqueMaterial(),groups.labels),
  batch(scene,'G07 cabinet · condensate exit collars',drainRing,satinMetal,groups.drains),
 ];
 return {status:'proposed G07 dehumidifier access hardware',modules:greenhouses.length,drawCalls:elements.length,instances:Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,v.length])),cabinetLocalCenter:[6.3,.55,-19.15]};
}
