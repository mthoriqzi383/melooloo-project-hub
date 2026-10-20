import * as THREE from 'three';
import {mergeGeometries} from './vendor/utils/BufferGeometryUtils.js';

// Existing greenhouse geometry already contains the structural rafters,
// gutters, downpipes, UV-film visual option, and 40-mesh insect barrier. This
// layer makes the interfaces and weathering hardware legible at walking scale.
// Its dimensions and routing are proposed visualization details.
const metal=new THREE.MeshStandardMaterial({name:'Enclosure anodized aluminum',color:'#a4ada9',metalness:.68,roughness:.43});
const fitting=new THREE.MeshStandardMaterial({name:'Enclosure galvanized fittings',color:'#788581',metalness:.72,roughness:.47});
const gasket=new THREE.MeshStandardMaterial({name:'Enclosure EPDM weather seals',color:'#596b64',metalness:0,roughness:.87});
const pvc=new THREE.MeshStandardMaterial({name:'Drainage PVC cleanout',color:'#c7cfca',metalness:0,roughness:.67});
const unitBox=new THREE.BoxGeometry(1,1,1);
const unitMatrix=new THREE.Matrix4();
const pos=new THREE.Vector3(),rot=new THREE.Quaternion(),size=new THREE.Vector3();
const axisZ=new THREE.Vector3(0,0,1);

function mAt(x,y,z,sx,sy,sz,rz=0){
 pos.set(x,y,z);rot.setFromAxisAngle(axisZ,rz);
 size.set(sx,sy,sz);return unitMatrix.compose(pos,rot,size).clone();
}
function rootPosition(gh,x,elevation,depth){return [gh.x+x,gh.z+elevation,-gh.y-depth];}
function instance(name,geometry,material,matrices){
 const mesh=new THREE.InstancedMesh(geometry,material,matrices.length);
 mesh.name=name;mesh.userData={design_status:'proposed enclosure hardware',module_count:18,element_count:matrices.length};
 for(let i=0;i<matrices.length;i++)mesh.setMatrixAt(i,matrices[i]);
 mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
 mesh.castShadow=false;mesh.receiveShadow=true;
 return mesh;
}
function endcapGeometry(){
 const shape=new THREE.Shape();
 shape.moveTo(-.104,.006);shape.lineTo(-.087,-.051);
 shape.quadraticCurveTo(0,-.096,.087,-.051);
 shape.lineTo(.104,.006);shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.008,bevelEnabled:true,bevelThickness:.002,bevelSize:.0015,bevelSegments:1,curveSegments:4});
 geometry.computeVertexNormals();return geometry;
}
function sleeveGeometry(){
 const pieces=[
  new THREE.BoxGeometry(.014,.065,.025).translate(-.101,-.027,0),
  new THREE.BoxGeometry(.014,.065,.025).translate(.101,-.027,0),
  new THREE.BoxGeometry(.198,.012,.025).translate(0,-.074,0),
 ];
 const merged=mergeGeometries(pieces,false);for(const g of pieces)g.dispose();return merged;
}
function clipGeometry(){
 const pieces=[
  new THREE.BoxGeometry(.125,.010,.092),
  new THREE.BoxGeometry(.012,.020,.092).translate(-.057,.011,0),
  new THREE.BoxGeometry(.012,.020,.092).translate(.057,.011,0),
 ];
 const merged=mergeGeometries(pieces,false);for(const g of pieces)g.dispose();return merged;
}

export function addEnclosureHardware(scene,greenhouses){
 const gable=[],sideSeal=[],clips=[],clipBolts=[],endcaps=[],sleeves=[],hoppers=[],cleanouts=[];
 const slope=Math.atan(.3),roofNormalL=new THREE.Vector3(-.28735,.95783,0),roofNormalR=new THREE.Vector3(.28735,.95783,0);
 const filmMaterials=new Set();
 scene.traverse(o=>{
  if(!o.isInstancedMesh)return;
  for(const material of Array.isArray(o.material)?o.material:[o.material])if(material?.name==='HF_INF_UV_Film')filmMaterials.add(material);
 });
 for(const material of filmMaterials){
  // The existing UV-film option is 19% opaque in the export and disappears
  // against the bright Jakarta sky. A warm translucent panel still reveals
  // the crop and structure while making the roof enclosure legible outside.
  material.color.set('#f2f1ea');material.opacity=.40;material.roughness=.34;
  material.transparent=true;material.depthWrite=false;material.side=THREE.DoubleSide;
  material.needsUpdate=true;
 }
 for(const gh of greenhouses){
  // Continuous but narrow front/rear lock bead shows where UV film terminates.
  // It is 25 mm clear of the existing film, preventing coplanar flicker.
  for(const d of [0,20])for(const side of [0,1]){
   const x=side?7.5:2.5;
   const [px,py,pz]=rootPosition(gh,x,3.775,d);
   gable.push(mAt(px,py,pz+(d===0?.032:-.032),5.22,.012,.028,side?-slope:slope));
  }
  // The side insect-net foot is captured in a dark flexible perimeter seal.
  for(const x of [-.018,10.018]){
   const [px,py,pz]=rootPosition(gh,x,.12,10);
   sideSeal.push(mAt(px,py,pz,.023,.025,19.87));
  }
  for(const d of [0,20])for(let i=0;i<8;i++){
   const x=.55+i*1.27,left=x<5,h=left?3+.3*x:6-.3*x;
   const roofNormal=left?roofNormalL:roofNormalR;
   const [px,py,pz]=rootPosition(gh,x,h,d);
   const facing=d===0?.045:-.045;
   const q=new THREE.Quaternion().setFromAxisAngle(axisZ,left?slope:-slope);
   const clipPos=new THREE.Vector3(px,py,pz+facing).addScaledVector(roofNormal,.018);
   clips.push(new THREE.Matrix4().compose(clipPos,q,new THREE.Vector3(1,1,1)));
   const boltQ=new THREE.Quaternion().setFromUnitVectors(THREE.Object3D.DEFAULT_UP,roofNormal);
   for(const boltDepth of [-.024,.024]){
    const bp=clipPos.clone().addScaledVector(roofNormal,.019);bp.z+=boltDepth;
    clipBolts.push(new THREE.Matrix4().compose(bp,boltQ,new THREE.Vector3(1,1,1)));
   }
  }
  for(const x of [-.13,10.13]){
   for(const d of [0,20]){
    const [px,py,pz]=rootPosition(gh,x,2.952,d);
    endcaps.push(mAt(px,py,pz+(d===0?.018:-.026),1,1,1));
   }
   for(const d of [5,10,15]){
    const [px,py,pz]=rootPosition(gh,x,2.951,d);
    sleeves.push(mAt(px,py,pz,1,1,1));
   }
   // These fittings terminate the existing rear pipe; no extra drain route.
   const [hx,hy,hz]=rootPosition(gh,x,2.875,19.6);
   hoppers.push(mAt(hx,hy,hz,1,1,1));
   const [cx,cy,cz]=rootPosition(gh,x,.50,19.6);
   cleanouts.push(mAt(cx,cy,cz,1,1,1));
  }
 }
 const elements=[
  instance('Enclosure · front and rear film lock beads',unitBox,gasket,gable),
  instance('Enclosure · insect net foot seals',unitBox,gasket,sideSeal),
  instance('Enclosure · gable roof clips',clipGeometry(),metal,clips),
  instance('Enclosure · roof clip fasteners',new THREE.CylinderGeometry(.007,.007,.008,6),fitting,clipBolts),
  instance('Enclosure · gutter end plates',endcapGeometry(),metal,endcaps),
  instance('Enclosure · gutter joint sleeves',sleeveGeometry(),fitting,sleeves),
  instance('Enclosure · rear outlet rainheads',new THREE.CylinderGeometry(.067,.040,.073,10),fitting,hoppers),
  instance('Enclosure · rear pipe cleanouts',new THREE.CylinderGeometry(.043,.043,.084,10),pvc,cleanouts),
 ];
 for(const element of elements)scene.add(element);
 return {modules:greenhouses.length,drawCalls:elements.length,filmMaterials:filmMaterials.size,filmOpacity:.40,instances:Object.fromEntries(elements.map(x=>[x.name,x.count])),hardwareInstances:elements.reduce((n,x)=>n+x.count,0)};
}
