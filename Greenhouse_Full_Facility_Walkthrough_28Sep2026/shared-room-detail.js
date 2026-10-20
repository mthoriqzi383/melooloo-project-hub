import * as THREE from 'three';

// Browser geometry compiled from the measured, proposed room-detail specification.
// This module does not claim that the additional parts are saved in Blender.
const toWeb=p=>new THREE.Vector3(p[0],p[2],-p[1]);
const basis=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2);
const inverseBasis=basis.clone().invert();
function orientation(e){
 const qx=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),e[0]);
 const qy=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),e[1]);
 const qz=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),e[2]);
 return basis.clone().multiply(qz.multiply(qy).multiply(qx)).multiply(inverseBasis);
}
function roundedBox(d,r){
 const [w,h,z]=d;
 const shape=new THREE.Shape();
 shape.moveTo(-w/2+r,-h/2+r);shape.lineTo(w/2-r,-h/2+r);shape.lineTo(w/2-r,h/2-r);shape.lineTo(-w/2+r,h/2-r);shape.closePath();
 const g=new THREE.ExtrudeGeometry(shape,{depth:z-2*r,bevelEnabled:r>0,bevelSize:r,bevelThickness:r,bevelSegments:3,steps:1,curveSegments:1});
 g.translate(0,0,-z/2+r);g.rotateX(-Math.PI/2);return g;
}
function meshGeometry(d){
 const positions=d.vertices.flatMap(p=>[p[0],p[2],-p[1]]),indices=[];
 for(const face of d.faces)for(let i=1;i<face.length-1;i++)indices.push(face[0],face[i],face[i+1]);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);
 if(d.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(d.uv.flat(),2));
 g.computeVertexNormals();if(!d.smooth){const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();return flat;}return g;
}
function ensureUV(g){
 if(g.attributes.uv)return;
 const p=g.attributes.position,n=g.attributes.normal,uv=[];
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),nx=Math.abs(n.getX(i)),ny=Math.abs(n.getY(i)),nz=Math.abs(n.getZ(i));
  if(ny>=nx&&ny>=nz)uv.push(x,z);else if(nx>=nz)uv.push(z,y);else uv.push(x,y);
 }
 g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
}
function labelAtlas(plan){
 const texts=[...new Set(plan.geometries.filter(g=>g.type==='text').map(g=>g.text))];
 const cols=4,cw=512,ch=128,rows=Math.ceil(texts.length/cols),canvas=document.createElement('canvas');canvas.width=cols*cw;canvas.height=rows*ch;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.font='700 68px Arial';ctx.textAlign='center';ctx.textBaseline='alphabetic';
 const rects=new Map();
 texts.forEach((text,i)=>{
  const col=i%cols,row=Math.floor(i/cols),metric=ctx.measureText(text),factor=Math.min(1,(cw-28)/metric.width);
  ctx.save();ctx.translate(col*cw+cw/2,row*ch+96);ctx.scale(factor,1);ctx.fillText(text,0,0);ctx.restore();
  const drawn=metric.width*factor;rects.set(text,{u0:(col*cw+(cw-drawn)/2-6)/canvas.width,u1:(col*cw+(cw+drawn)/2+6)/canvas.width,v0:1-(row*ch+108)/canvas.height,v1:1-(row*ch+24)/canvas.height,ratio:(drawn+12)/84});
 });
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=true;return {texture,rects};
}
function textGeometry(d,atlas){
 const t=atlas.rects.get(d.text),w=d.size*t.ratio,h=d.size;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-w/2,0,0,w/2,0,0,w/2,0,-h,-w/2,0,-h],3));
 g.setAttribute('uv',new THREE.Float32BufferAttribute([t.u0,t.v0,t.u1,t.v0,t.u1,t.v1,t.u0,t.v1],2));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();return g;
}
export async function applySharedRoomDetail(root,renderer){
 const plan=await fetch('./assets/presentation/shared_detail_plan.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Shared-room detail plan is missing');return r.json();});
 if(plan.status!=='compiled'||plan.new_objects<500)throw Error('Shared-room detail plan is incomplete');
 const originalMeshes=new Map(),originalMaterials=new Map();root.updateMatrixWorld(true);
 root.traverse(o=>{if(!o.isMesh)return;originalMeshes.set(o.userData.name||o.name,o);for(const m of Array.isArray(o.material)?o.material:[o.material])originalMaterials.set(m.name,m);});
 // The room-wall atlas has dark texel bleed at the ceiling line. Preserve its
 // albedo/normal surface while letting the existing scene lights shade walls.
 // Keep baked lighting on floors, where it provides useful contact shading.
 let cleanedRoomWalls=0;
 for(const name of ['BK_RoomSurfaces_BK_Lit_rooms_light_BK_PBR_plaster']){
  const wall=originalMeshes.get(name);
  if(!wall)continue;
  const clean=wall.material.clone();
  clean.name+=' Clean wall lighting';clean.lightMap=null;clean.emissiveMap=null;
  clean.emissive.set(0x000000);clean.emissiveIntensity=0;
  clean.onBeforeCompile=()=>{};clean.customProgramCacheKey=()=> 'melooloo-clean-room-wall-v1';
  clean.roughness=.84;clean.needsUpdate=true;wall.material=clean;cleanedRoomWalls++;
 }
 for(const name of [...plan.removed_originals,...plan.objects.filter(o=>o.original).map(o=>o.name)])if(!originalMeshes.has(name))throw Error('Cannot locate measured fixture '+name);
 const atlas=labelAtlas(plan),loader=new THREE.TextureLoader(),maps={};
 const texturePaths={steel:'presentation/brushed_stainless',soil:'presentation/seedling_substrate',green:'presentation/forest_packaging_board',ivory:'presentation/ivory_packing_fiber',rind:'higgsfield/melon_rind',rindNormal:'higgsfield/melon_rind_normal',leaf:'higgsfield/leaf_surface',leafNormal:'higgsfield/leaf_surface_normal'};
 await Promise.all(Object.entries(texturePaths).map(async([key,path])=>{
  const t=await loader.loadAsync('./assets/'+path+'.png');t.colorSpace=key.endsWith('Normal')?THREE.NoColorSpace:THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  if(key.startsWith('rind'))t.repeat.set(3,1.5);maps[key]=t;
 }));
 const materials=new Map(),textMaterials=new Map();
 for(const [name,d] of Object.entries(plan.materials)){
  if(d.original&&originalMaterials.has(name)){materials.set(name,originalMaterials.get(name));continue;}
  const m=new THREE.MeshStandardMaterial({color:new THREE.Color(...d.color),roughness:d.roughness,metalness:d.metalness,opacity:d.opacity,transparent:d.opacity<1});m.name=name;m.envMapIntensity=.7;
  if(d.opacity<1){m.depthWrite=false;m.side=THREE.DoubleSide;}
  const mapKey=name==='HF_ROOM_BrushedSteel'?'steel':name==='HF_ROOM_MoistSubstrate'?'soil':name==='HF_ROOM_MeloolooForest'?'green':name==='HF_ROOM_MatteIvory'?'ivory':name==='HF_Melon_Rind'?'rind':name==='HF_ROOM_CotyledonLeaf'?'leaf':null;
  if(mapKey){m.map=maps[mapKey];m.color.setRGB(1,1,1);}
  if(mapKey==='rind'){m.normalMap=maps.rindNormal;m.normalScale.set(.35,.35);}
  if(mapKey==='leaf'){m.normalMap=maps.leafNormal;m.normalScale.set(.25,.25);m.color.setRGB(.80,.95,.65);m.side=THREE.DoubleSide;}
  m.userData.finished=true;materials.set(name,m);
 }
 const geometryCache=new Map();
 const curtainMaterial=new THREE.MeshStandardMaterial({name:'Cold room single-surface strip curtain',color:'#d7e3e5',roughness:.26,metalness:0,transparent:true,opacity:.085,depthWrite:false,side:THREE.FrontSide});
 curtainMaterial.userData.finished=true;
 function geometry(i){
  if(geometryCache.has(i))return geometryCache.get(i);
  const d=plan.geometries[i];let g;
  if(d.type==='original')g=originalMeshes.get(d.node).geometry;
  else if(d.type==='roundedBox')g=roundedBox(d.dimensions,d.bevel);
  else if(d.type==='mesh')g=meshGeometry(d);
  else if(d.type==='text')g=textGeometry(d,atlas);
  else if(d.type==='tube'){
   const p=d.points.map(toWeb),curve=p.length===2?new THREE.LineCurve3(...p):new THREE.CatmullRomCurve3(p,false,'centripetal');
   g=new THREE.TubeGeometry(curve,p.length===2?1:Math.max(8,p.length*3),d.radius,d.segments,false);
  }else throw Error('Unknown shared detail geometry '+d.type);
  ensureUV(g);g.computeBoundingSphere();geometryCache.set(i,g);return g;
 }
 for(const name of plan.removed_originals)originalMeshes.get(name).removeFromParent();
 const group=new THREE.Group();group.name='Proposed shared-room presentation detail';root.add(group);
 root.updateMatrixWorld(true);
 let changed=0,created=0;
 for(const d of plan.objects){
  const gd=plan.geometries[d.geometry];let mat=materials.get(d.material);
  if(!mat)throw Error('Missing shared-room material '+d.material);
  if(gd.type==='text'){
   if(!textMaterials.has(d.material)){const tm=mat.clone();tm.name+=' Label';tm.color.setRGB(...plan.materials[d.material].color);tm.map=atlas.texture;tm.metalness=0;tm.transparent=false;tm.alphaTest=.35;tm.side=THREE.DoubleSide;textMaterials.set(d.material,tm);}mat=textMaterials.get(d.material);
  }
  let o=d.original?originalMeshes.get(d.name):new THREE.Mesh(geometry(d.geometry),mat);
  if(d.original){o.material=mat;if(gd.type!=='original')o.geometry=geometry(d.geometry);changed++;}else{group.add(o);o.name=d.name;o.userData={...d.extras,section_id:d.section,shared_browser_detail:true};created++;}
  if(d.name.startsWith('WT_S22_StripCurtain')){
   // The source uses a rounded transparent solid: front/back faces blend over
   // each other and produce vertical ghost bands from the doorway. A suspended
   // plastic strip is better represented by one thin surface.
   o.geometry=new THREE.PlaneGeometry(gd.dimensions[0]-.005,gd.dimensions[2]-.008);
   o.material=curtainMaterial;mat=curtainMaterial;
  }
  {
   const desired=new THREE.Matrix4().compose(toWeb(d.position),orientation(d.rotation),new THREE.Vector3(d.scale[0],d.scale[2],d.scale[1]));
   o.matrix.copy(o.parent.matrixWorld.clone().invert().multiply(desired));o.matrixAutoUpdate=false;
  }
  o.castShadow=!mat.transparent;o.receiveShadow=true;
 }
 root.updateMatrixWorld(true);
 return {newParts:created,changedFixtures:changed,removedPlaceholders:plan.removed_originals.length,cleanedRoomWalls,sections:plan.sections,higgsfieldSurfaces:4,nativeSource:'pending computer-use console',geometryMethod:plan.method};
}
