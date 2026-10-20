import * as THREE from 'three';

// GH01 only. These are proposed hardware envelopes supported by the IoT study,
// not a revision to the BP's eight-device per-module baseline or a wiring plan.
const steel=new THREE.MeshStandardMaterial({name:'GH01 pilot stainless instrument hardware',color:'#9daaa8',metalness:.67,roughness:.37});
const dark=new THREE.MeshStandardMaterial({name:'GH01 pilot sealed polymer',color:'#344742',metalness:.06,roughness:.7});
const white=new THREE.MeshStandardMaterial({name:'GH01 pilot PAR diffuser',color:'#f1f1e5',metalness:0,roughness:.85});
const amber=new THREE.MeshStandardMaterial({name:'GH01 pilot identification band',color:'#bd8749',metalness:.14,roughness:.61});
const cable=new THREE.MeshStandardMaterial({name:'GH01 pilot instrument lead',color:'#263e3a',metalness:0,roughness:.88});
const q=new THREE.Quaternion();
const unitY=new THREE.Vector3(0,1,0);

function add(root,name,geometry,material,x,y,z){const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);return mesh;}
function cylinder(root,name,r1,r2,h,material,x,y,z,sides=16){return add(root,name,new THREE.CylinderGeometry(r1,r2,h,sides),material,x,y,z);}
function box(root,name,sx,sy,sz,material,x,y,z){return add(root,name,new THREE.BoxGeometry(sx,sy,sz),material,x,y,z);}
function wire(root,name,points,r=.006){const path=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));return add(root,name,new THREE.TubeGeometry(path,Math.max(12,points.length*8),r,6,false),cable,0,0,0);}
function identification(root,caption,x,y,z,w=.28){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#e8eee8';ctx.fillRect(0,0,512,128);ctx.fillStyle='#ad7342';ctx.fillRect(0,0,14,128);
 ctx.fillStyle='#243e34';ctx.font='bold 59px Arial';ctx.fillText(caption,37,83);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
 const mat=new THREE.MeshStandardMaterial({name:'GH01 pilot proposed instrument tag',map:tex,roughness:.8,side:THREE.DoubleSide});
 const plate=add(root,`GH01 pilot ${caption} tag`,new THREE.PlaneGeometry(w,w/4),mat,x,y,z);return plate;
}
function levelHead(root,x,depth,index){
 // The existing two G06 tank lids are centered at x .75 and 2.00, depth 18.80.
 // New necks sit off their center grips. Hidden dip-tubes are not drawn.
 const sx=x-.17,sd=depth-.16;
 cylinder(root,`GH01 proposed level ${index} sealed flange`,.067,.067,.019,steel,sx,.870,-sd,12);
 cylinder(root,`GH01 proposed level ${index} threaded head`,.043,.046,.079,dark,sx,.916,-sd,12);
 cylinder(root,`GH01 proposed level ${index} top gland`,.022,.026,.023,steel,sx,.967,-sd,12);
 cylinder(root,`GH01 proposed level ${index} identity band`,.046,.046,.012,amber,sx,.941,-sd,12);
 wire(root,`GH01 proposed level ${index} service loop`,[[sx,.976,-sd],[sx-.06,1.025,-sd-.03],[sx-.11,.982,-sd-.09],[sx-.10,.890,-sd-.14]],.005);
}

export function addIoTPilotDetail(scene,greenhouses){
 const gh=greenhouses.find(x=>x.id==='GH01');if(!gh)return {status:'GH01 missing'};
 const root=new THREE.Group();root.name='GH01 · research-led proposed IoT pilot';root.position.set(gh.x,gh.z,-gh.y);root.userData={design_status:'proposed pilot, not BP BOM or installed equipment',module:'GH01',live_data:false};

 // PAR quantum head: adjustable drop rod under the crop-zone truss. The head
 // is level and above the trellis/canopy, with a short local service loop.
 const parX=4.05,parD=16.5;
 box(root,'GH01 proposed PAR truss clamp',.20,.08,.13,dark,parX,4.20,-parD);
 cylinder(root,'GH01 proposed PAR drop rod',.017,.017,1.31,steel,parX,3.55,-parD,10);
 cylinder(root,'GH01 proposed PAR lock collar',.043,.043,.055,steel,parX,2.90,-parD,12);
 cylinder(root,'GH01 proposed PAR sensor body',.052,.052,.055,dark,parX,2.84,-parD,18);
 cylinder(root,'GH01 proposed PAR level diffuser',.039,.039,.006,white,parX,2.871,-parD,18);
 add(root,'GH01 proposed PAR leveling ring',new THREE.TorusGeometry(.048,.004,5,18),steel,parX,2.876,-parD).quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),unitY);
 box(root,'GH01 proposed PAR strain relief',.055,.055,.045,dark,parX+.064,2.84,-parD);
 wire(root,'GH01 proposed PAR service lead',[[parX+.07,2.84,-parD],[parX+.17,2.87,-parD+.03],[parX+.18,3.01,-parD+.07],[parX+.11,3.16,-parD+.04],[parX+.04,3.32,-parD]],.005);
 identification(root,'PILOT PAR',parX+.29,2.83,-parD,.29).rotation.y=Math.PI;

 // Two tank-level head envelopes in the existing G06 pair. Final switch type,
 // tank role and trip elevation are intentionally unasserted.
 levelHead(root,.75,18.80,'A');levelHead(root,2.00,18.80,'B');
 // A combined inline pH/EC/temp probe is a valid procurement alternative;
 // this slim thermowell depicts only the additional temperature point.
 const tx=1.44,td=18.0;
 cylinder(root,'GH01 proposed solution temperature probe shaft',.019,.019,.16,steel,tx,.727,-td,12);
 cylinder(root,'GH01 proposed solution temperature probe head',.038,.038,.052,dark,tx,.830,-td,12);
 cylinder(root,'GH01 proposed solution temperature probe gland',.042,.042,.013,amber,tx,.791,-td,12);
 wire(root,'GH01 proposed temperature probe service loop',[[tx,.859,-td],[tx+.055,.924,-td+.04],[tx+.12,.887,-td+.095],[tx+.13,.80,-td+.12]],.005);
 identification(root,'PILOT TEMP',tx+.21,.84,-td,.31);

 // Low-profile leak pickup inside the drawn G06 secondary containment.
 const lx=.34,ld=19.30;
 cylinder(root,'GH01 proposed G06 leak sensor body',.072,.072,.028,dark,lx,.041,-ld,18);
 cylinder(root,'GH01 proposed G06 leak sensor top',.047,.047,.004,amber,lx,.058,-ld,18);
 wire(root,'GH01 proposed leak pickup lead',[[lx+.055,.044,-ld],[lx+.14,.07,-ld],[lx+.18,.11,-ld+.12],[lx+.18,.15,-ld+.22]],.004);

 scene.add(root);
 let meshCount=0,triangles=0;root.traverse(o=>{if(o.isMesh){meshCount++;triangles+=o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3;}});
 return {status:'proposed GH01-only pilot geometry; no live data or BP BOM change',module:'GH01',devices:{PAR:1,tank_level_head:2,solution_temperature:1,leak_pickup:1},meshes:meshCount,triangles:Math.round(triangles)};
}
