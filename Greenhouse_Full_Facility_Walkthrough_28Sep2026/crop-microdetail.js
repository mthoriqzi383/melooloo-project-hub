import * as THREE from 'three';

// Add restrained biological variation after the standard greenhouse module has
// been instanced. This decorates the existing 420 fruits and 7,560 leaves per
// module without changing the approved visualized planting positions.
const leafName=/_HF_leaf\d+/;
const fruitName=/_fruit(?:\.|$)/;
const matrix=new THREE.Matrix4();
const position=new THREE.Vector3();
const quaternion=new THREE.Quaternion();
const scale=new THREE.Vector3();
const twist=new THREE.Quaternion();
const basisComponents=[0,1,2,4,5,6,8,9,10];

function hash32(x){
 x=Math.imul(x^(x>>>16),0x7feb352d);
 x=Math.imul(x^(x>>>15),0x846ca68b);
 return (x^(x>>>16))>>>0;
}
function hashName(name){
 let h=2166136261;
 for(let i=0;i<name.length;i++)h=Math.imul(h^name.charCodeAt(i),16777619);
 return h>>>0;
}
function noise(seed){return hash32(seed)/4294967295;}

function calyxGeometry(){
 const vertices=[],indices=[];
 // Five small, swept sepals wrap the upper curve of the melon.
 for(let lobe=0;lobe<5;lobe++){
  const a=lobe*Math.PI*2/5,base=vertices.length/3;
  for(const [radius,offset,height] of [[.045,-.26,1.013],[.045,.26,1.013],[.24,0,.970],[.16,0,.989]]){
   const t=a+offset;
   vertices.push(Math.cos(t)*radius,height,Math.sin(t)*radius);
  }
  indices.push(base,base+3,base+1,base+3,base+2,base+1);
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.setIndex(indices);geometry.computeVertexNormals();
 return geometry;
}

export function addCropMicrodetail(scene){
 const fruitMatrices=[],leafTone=[0,0,0],fruitTone=[0,0,0];
 let leafInstances=0,fruitInstances=0,leafBatches=0,fruitBatches=0;
 const fruitCandidateNames=[];
 scene.traverse(mesh=>{
  if(!mesh.isInstancedMesh||!mesh.name.startsWith('Batch WT_Module_'))return;
  const materialName=Array.isArray(mesh.material)?mesh.material.map(m=>m.name).join(' '):mesh.material.name;
  if(materialName.includes('Melon_Rind')&&fruitCandidateNames.length<4)fruitCandidateNames.push(mesh.name);
  const isLeaf=leafName.test(mesh.name)||materialName.includes('Botanical_Leaf');
  const isFruit=fruitName.test(mesh.name)||materialName.includes('Melon_Rind');
  if(!isLeaf&&!isFruit)return;
  mesh.getMatrixAt(0,matrix);
  const origin=matrix.elements;
  const seed=hash32(hashName(mesh.name)^Math.round(origin[12]*10)^Math.imul(Math.round(origin[14]*10),997));
  const colors=new Float32Array(mesh.count*3);
  for(let i=0;i<mesh.count;i++){
   const a=noise(seed+Math.imul(i+1,0x9e3779b9));
   const b=noise(seed+Math.imul(i+1,0x85ebca6b));
   const c=noise(seed+Math.imul(i+1,0xc2b2ae35));
   const k=i*3;
   if(isLeaf){
    // The photographic leaf texture provides the veins. These near-white
    // multipliers only break the repeated brightness and color temperature.
    colors[k]=.94+.10*a;
    colors[k+1]=.93+.10*b;
   colors[k+2]=.91+.10*c;
   leafTone[0]+=colors[k];leafTone[1]+=colors[k+1];leafTone[2]+=colors[k+2];
    // The original 18 mature blades per plant close over the central aisle.
    // Shrink the blade at its existing petiole junction, leaving the anchor,
    // petiole and training geometry in place. A 0.24–0.30 m span remains.
    mesh.getMatrixAt(i,matrix);
    const basis=matrix.elements,bladeScale=.80+.10*a;
    for(const component of basisComponents)basis[component]*=bladeScale;
    mesh.setMatrixAt(i,matrix);
   }else{
    colors[k]=.955+.085*a;
    colors[k+1]=.955+.075*b;
    colors[k+2]=.925+.085*c;
    fruitTone[0]+=colors[k];fruitTone[1]+=colors[k+1];fruitTone[2]+=colors[k+2];
    mesh.getMatrixAt(i,matrix);
    matrix.decompose(position,quaternion,scale);
    twist.setFromAxisAngle(THREE.Object3D.DEFAULT_UP,noise(seed+i+11)*Math.PI*2);
    quaternion.multiply(twist);
    scale.multiplyScalar(.978+.044*noise(seed+i+29));
    matrix.compose(position,quaternion,scale);
    mesh.setMatrixAt(i,matrix);
    fruitMatrices.push(matrix.clone());
   }
  }
  mesh.instanceColor=new THREE.InstancedBufferAttribute(colors,3);
  mesh.instanceColor.needsUpdate=true;
  if(isLeaf){leafInstances+=mesh.count;leafBatches++;mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}
  if(isFruit){fruitInstances+=mesh.count;fruitBatches++;mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}
 });
 if(fruitMatrices.length){
  const calyx=new THREE.InstancedMesh(calyxGeometry(),new THREE.MeshStandardMaterial({name:'Living melon calyx',color:'#456b36',roughness:.88,side:THREE.DoubleSide}),fruitMatrices.length);
  const peduncle=new THREE.InstancedMesh(new THREE.CylinderGeometry(.033,.043,.18,6),new THREE.MeshStandardMaterial({name:'Living melon peduncle',color:'#688347',roughness:.91}),fruitMatrices.length);
  calyx.name='Crop detail · five-lobed calyx';peduncle.name='Crop detail · short peduncle';
  const lift=new THREE.Matrix4().makeTranslation(0,1.085,0);
  for(let i=0;i<fruitMatrices.length;i++){
   calyx.setMatrixAt(i,fruitMatrices[i]);
   peduncle.setMatrixAt(i,matrix.copy(fruitMatrices[i]).multiply(lift));
  }
  calyx.instanceMatrix.needsUpdate=true;peduncle.instanceMatrix.needsUpdate=true;
  calyx.computeBoundingSphere();peduncle.computeBoundingSphere();
  calyx.castShadow=false;peduncle.castShadow=false;calyx.receiveShadow=true;peduncle.receiveShadow=true;
  calyx.userData.design_status=peduncle.userData.design_status='visualized crop detail';
  scene.add(calyx,peduncle);
 }
 return {leafInstances,fruitInstances,leafBatches,fruitBatches,addedDrawCalls:fruitMatrices.length?2:0,fruitDetailInstances:fruitMatrices.length,fruitCandidateNames};
}
