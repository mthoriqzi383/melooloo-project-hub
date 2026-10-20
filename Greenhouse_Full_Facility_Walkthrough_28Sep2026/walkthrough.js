import * as THREE from 'three';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';
import { RoomEnvironment } from './vendor/environments/RoomEnvironment.js';
import { mergeGeometries, deinterleaveGeometry } from './vendor/utils/BufferGeometryUtils.js';
import { applySharedRoomDetail } from './shared-room-detail.js?v=batch4-2';
import { applyComplexAssets } from './complex-assets.js?v=batch4-1';
import { addMappedMallContext } from './site-context-osm.js?v=map3';
import { addCropMicrodetail } from './crop-microdetail.js?v=3';
import { addRoomOpsFixtures } from './room-ops-fixtures.js?v=4';
import { stabilizeGreenhouseNet } from './visual-surface-fixes.js?v=1';
import { addEnclosureHardware } from './enclosure-hardware.js?v=2';
import { addServiceRoomProps } from './service-room-props.js?v=1';
import { addDockDetail } from './dock-detail.js?v=4';
import { addReeferDetail } from './reefer-detail.js?v=1';
import { addMechanicalCabinetDetail } from './mechanical-cabinet-detail.js?v=1';
import { addSensorTerminations } from './sensor-termination-detail.js?v=2';
import { addStaffSanitationDetail } from './staff-sanitation-detail.js?v=1';
import { addIoTPilotDetail } from './iot-pilot-detail.js?v=3';
import { createTimeOfDay } from './time-of-day.js?v=1';

const $=id=>document.getElementById(id),canvas=$('view');
const [layout,nav,mapContext]=await Promise.all(['facility_layout.json','navigation.json','data/mall_artha_gading_map_context.json'].map(p=>fetch(p).then(r=>{if(!r.ok)throw Error(p+' missing');return r.json()}))).catch(e=>{ $('loadText').textContent='Cannot load the facility or site map data. Serve this folder with the supplied local launcher, then reload. '+e.message;throw e;});
const bakedReady=await fetch(new URLSearchParams(location.search).has('previewBake')?'./assets/baked/ready.pending.json':'./assets/baked/ready.json').then(r=>r.ok).catch(()=>false);
const higgsfieldReady=bakedReady&&await fetch(new URLSearchParams(location.search).has('previewHiggsfield')?'./assets/higgsfield/ready.pending.json':'./assets/higgsfield/ready.json').then(r=>r.ok).catch(()=>false);
const infrastructureReady=higgsfieldReady&&await fetch(new URLSearchParams(location.search).has('previewInfrastructure')?'./assets/infrastructure/ready.pending.json':'./assets/infrastructure/ready.json').then(r=>r.ok).catch(()=>false);
const presentationReady=infrastructureReady&&await fetch(new URLSearchParams(location.search).has('previewPresentation')?'./assets/presentation/ready.pending.json':'./assets/presentation/ready.json').then(r=>r.ok).catch(()=>false);
const sharedDetailReady=infrastructureReady&&await fetch(new URLSearchParams(location.search).has('previewShared')?'./assets/presentation/browser_ready.pending.json':'./assets/presentation/browser_ready.json').then(r=>r.ok).catch(()=>false);
const complexAssetsReady=sharedDetailReady&&await fetch('./assets/components/catalog.json',{cache:'no-store'}).then(r=>r.ok).catch(()=>false);
if(sharedDetailReady){const rack=nav.colliders.find(c=>c.id==='S10'&&c.kind==='equipment');if(rack){rack.y0+=.7;rack.y1+=.7;}}
const infrastructureViews=infrastructureReady?await fetch('./assets/infrastructure/viewpoints.json').then(r=>r.json()):{};
if(infrastructureReady){for(const [id,v] of Object.entries(infrastructureViews)){const d=layout.destinations.find(d=>d.id===id);if(d)Object.assign(d,v);}}
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
// Walking keeps a stable render scale; still presentation views can use the sharper setting.
const walkPixelRatio=Math.min(devicePixelRatio,1.25),presentationPixelRatio=Math.min(devicePixelRatio,1.5);
renderer.setPixelRatio(walkPixelRatio);renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
const scene=new THREE.Scene();scene.background=new THREE.Color('#c8d7df');scene.fog=new THREE.Fog('#c8d7df',240,980);
const pmrem=new THREE.PMREMGenerator(renderer),env=new RoomEnvironment();scene.environment=pmrem.fromScene(env,.04).texture;env.dispose();pmrem.dispose();
scene.environmentIntensity=.6;
const hemisphere=new THREE.HemisphereLight(0xd9eeff,0x8b9474,1.0);scene.add(hemisphere);
const sun=new THREE.DirectionalLight(0xfff1d4,2.2);sun.position.set(-40,100,-25);sun.castShadow=true;
sun.shadow.mapSize.set(4096,4096);sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;sun.shadow.camera.near=1;sun.shadow.camera.far=220;sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;
sun.target.position.set(39,5,-40);
if(bakedReady){sun.position.copy(sun.target.position).add(new THREE.Vector3(-.689254,.714246,.121581).multiplyScalar(140));sun.intensity=1.35;}
scene.add(sun,sun.target);
const camera=new THREE.PerspectiveCamera(66,innerWidth/innerHeight,.12,1100);camera.rotation.order='YXZ';
const timeOfDay=createTimeOfDay(scene,renderer,sun,hemisphere);
function setTimeOfDay(mode,updateUrl=true){
 const currentMode=timeOfDay.set(mode);
 for(const id of ['timeOfDay','presentationTimeOfDay']){
  const button=$(id);button.textContent=currentMode==='sunset'?'🌅 Sunset':'☀ Daytime';
  button.setAttribute('aria-pressed',String(currentMode==='sunset'));
  button.setAttribute('aria-label',currentMode==='sunset'?'Sunset lighting. Switch to daytime':'Daytime lighting. Switch to sunset');
 }
 document.body.dataset.timeOfDay=currentMode;
 if(updateUrl){const url=new URL(location.href);if(currentMode==='sunset')url.searchParams.set('time','sunset');else url.searchParams.delete('time');history.replaceState(null,'',url);}
 dirty=true;
}
const taskLights=Array.from({length:3},()=>{const l=new THREE.PointLight(0xfff9e7,7,10,2);scene.add(l);return l;});
const player={x:6,y:-10,z:0,yaw:0,pitch:0,level:'ground'};let ready=false,mode='walk',current=null,tourIndex=-1,visited=new Set(),lastTime=performance.now(),mapLevel='roof',drag=null,doorNodes=[],batchCount=0,meshCount=0,lastHUD=0,dirty=true;
setTimeOfDay(new URLSearchParams(location.search).get('time'),false);
const keys=new Set(),pointer={held:null},doorStates=new Map(),radius=.20;
let lastWalkPosition={x:6,y:-10,z:0,level:'ground'};
const siteContext=addMappedMallContext(scene,mapContext);
document.body.dataset.siteContext=JSON.stringify(siteContext);
let presentationActive=false;
function presentation(enabled){presentationActive=enabled;camera.fov=enabled?74:66;camera.updateProjectionMatrix();const ratio=enabled?presentationPixelRatio:walkPixelRatio;if(renderer.getPixelRatio()!==ratio){renderer.setPixelRatio(ratio);renderer.setSize(innerWidth,innerHeight);}dirty=true;document.body.classList.toggle('presenting',enabled);$('presentationBar').hidden=!enabled;keys.clear();pointer.held=null;if(document.pointerLockElement)document.exitPointerLock();if(enabled){$('presentationTitle').textContent=current?current.id+' · '+current.name:'Melooloo HQ · Front entrance';$('presentationReference').hidden=!current?.photo;$('presentationExit').focus();}else $('present').focus();}
const roomPresentationViews={S06:{position:[27.30,8.70],target:[28.15,10.4,5.80]},S07:{position:[32.45,8.45],target:[31.15,10.6,6.03]},S08:{position:[36.0,8.4],target:[34.8,10.2,5.80]},S09:{position:[40.15,8.55],target:[38.45,11.35,6.03]},S10:{position:[43.45,8.65],target:[41.95,10.20,6.05]},S12:{position:[47.90,9.1],target:[45.5,9.7,6.0]},S13:{position:[51.25,8.95],target:[50.05,10.45,5.95]},S15:{position:[59.15,8.55],target:[57.65,9.55,5.85]},S16:{position:[21.55,11.2],target:[19.70,9.0,.65]},S19:{position:[33.0,9.3],target:[33.65,12.1,.95]},S20:{position:[38.4,9.45],target:[37.25,11.0,.94]},S24:{position:[63.0,6.0],target:[62.7,8.20,.80]},S26:{position:[10.0,-8.2],target:[12.8,-4.6,1.0]},G11:{position:[7.8,35.6],target:[5.7,36.0,5.77]}};
function roomCameraPoint(q,p){const valid=(x,y)=>x>q.x+.3&&x<q.x+q.width-.3&&y>q.y+.3&&y<q.y+q.depth-.3&&!blocked(x,y,player.level);if(valid(...p))return p;for(let r=.25;r<=1.5;r+=.25)for(let a=0;a<Math.PI*2;a+=Math.PI/12){const v=[p[0]+r*Math.cos(a),p[1]+r*Math.sin(a)];if(valid(...v))return v;}return null;}
function presentationInspect(){const q=layout.rooms.find(q=>q.id&&!['S11','S25','S26'].includes(q.id)&&q.id===current?.id),v=roomPresentationViews[current?.id];if(q){enterRoom();const p=v&&roomCameraPoint(q,v.position);if(p)[player.x,player.y]=p;orient(v?.target||[q.x+q.width/2,q.y+q.depth*.64,q.z+1.15]);}else if(v){[player.x,player.y]=safePoint(...v.position,player.level);orient(v.target);}document.body.dataset.presentationPose=JSON.stringify({room:current?.id,x:player.x,y:player.y,z:player.z,yaw:player.yaw,pitch:player.pitch});dirty=true;updateHUD();}
function presentationStop(delta){const i=layout.tour.indexOf(current?.id);tour(i<0?0:(i+delta+layout.tour.length)%layout.tour.length);presentationInspect();}
function savePresentationImage(){
 const captureID=current?.id||'Front',lightLabel=timeOfDay.mode==='sunset'?'Sunset':'Daytime',saveButton=$('presentationSave');saveButton.disabled=true;
 applyCamera();
 timeOfDay.follow(camera);
 renderer.render(scene,camera);
 const image=document.createElement('canvas');image.width=canvas.width;image.height=canvas.height;
 const ctx=image.getContext('2d');ctx.drawImage(canvas,0,0);
 const scale=image.width/1280,h=64*scale;ctx.fillStyle='rgba(249,250,242,.94)';ctx.fillRect(0,image.height-h,image.width,h);
 ctx.fillStyle='#234237';ctx.font=`600 ${18*scale}px Arial`;ctx.fillText(current?current.id+' · '+current.name:'Melooloo HQ · Front entrance',24*scale,image.height-34*scale);
 ctx.font=`${12*scale}px Arial`;ctx.fillText('MELOOLOO · Proposed facility design · '+lightLabel+' lighting',24*scale,image.height-14*scale);
 image.toBlob(blob=>{if(blob){const a=document.createElement('a');a.download='Melooloo_'+captureID+'_'+lightLabel+'_Proposed.png';a.href=URL.createObjectURL(blob);document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),30000);}saveButton.disabled=false;},'image/png');dirty=true;
}
const point=(a)=>new THREE.Vector3(a[0],a[2],-a[1]);
const isRoof=z=>z>3;
const showError=e=>{console.error(e);$('loading').hidden=false;$('loadText').textContent='The model could not load. Reload the page after starting the local server. '+e.message;};

// Grid index keeps collision checks responsive across the whole 18-module campus.
const grid=new Map(),cell=2;
for(const c of nav.colliders){const level=c.level==='external'?'ground':c.level;for(let x=Math.floor((c.x0-.3)/cell);x<=Math.floor((c.x1+.3)/cell);x++)for(let y=Math.floor((c.y0-.3)/cell);y<=Math.floor((c.y1+.3)/cell);y++){let k=level+':'+x+':'+y;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(c)}}
function blocked(x,y,level,ignoreEquipment=false){
 const bounds=level==='roof'?[.35,77.65,.35,85.65]:[-8,102,-21,21];
 if(x<bounds[0]||x>bounds[1]||y<bounds[2]||y>bounds[3])return true;
 for(const c of grid.get(level+':'+Math.floor(x/cell)+':'+Math.floor(y/cell))||[]){if(ignoreEquipment&&c.kind==='equipment')continue;const nx=Math.max(c.x0,Math.min(x,c.x1)),ny=Math.max(c.y0,Math.min(y,c.y1));if((nx-x)**2+(ny-y)**2<radius**2)return true;}
 // Stair opening is accessible through its actual landings/flights only.
 if(level==='roof'&&x>1.5&&x<5.5&&y>1&&y<7){const supported=(x>=4&&x<=5.25&&y<=5.78)||(x>=1.8&&x<=5.4&&y>=5.78)||(x>=2&&x<=3.2&&y>=2&&y<=5.78);if(!supported)return true;}
 return false;
}
function floorAt(x,y){
 if(x>=2.05&&x<=3.15&&y>=1.85&&y<=5.78&&player.z<3.1)return Math.max(0,Math.min(2.5,(y-2)/3.78*2.5));
 if(x>=1.85&&x<=5.35&&y>=5.78&&y<=7&&player.z>1.8&&player.z<3.3)return 2.5;
 if(x>=4.05&&x<=5.15&&y>=1.8&&y<=5.78&&player.z>1.8)return Math.max(2.5,Math.min(5,2.5+(5.78-y)/3.78*2.5));
 return player.level==='roof'?5:0;
}
function move(dx,dy){if(!ready||mode!=='walk')return;const level=player.z>3.3?'roof':'ground';let moved=false;
 const targetZ=floorAt(player.x+dx,player.y+dy);
 if(Math.abs(targetZ-player.z)>.28){$('movementStatus').textContent='Use the stairs or lift to change level';return;}
 if(Math.abs(dx)>1e-7&&!blocked(player.x+dx,player.y,level)){player.x+=dx;moved=true;}if(Math.abs(dy)>1e-7&&!blocked(player.x,player.y+dy,level)){player.y+=dy;moved=true;}
 if(moved){dirty=true;player.z=floorAt(player.x,player.y);if(player.z>4.85)player.level='roof';else if(player.z<.15)player.level='ground';$('movementStatus').textContent='';}else $('movementStatus').textContent='Wall, equipment or crop row · follow the aisle';
}
function step(direction,amount=.72){if(direction==='up'||direction==='down'){if(mode==='fly'){player.z=THREE.MathUtils.clamp(player.z+(direction==='up'?1:-1),1,130);dirty=true;updateHUD();}return;}
 const f={x:Math.sin(player.yaw),y:Math.cos(player.yaw)},s={x:Math.cos(player.yaw),y:-Math.sin(player.yaw)};
 const v=direction==='forward'?f:direction==='back'?{x:-f.x,y:-f.y}:direction==='left'?{x:-s.x,y:-s.y}:s;
 if(mode==='fly'){flyMove(v.x*1.6,v.y*1.6,0);updateHUD();return;}
 for(let i=0;i<Math.ceil(amount/.08);i++)move(v.x*amount/Math.ceil(amount/.08),v.y*amount/Math.ceil(amount/.08));updateHUD();}
function orient(target){const dx=target[0]-player.x,dy=target[1]-player.y,dz=target[2]-(player.z+1.65);player.yaw=Math.atan2(dx,dy);player.pitch=Math.atan2(dz,Math.hypot(dx,dy));}
function safePoint(x,y,level){if(!blocked(x,y,level))return [x,y];for(let r=.25;r<=2;r+=.25)for(let a=0;a<Math.PI*2;a+=Math.PI/12){let p=[x+Math.cos(a)*r,y+Math.sin(a)*r];if(!blocked(...p,level))return p;}return [x,y];}
function flyMove(dx,dy,dz){if(!ready||mode!=='fly')return;player.x=THREE.MathUtils.clamp(player.x+dx,-300,300);player.y=THREE.MathUtils.clamp(player.y+dy,-675,315);player.z=THREE.MathUtils.clamp(player.z+dz,1,130);dirty=true;}
function land(){if(mode!=='fly')return;const inRoof=player.x>.5&&player.x<77.5&&player.y>.5&&player.y<85.5&&player.z>=4,inHub=player.x>-8&&player.x<102&&player.y>-21&&player.y<21;let level=inRoof?'roof':'ground';let x=THREE.MathUtils.clamp(player.x,level==='roof'?.55:-7.5,level==='roof'?77.45:101.5),y=THREE.MathUtils.clamp(player.y,level==='roof'?.55:-20.5,level==='roof'?85.45:20.5);let point=null;
 for(let r=0;r<=12&&!point;r+=.35)for(let a=0;a<Math.PI*2;a+=Math.PI/16){const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(!blocked(px,py,level)){point=[px,py];break;}}
 if(!point||(!inRoof&&!inHub)){level=lastWalkPosition.level;point=[lastWalkPosition.x,lastWalkPosition.y];const id=decodeURIComponent(location.hash.slice(1));const destination=layout.destinations.find(d=>d.id===id);if(destination){current=destination;showDetail(destination);}}
 [player.x,player.y]=point;player.level=level;player.z=level==='roof'?5:0;mode='walk';keys.clear();pointer.held=null;dirty=true;$('movementStatus').textContent='Landed on '+(level==='roof'?'roof campus':'ground hub');mapLevel=level;renderMap();updateHUD();}
function toggleFly(){if(!ready)return;if(mode==='fly'){land();return;}if(presentationActive)presentation(false);lastWalkPosition={x:player.x,y:player.y,z:player.z,level:player.level};const fromOverview=mode==='overview';if(fromOverview){player.x=camera.position.x;player.y=-camera.position.z;player.z=camera.position.y-1.65;player.yaw=-camera.rotation.y;player.pitch=camera.rotation.x;}mode='fly';if(!fromOverview){player.z=Math.max(player.z+10,15);player.pitch=Math.min(player.pitch,-.35);}keys.clear();pointer.held=null;dirty=true;$('movementStatus').textContent='Fly mode · Space up · C down · F to land';canvas.focus();updateHUD();}
function go(id,updateHash=true){const d=layout.destinations.find(d=>d.id===id);if(!d||!ready)return;mode='walk';dirty=true;$('movementStatus').textContent='';keys.clear();if(document.pointerLockElement)document.exitPointerLock();player.level=d.level==='roof'?'roof':'ground';player.z=player.level==='roof'?5:0;[player.x,player.y]=safePoint(d.position[0],d.position[1],player.level);orient(d.target);current=d;visited.add(id);showDetail(d);mapLevel=player.level;renderMap();updateHUD();if(innerWidth<700)$('navigator').classList.add('hidden');if(updateHash)location.hash=id;}
function showDetail(d){$('airSensors').hidden=$('solutionSensors').hidden=!(infrastructureReady&&d.id==='G11');$('iotPilot').hidden=!(['G11','G06','G04'].includes(d.id)&&infrastructureReady);$('iotWetPilot').hidden=!(['G11','G06'].includes(d.id)&&infrastructureReady);$('sectionId').textContent=d.id+' · '+(d.level==='roof'?'ROOF CAMPUS':d.level==='external'?'EXTERIOR SERVICE':'GROUND HUB');$('sectionName').textContent=d.name;$('purpose').textContent=d.purpose;$('equipment').textContent=d.equipment;$('source').textContent=d.source;$('reference').hidden=!d.photo;$('presentationReference').hidden=!d.photo;$('enterRoom').hidden=!layout.rooms.find(q=>q.id===d.id&&!['S11','S25','S26'].includes(q.id));$('enterRoom').textContent='Enter '+d.id;$('detail').classList.remove('collapsed');for(const b of document.querySelectorAll('#destinations button'))b.setAttribute('aria-current',b.dataset.id===d.id?'true':'false');}
$('airSensors').addEventListener('click',()=>{go('G11');const v=infrastructureViews.G11_AIR;if(v){[player.x,player.y]=safePoint(v.position[0],v.position[1],'roof');orient(v.target);dirty=true;updateHUD();}});
$('solutionSensors').addEventListener('click',()=>go('G11'));
// A close inspection pose for the GH01-only research pilot above the rear crop bay.
$('iotPilot').addEventListener('click',()=>{go('G11');[player.x,player.y]=[7.8,36.5];player.z=7.3;mode='fly';orient([8.05,34.5,7.84]);dirty=true;updateHUD();$('movementStatus').textContent='GH01 pilot · flight view over the crop · proposed devices';});
$('iotWetPilot').addEventListener('click',()=>{go('G06');[player.x,player.y]=safePoint(7.8,35.6,'roof');orient([5.4,36.9,5.88]);dirty=true;updateHUD();$('movementStatus').textContent='GH01 tank and solution pilot devices are proposed';});
function enterRoom(){if(!current)return;const q=layout.rooms.find(q=>q.id===current.id);if(!q)return;const id=q.id+'_F',door=nav.doors.find(d=>d.id===id);if(!door)return;doorStates.set(id,1);player.x=door.x;player.y=q.y-.6;player.z=q.z;player.level=q.z?'roof':'ground';player.yaw=0;player.pitch=0;for(let i=0;i<22;i++)move(0,.065);updateHUD();}
function lift(){dirty=true;const l=layout.lift;if(Math.hypot(player.x-13.5,player.y-2.4)>4.2){$('movementStatus').textContent='Lift is near the front entrance · use the map to find it';return;}player.level=player.level==='roof'?'ground':'roof';player.z=player.level==='roof'?5:0;player.x=13.5;player.y=2.4;player.yaw=Math.PI;player.pitch=0;mode='walk';mapLevel=player.level;renderMap();$('movementStatus').textContent='Arrived at '+(player.level==='roof'?'roof production campus':'ground packing hub');updateHUD();}
function home(updateHash=true){$('airSensors').hidden=$('solutionSensors').hidden=$('iotPilot').hidden=$('iotWetPilot').hidden=true;dirty=true;mode='walk';player.level='ground';player.z=0;player.x=6;player.y=-10;orient(layout.start.target);current=null;mapLevel='ground';renderMap();$('sectionId').textContent='FRONT ENTRANCE';$('sectionName').textContent='Welcome to Melooloo HQ';$('purpose').textContent='Start at the front, walk through the packing hub, then take the stairs or lift to the roof campus.';$('reference').hidden=true;$('enterRoom').hidden=true;updateHUD();if(updateHash)location.hash='front';}
function renderMap(){
 const roof=mapLevel==='roof';const box=roof?'−2 −4 82 94'.replaceAll('−','-'):'-9 -23 112 48';
 let s=`<svg viewBox="${box}" role="img" aria-label="${roof?'Roof production campus':'Ground packing hub'}"><rect x="0" y="0" width="78" height="${roof?86:18}" rx=".2" fill="#f5f4e9" stroke="#acba9d" stroke-width=".3"/>`;
 if(roof)for(const p of layout.greenhouses)s+=`<g><rect class="mapGH" data-go="${p.id}" x="${p.x}" y="${p.y}" width="10" height="20"/><text x="${p.x+2}" y="${p.y+10}">${p.id}</text></g>`;
 for(const q of layout.rooms.filter(q=>roof?q.level==='roof':q.level!=='roof'))s+=`<g><rect class="mapRoom" data-go="${q.id}" x="${q.x}" y="${q.y}" width="${q.width}" height="${q.depth}"/><text x="${q.x+.2}" y="${q.y+q.depth/2}">${q.id}</text></g>`;
 s+='<rect x="12" y="1" width="3" height="3" fill="#d0a062"/><text x="16" y="3">LIFT</text><rect x="2" y="2" width="3.2" height="5" fill="#bcc6b0"/>';
 s+='<circle id="mapPlayer" class="player" r="1.05" cx="'+player.x+'" cy="'+player.y+'"/><path id="mapDirection" fill="#db8a34" d="M0 -1 L-.7 .5 L.7 .5Z"/>';
 s+=`<text x="3" y="${roof?-1:-19}" style="font-size:2.1px">${roof?'ROOF · PROPOSED 78 × 86 m':'FRONT ENTRANCE / GROUND HUB'}</text></svg>`;
 $('map').innerHTML=s;for(const r of $('map').querySelectorAll('[data-go]'))r.addEventListener('click',()=>go(r.dataset.go));
 $('ground').classList.toggle('active',!roof);$('roof').classList.toggle('active',roof);updateMapDot();
}
function updateMapDot(){const a=$('mapPlayer'),b=$('mapDirection');if(!a)return;a.style.display=mapLevel===player.level?'':'none';b.style.display=a.style.display;a.setAttribute('cx',player.x);a.setAttribute('cy',player.y);b.setAttribute('transform',`translate(${player.x} ${player.y}) rotate(${-player.yaw*180/Math.PI+180}) translate(0 -1.4)`);}
function renderList(){const term=$('search').value.toLowerCase();const groups=[['STAIRS & LIFT',layout.destinations.filter(d=>d.id.startsWith('LIFT')||d.id.startsWith('STAIR'))],['SHARED ROOMS & SERVICES',layout.destinations.filter(d=>/^S\d/.test(d.id))],['INSIDE THE GREENHOUSE · GH01',layout.destinations.filter(d=>/^G\d/.test(d.id))],['ALL 18 GREENHOUSE MODULES',layout.destinations.filter(d=>d.id.startsWith('GH'))],['EVERY CORNER',layout.destinations.filter(d=>d.id.startsWith('CORNER'))]];
 $('destinations').replaceChildren();for(const [name,items] of groups){const matches=items.filter(d=>(d.id+' '+d.name+' '+d.purpose).toLowerCase().includes(term));if(!matches.length)continue;const title=document.createElement('p');title.className='group';title.textContent=name;$('destinations').append(title);for(const d of matches){const b=document.createElement('button');b.dataset.id=d.id;b.setAttribute('aria-current',current?.id===d.id?'true':'false');const n=document.createElement('b');n.textContent=d.id.startsWith('CORNER')?d.id.slice(7):d.id.startsWith('LIFT')?'LIFT':d.id.startsWith('STAIR')?'STAIR':d.id;const t=document.createElement('span');t.textContent=d.name;b.append(n,t);b.addEventListener('click',()=>go(d.id));$('destinations').append(b);}}if(!$('destinations').children.length)$('destinations').textContent='No matching section.';}
function updateHUD(){const level=mode==='fly'?'Flying':player.z>3.3?'Roof':player.z>.15?'Stairs':'Ground';$('position').textContent=`${level} · x ${player.x.toFixed(1)} / y ${player.y.toFixed(1)} · height ${player.z.toFixed(2)} m`;$('position').dataset.x=player.x.toFixed(3);$('position').dataset.y=player.y.toFixed(3);$('position').dataset.z=player.z.toFixed(3);$('position').dataset.level=player.level;$('position').dataset.mode=mode;$('position').dataset.visited=visited.size;$('fly').textContent=mode==='fly'?'Land · F':'Fly · F';$('fly').setAttribute('aria-pressed',mode==='fly'?'true':'false');document.body.dataset.navigationMode=mode;if(presentationActive)$('presentationTitle').textContent=current?current.id+' · '+current.name:'Melooloo HQ · Front entrance';updateMapDot();}
function tour(i){tourIndex=Math.max(0,Math.min(layout.tour.length-1,i));go(layout.tour[tourIndex]);$('tourProgress').textContent=`Guided tour · ${tourIndex+1} / ${layout.tour.length}`;$('startTour').textContent=tourIndex===layout.tour.length-1?'Restart tour':'Continue';}

// Preserve dynamic door hierarchies; batch the thousands of repeated static meshes.
function dynamicNode(o){for(let p=o;p;p=p.parent)if(p.userData.door_id)return true;return false;}
function batch(root,placements=[new THREE.Matrix4()]){
 root.updateMatrixWorld(true);const groups=new Map(),remove=[];const m=new THREE.Matrix4(),world=new THREE.Matrix4();
 root.traverse(o=>{if(!o.isMesh||dynamicNode(o))return;const base=o.geometry.uuid+'|'+(Array.isArray(o.material)?o.material.map(m=>m.uuid).join():o.material.uuid);for(let pi=0;pi<placements.length;pi++){const p=placements[pi],key=base+'|'+pi;if(!groups.has(key))groups.set(key,{geo:o.geometry,mat:o.material,matrices:[],name:o.name});const g=groups.get(key);if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);world.copy(o.matrixWorld).multiply(m);g.matrices.push(p.clone().multiply(world));}}else g.matrices.push(p.clone().multiply(o.matrixWorld));}remove.push(o);});
 for(const g of groups.values()){const o=new THREE.InstancedMesh(g.geo,g.mat,g.matrices.length);o.name='Batch '+g.name;for(let i=0;i<g.matrices.length;i++)o.setMatrixAt(i,g.matrices[i]);o.instanceMatrix.needsUpdate=true;o.castShadow=!g.mat.transparent;o.receiveShadow=true;o.computeBoundingSphere();if(g.mat.name?.toLowerCase().includes('botanical')){o.userData.fullLeaf=g.geo;leafBatches.push(o);}scene.add(o);batchCount++;meshCount+=g.matrices.length;}
 for(const o of remove)o.removeFromParent();root.traverse(o=>{if(o.userData.door_id)doorNodes.push(o);if(o.isMesh){o.castShadow=false;o.receiveShadow=true;}});if(placements.length===1)scene.add(root);
}
function canvasTexture(kind){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');let seed=28;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 if(kind==='floor'){ctx.fillStyle='#bfc1b8';ctx.fillRect(0,0,512,512);for(let i=0;i<21000;i++){const a=rand()*.11;ctx.fillStyle=rand()>.5?`rgba(255,255,255,${a})`:`rgba(28,37,26,${a})`;ctx.fillRect(rand()*512,rand()*512,1+rand()*2,1+rand()*2)}ctx.strokeStyle='#a9b0a5';ctx.lineWidth=1;ctx.strokeRect(1,1,510,510);}
 else {ctx.fillStyle='#aab383';ctx.fillRect(0,0,512,512);const pts=[];for(let y=-1;y<10;y++)for(let x=-1;x<10;x++)pts.push([x*59+(y%2)*29+rand()*22,y*58+rand()*22]);ctx.strokeStyle='#dad9b3';ctx.lineWidth=2.8;for(let i=0;i<pts.length;i++){const p=pts[i],near=pts.map((q,j)=>({q,j,d:(q[0]-p[0])**2+(q[1]-p[1])**2})).filter(q=>q.j!==i).sort((a,b)=>a.d-b.d).slice(0,3);for(const {q} of near){ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.stroke()}}}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const floorTex=canvasTexture('floor'),melonTex=canvasTexture('melon');
const leafBatches=[];
function leafGeometry(n=12){
 const p=[0,.025,0],uv=[.5,.5],ix=[];
 for(const ring of [.50,1])for(let i=0;i<n;i++){const a=2*Math.PI*i/n,r=higgsfieldReady ? .148+.029*Math.cos(3*a)+.014*Math.cos(5*a)+.004*Math.cos(17*a) : .105+.017*Math.cos(3*a)+.007*Math.cos(7*a),x=Math.cos(a)*r*ring,y=Math.sin(a)*r*ring*(higgsfieldReady?1.07:1.05),z=.025-.05*ring**2+.012*Math.sin(3*a)*ring+(higgsfieldReady ? .006*Math.sin(7*a) : .008*Math.sin(5*a))*ring**2;p.push(x,z,-y);uv.push(.5+x/(higgsfieldReady ? .39 : .27),.5+y/(higgsfieldReady ? .41 : .28));}
 for(let i=0;i<n;i++){const a=1+i,b=1+(i+1)%n;ix.push(0,a,b,a,n+a,n+b,a,n+b,b);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.computeBoundingSphere();return g;
}
const distantLeaf=leafGeometry();
function updateLeafLOD(){for(const o of leafBatches){const distance=camera.position.distanceTo(o.boundingSphere.center);const near=o.userData.nearLeaf?distance<38:distance<27;if(o.userData.nearLeaf!==near){o.geometry=near?o.userData.fullLeaf:distantLeaf;o.userData.nearLeaf=near;}}}
function useBakedDiffuse(m){
 if(!m.userData.bake_lightmap||!m.emissiveMap)return;
 m.lightMap=m.emissiveMap;m.lightMap.colorSpace=THREE.NoColorSpace;m.lightMapIntensity=1.05*(m.userData.lightmap_decode_scale||1);
 m.emissiveMap=null;m.emissive.set(0x000000);m.emissiveIntensity=0;
 m.onBeforeCompile=shader=>{
   shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
     #ifdef USE_LIGHTMAP
       reflectedLight.directDiffuse = vec3(0.0);
       reflectedLight.indirectDiffuse = material.diffuseColor * texture2D(lightMap, vLightMapUv).rgb * lightMapIntensity;
     #endif`);
 };
 m.customProgramCacheKey=()=> 'melooloo-baked-diffuse-v1';
}
// Opt-in local benchmark uses the same movement/collision and rendering path as walking.
const benchmarkEnabled=new URLSearchParams(location.search).has('benchmark');
const benchmark={phase:'waiting',frames:[],draws:[],started:0,warmFrames:0};
function runBenchmark(time){
 if(!benchmarkEnabled||!ready)return;
 if(benchmark.phase==='waiting'){go('G04');benchmark.phase='warming';}
 if(benchmark.phase==='warming'){
   dirty=true;if(benchmark.warmFrames<40)return;
   benchmark.phase='measuring';benchmark.started=time;
 }
 const elapsed=time-benchmark.started;
 if(elapsed<6000){move(0,.00045*Math.min(45,time-lastTime));dirty=true;return;}
 if(benchmark.phase!=='complete'){
   benchmark.phase='complete';const a=benchmark.frames.slice().sort((x,y)=>x-y),b=benchmark.draws.slice().sort((x,y)=>x-y);
   const q=(v,p)=>v[Math.min(v.length-1,Math.floor(v.length*p))]||0;
   const result={frames:a.length,medianFrameMs:q(a,.5),p95FrameMs:q(a,.95),medianFPS:1000/(q(a,.5)||1),medianDrawCpuMs:q(b,.5),p95DrawCpuMs:q(b,.95),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,batches:batchCount,meshInstances:meshCount,viewport:[innerWidth,innerHeight],pixelRatio:renderer.getPixelRatio(),lighting:document.body.dataset.lighting||'original'};
   document.body.dataset.benchmark=JSON.stringify(result);home();
 }
}
function separateCoplanarFloors(root){
 // The source puts room and greenhouse floors directly on the apron or roof
 // slab. Equal depth makes two materials alternate as the camera moves.
 root.updateMatrixWorld(true);let shifted=0;
 root.traverse(o=>{
  if(!o.isMesh)return;const name=o.userData.name||o.name;
  if(!/^WT_S\d\d_Floor/.test(name)&&!name.startsWith('BK_RoomSurfaces_BK_Lit_rooms_light_BK_PBR_concrete')&&!name.includes('ProtectedFloor'))return;
  const raised=o.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,.025,0));
  o.position.copy(o.parent.worldToLocal(raised));o.updateMatrix();shifted++;
 });
 return shifted;
}
function replaceServiceFloors(root){
 // A shared roof slab carries the old equipment bake. Clean local top surfaces
 // replace only the three changed service-room regions.
 const material=new THREE.MeshStandardMaterial({name:'Service room concrete',map:floorTex,color:'#c6c8bd',roughness:.95,metalness:0});material.userData.finished=true;
 for(const q of layout.rooms.filter(q=>['S08','S09','S10'].includes(q.id))){
  const old=[];root.traverse(o=>{if(o.isMesh&&(o.userData.name||o.name).startsWith('WT_'+q.id+'_Floor'))old.push(o);});for(const o of old)o.removeFromParent();
  const geometry=new THREE.PlaneGeometry(q.width,q.depth);geometry.rotateX(-Math.PI/2);geometry.translate(q.x+q.width/2,q.z+.050,-q.y-q.depth/2);
  const p=geometry.attributes.position,uv=[];for(let i=0;i<p.count;i++)uv.push(p.getX(i)/2,p.getZ(i)/2);geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  const floor=new THREE.Mesh(geometry,material);floor.name='WT_'+q.id+'_FloorReplacement';floor.userData={section_id:q.id,design_status:'proposed service finish'};floor.receiveShadow=true;root.add(floor);
 }
 document.body.dataset.serviceFloorReplacements='3';
}
function finishMaterials(root){root.traverse(o=>{if(!o.isMesh)return;
 if((o.userData.name||o.name).startsWith('WT_GroundApron')){
  o.updateWorldMatrix(true,false);o.geometry=o.geometry.clone();const p=o.geometry.attributes.position,uv=[],v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);uv.push(v.x/2,v.z/2);}o.geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  const m=new THREE.MeshStandardMaterial({name:'Exterior apron concrete',map:floorTex,color:'#bdc3bf',roughness:.95,metalness:0});m.userData.finished=true;o.material=m;
 }
 if((o.userData.name||o.name).startsWith('WT_S26_Floor')){const m=new THREE.MeshStandardMaterial({name:'Delivery apron concrete',map:floorTex,color:'#c0c3b8',roughness:.94,metalness:0});m.userData.finished=true;o.material=m;}
 if((o.userData.name||o.name).startsWith('WT_S26_Canopy')){const m=new THREE.MeshStandardMaterial({name:'Delivery canopy coated steel',color:'#b2bab4',roughness:.72,metalness:.5});m.userData.finished=true;o.material=m;}
 for(const m of(Array.isArray(o.material)?o.material:[o.material])){
 if(m.userData.finished)continue;m.userData.finished=true;const name=m.name.toLowerCase();m.envMapIntensity=.7;
 if(name.startsWith('hf_')){if(name.includes('botanical')||name.includes('cotyledonleaf'))m.side=THREE.DoubleSide;if(name.includes('clear_poly')){m.transparent=true;m.opacity=.23;m.depthWrite=false;m.side=THREE.DoubleSide;if('transmission' in m)m.transmission=0;}
 if(name.includes('insectnet')){m.transparent=true;m.opacity=1;m.alphaTest=.015;m.depthWrite=false;m.side=THREE.DoubleSide;if(m.map)m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();}
 if(name.includes('uv_film')||name.includes('panelwindow')){m.transparent=true;m.depthWrite=false;m.side=THREE.DoubleSide;}
 m.needsUpdate=true;continue;}
 if(name.startsWith('bk_')){if(m.map)m.map.colorSpace=THREE.NoColorSpace;if(name.includes('steel')){m.roughness=.7;m.metalness=.55;}useBakedDiffuse(m);m.needsUpdate=true;continue;}
 if(name.includes('steel')){m.metalness=.65;m.roughness=.52;}
 if(name.includes('film')||name.includes('mesh')||name.includes('glass')){m.transparent=true;m.opacity=name.includes('film')?.18:name.includes('mesh')?.09:.24;m.side=THREE.DoubleSide;m.depthWrite=false;if('transmission' in m)m.transmission=0;}
 if(name.includes('leaf')){m.side=THREE.DoubleSide;m.roughness=.75;m.color.set(m.map?'#ffffff':name.includes('leaf2')?'#527542':'#3d7139');}
 if(name.includes('melon')){m.map=melonTex;m.color.set('#ffffff');m.roughness=.73;}
 if(name.includes('floor')){m.map=floorTex;m.color.set('#ffffff');m.roughness=.92;}
 }});
 // Manual base meshes need usable UVs for procedural web material detail.
const seen=new Set();root.traverse(o=>{if(!o.isMesh||seen.has(o.geometry))return;seen.add(o.geometry);const g=o.geometry;if(g.attributes.uv)return;const p=g.attributes.position,n=g.attributes.normal,uv=[];for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const nx=n?.getX(i)||0,ny=n?.getY(i)||0,nz=n?.getZ(i)||0;if(Math.abs(ny)>.7)uv.push(x+.5,z+.5);else if(Math.abs(nx)>.7)uv.push(z+.5,y+.5);else uv.push(x+.5,y+.5);}g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));});
}
function webPlantDetail(root){const sphere=new THREE.SphereGeometry(1,16,10),cylinder=new THREE.CylinderGeometry(1,1,1,12,1);root.traverse(o=>{if(!o.isMesh||!o.name.includes('Plant_R')||o.userData.higgsfield_pilot)return;if(o.name.includes('_fruit'))o.geometry=sphere;else if(/_(stem|training|petiole|sling)/.test(o.name))o.geometry=cylinder;});}
function mergeModuleStructures(root,shared=false){
 root.updateMatrixWorld(true);const groups=new Map(),removed=[],instance=new THREE.Matrix4(),world=new THREE.Matrix4();
 root.traverse(o=>{
  if(!o.isMesh||!(shared?(o.name.startsWith('HF_ROOM_')||/^WT_S\d\d_/.test(o.name))&&!o.userData.bake_lightmap:o.name.startsWith('WT_Module_'))||o.name.includes('Plant_R')||dynamicNode(o)||Array.isArray(o.material)||o.material.transparent)return;
  const signature=Object.entries(o.geometry.attributes).map(([name,a])=>name+':'+a.itemSize+':'+a.normalized+':'+a.array.constructor.name).sort().join('|');
  const key=o.material.uuid+'|'+signature+'|'+Boolean(o.geometry.index);
  if(!groups.has(key))groups.set(key,{material:o.material,geometries:[],objects:[]});
  const group=groups.get(key);group.objects.push(o);
  for(let i=0;i<(o.isInstancedMesh?o.count:1);i++){
   world.copy(o.matrixWorld);if(o.isInstancedMesh){o.getMatrixAt(i,instance);world.multiply(instance);}
   const geometry=o.geometry.clone();deinterleaveGeometry(geometry);geometry.applyMatrix4(world);
   if(world.determinant()<0&&geometry.index){const a=geometry.index.array;for(let j=0;j<a.length;j+=3)[a[j+1],a[j+2]]=[a[j+2],a[j+1]];}
   group.geometries.push(geometry);
  }
 });
 for(const group of groups.values()){
  const geometry=mergeGeometries(group.geometries,false);
  if(geometry){const mesh=new THREE.Mesh(geometry,group.material);mesh.name='Merged module '+group.material.name;root.add(mesh);removed.push(...group.objects);}
  for(const part of group.geometries)part.dispose();
 }
 for(const object of removed)object.removeFromParent();
}
try{
 const loader=new GLTFLoader();$('progress').value=12;
 async function loadPublicFacility(){
  const response=await fetch('./assets/facility_higgsfield.glb.gz');
  if(!response.ok)throw new Error(`Facility model download failed (${response.status})`);
  const downloaded=await response.arrayBuffer(),bytes=new Uint8Array(downloaded);
  $('progress').value=40;$('loadText').textContent='Unpacking detailed greenhouse model…';
  const data=bytes[0]===0x1f&&bytes[1]===0x8b
   ?await new Response(new Blob([downloaded]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
   :downloaded;
  return loader.parseAsync(data,'./assets/');
 }
 const arch=presentationReady?await loader.loadAsync('./assets/facility_presentation.glb'):higgsfieldReady?await loadPublicFacility():await loader.loadAsync(bakedReady?'./assets/facility_baked.glb':'./assets/facility.glb',p=>{if(p.total){$('progress').value=12+p.loaded/p.total*35;$('loadText').textContent='Loading shared-room lighting and surfaces…';}});
 finishMaterials(arch.scene);document.body.dataset.separatedFacilityFloors=separateCoplanarFloors(arch.scene);if(sharedDetailReady)replaceServiceFloors(arch.scene);if(sharedDetailReady){const details=await applySharedRoomDetail(arch.scene,renderer);document.body.dataset.roomDetails=JSON.stringify(details);document.body.dataset.staffSanitation=JSON.stringify(addStaffSanitationDetail(arch.scene,scene));}if(complexAssetsReady){const result=await applyComplexAssets(arch.scene,loader,'facility');document.body.dataset.facilityComponents=JSON.stringify(result);}if(presentationReady||sharedDetailReady)mergeModuleStructures(arch.scene,true);batch(arch.scene);document.body.dataset.roomOpsFixtures=JSON.stringify(addRoomOpsFixtures(scene,layout));document.body.dataset.serviceRoomProps=JSON.stringify(addServiceRoomProps(scene,layout));document.body.dataset.dockDetail=JSON.stringify(addDockDetail(scene));document.body.dataset.reeferDetail=JSON.stringify(addReeferDetail(scene));$('progress').value=55;
 const module=await loader.loadAsync(infrastructureReady?'./assets/greenhouse_module_infrastructure.glb':higgsfieldReady?'./assets/greenhouse_module_higgsfield.glb':bakedReady?'./assets/greenhouse_module_baked.glb':'./assets/greenhouse_module.glb',p=>{if(p.total){$('progress').value=55+p.loaded/p.total*35;$('loadText').textContent='Placing greenhouse modules…';}});
 finishMaterials(module.scene);document.body.dataset.netFix=JSON.stringify(stabilizeGreenhouseNet(module.scene));document.body.dataset.separatedModuleFloors=separateCoplanarFloors(module.scene);if(complexAssetsReady){const result=await applyComplexAssets(module.scene,loader,'module');document.body.dataset.moduleComponents=JSON.stringify(result);}webPlantDetail(module.scene);if(bakedReady)mergeModuleStructures(module.scene);batch(module.scene,layout.greenhouses.map(p=>new THREE.Matrix4().makeTranslation(p.x,p.z,-p.y)));document.body.dataset.cropMicrodetail=JSON.stringify(addCropMicrodetail(scene));document.body.dataset.enclosureHardware=JSON.stringify(addEnclosureHardware(scene,layout.greenhouses));document.body.dataset.mechanicalCabinet=JSON.stringify(addMechanicalCabinetDetail(scene,layout.greenhouses));document.body.dataset.sensorTerminations=JSON.stringify(addSensorTerminations(scene,layout.greenhouses));document.body.dataset.iotPilot=JSON.stringify(addIoTPilotDetail(scene,layout.greenhouses));
 ready=true;$('progress').value=100;$('loading').hidden=true;document.body.dataset.ready='true';document.body.dataset.lighting=bakedReady?'Cycles baked':'original';document.body.dataset.realism=presentationReady||sharedDetailReady?'Detailed shared rooms + infrastructure + Higgsfield surfaces':infrastructureReady?'Detailed infrastructure + Higgsfield surfaces':higgsfieldReady?'Higgsfield surfaces + Blender detail':bakedReady?'Baked surfaces':'original';document.body.dataset.sensorsPerModule=infrastructureReady?'8':'baseline';document.body.dataset.batches=batchCount;document.body.dataset.meshInstances=meshCount;
 const initial=decodeURIComponent(location.hash.slice(1));renderList();renderMap();home(false);if(layout.destinations.some(d=>d.id===initial))go(initial,false);
}catch(e){showError(e);}

function applyCamera(){if(mode==='overview')return;camera.position.set(player.x,player.z+1.65,-player.y);camera.rotation.set(player.pitch,-player.yaw,0);}
function animate(time){const frameMs=time-lastTime,dt=Math.min(.045,frameMs/1000);runBenchmark(time);lastTime=time;
 if(ready){if(mode==='walk'||mode==='fly'){
   const speed=mode==='fly'?(keys.has('Shift')?16:7.5):(keys.has('Shift')?4.4:2.3);let f=Number(keys.has('w')||keys.has('ArrowUp'))-Number(keys.has('s')||keys.has('ArrowDown')),s=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft'));let vertical=mode==='fly'?Number(keys.has(' '))-Number(keys.has('c')):0;if(pointer.held){f=pointer.held==='forward'?1:pointer.held==='back'?-1:0;s=pointer.held==='right'?1:pointer.held==='left'?-1:0;vertical=pointer.held==='up'?1:pointer.held==='down'?-1:0;}
   if(f||s){const len=Math.hypot(f,s),dx=(Math.sin(player.yaw)*f+Math.cos(player.yaw)*s)*speed*dt/len,dy=(Math.cos(player.yaw)*f-Math.sin(player.yaw)*s)*speed*dt/len;if(mode==='fly')flyMove(dx,dy,0);else move(dx,dy);}
   if(vertical)flyMove(0,0,vertical*(keys.has('Shift')?10:5)*dt);
   applyCamera();
 }
 const nearRooms=layout.rooms.filter(q=>q.level===player.level).map(q=>({q,dist:Math.hypot(q.x+q.width/2-player.x,q.y+q.depth/2-player.y)})).sort((a,b)=>a.dist-b.dist);
 const selected=taskLights.map(light=>nearRooms.find(item=>item.q.id===light.userData.roomId&&item.dist<10.5)||null),used=new Set(selected.filter(Boolean).map(item=>item.q.id));
 taskLights.forEach((light,i)=>{if(selected[i])return;const next=nearRooms.find(item=>item.dist<9&&!used.has(item.q.id));selected[i]=next||null;if(next)used.add(next.q.id);});
 taskLights.forEach((light,i)=>{const item=selected[i],q=item?.q,target=q&&mode==='walk'?5*Math.max(0,Math.min(1,(9-item.dist)/4)):0;
  light.userData.roomId=q?.id||null;
  if(q){const position=new THREE.Vector3(q.x+q.width/2,q.z+2.65,-q.y-q.depth/2);light.position.lerp(position,1-Math.exp(-5*dt));}
  if(Math.abs(light.intensity-target)>.015){light.intensity=THREE.MathUtils.damp(light.intensity,target,7,dt);dirty=true;}else light.intensity=target;
 });
 for(const node of doorNodes){const id=node.userData.door_id,d=nav.doors.find(d=>d.id===id);if(!d)continue;const near=player.level===d.level&&Math.hypot(player.x-d.x,player.y-d.y)<1.6;const target=near?Math.PI/2:0;if(Math.abs(node.rotation.y-target)>.003){node.rotation.y=THREE.MathUtils.damp(node.rotation.y,target,7,dt);dirty=true;}}
 if(time-lastHUD>150){updateHUD();lastHUD=time;}
 if(dirty&&!document.hidden){updateLeafLOD();timeOfDay.follow(camera);const t=performance.now();renderer.render(scene,camera);if(benchmark.phase==='warming')benchmark.warmFrames++;if(benchmark.phase==='measuring'){benchmark.frames.push(frameMs);benchmark.draws.push(performance.now()-t);}dirty=false;}}
 requestAnimationFrame(animate);
}requestAnimationFrame(animate);

addEventListener('resize',()=>{dirty=true;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(!ready||id===current?.id)return;if(layout.destinations.some(d=>d.id===id)){go(id);if(presentationActive)presentationInspect();}});
addEventListener('keydown',e=>{if(!$('photoModal').hidden){if(e.key==='Escape')$('closePhoto').click();if(e.key==='Tab'){e.preventDefault();$('closePhoto').focus();}return;}if(e.target.matches('input'))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Shift',' ','c'].includes(k)){e.preventDefault();keys.add(k);}if(k==='f'&&!e.repeat){e.preventDefault();toggleFly();}if(k==='e'&&mode==='walk')lift();});addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));addEventListener('blur',()=>{keys.clear();pointer.held=null;});
canvas.addEventListener('pointerdown',e=>{canvas.focus();drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointerup',()=>drag=null);
canvas.addEventListener('pointermove',e=>{if(mode==='overview')return;dirty=true;if(document.pointerLockElement===canvas){player.yaw+=e.movementX*.003;player.pitch=THREE.MathUtils.clamp(player.pitch-e.movementY*.003,-1.1,1.1);}else if(drag){player.yaw+=(e.clientX-drag.x)*.005;player.pitch=THREE.MathUtils.clamp(player.pitch-(e.clientY-drag.y)*.005,-1.1,1.1);drag={x:e.clientX,y:e.clientY};}});
for(const b of document.querySelectorAll('[data-move]')){b.addEventListener('pointerdown',()=>pointer.held=b.dataset.move);b.addEventListener('pointerup',()=>pointer.held=null);b.addEventListener('pointerleave',()=>pointer.held=null);b.addEventListener('click',()=>{step(b.dataset.move);canvas.focus();});}
$('walk').addEventListener('click',()=>{dirty=true;if(mode==='fly')land();else mode='walk';keys.clear();canvas.focus();canvas.requestPointerLock?.().catch?.(()=>{});$('movementStatus').textContent='Walking · drag to look if cursor lock is unavailable';updateHUD();});$('fly').addEventListener('click',toggleFly);$('lift').addEventListener('click',lift);$('home').addEventListener('click',home);
$('menu').addEventListener('click',()=>$('navigator').classList.toggle('hidden'));$('close').addEventListener('click',()=>$('navigator').classList.add('hidden'));$('search').addEventListener('input',renderList);$('ground').addEventListener('click',()=>{mapLevel='ground';renderMap();});$('roof').addEventListener('click',()=>{mapLevel='roof';renderMap();});
$('overview').addEventListener('click',()=>{mode='overview';dirty=true;keys.clear();if(document.pointerLockElement)document.exitPointerLock();camera.position.set(80,67,8);camera.lookAt(39,5,-43);current={id:'CAMPUS',name:'The complete proposed HQ',level:'roof',purpose:'18 connected greenhouse modules, roof support rooms and the ground packing hub. Select any room or module to return to walking.',equipment:'All 41 guideline sections, 7,560 planting anchors, stairs, lift, service pads and perimeter access.',source:'Proposed 78 × 86 m roof; dimensions and placement are not surveyed or approved for construction.',photo:'./assets/photoreal/CAMPUS_CLOSER_20261006.png'};showDetail(current);$('movementStatus').textContent='Whole campus overview · choose a room to resume walking';updateHUD();});
$('cityView').addEventListener('click',()=>{if(!ready)return;mode='overview';dirty=true;keys.clear();if(document.pointerLockElement)document.exitPointerLock();camera.position.set(-225,120,190);camera.lookAt(30,-8,0);current={id:'MAG',name:'Mall Artha Gading mapped context',level:'roof',purpose:'The mall outline, adjacent streets and nearby building footprints follow OpenStreetMap. The 78 × 86 m greenhouse concept runs parallel to the mall’s long side. Its rooftop fit is unverified.',equipment:'Mapped Jalan Yos Sudarso, Jalan Artha Gading Selatan, Jalan Artha Gading Boulevard, Jalan Permata Artha Gading, nearby buildings, land cover and tree rows.',source:'OpenStreetMap way 99362081 and surrounding data retrieved 30 September 2026. Elevations, existing roof structures, facade appearance and the greenhouse location remain visualization assumptions.'};showDetail(current);$('movementStatus').textContent='Mapped mall view · choose a room or Fly to explore';updateHUD();if(innerWidth<700)$('navigator').classList.add('hidden');});
$('enterRoom').addEventListener('click',enterRoom);$('hideDetail').addEventListener('click',()=>$('detail').classList.toggle('collapsed'));
$('reference').addEventListener('click',()=>{if(!current?.photo)return;if(document.pointerLockElement)document.exitPointerLock();keys.clear();$('photo').src=current.photo;$('photoTitle').textContent=current.id+' · '+current.name;$('photoModal').hidden=false;$('closePhoto').focus();});$('presentationReference').addEventListener('click',()=>$('reference').click());$('closePhoto').addEventListener('click',()=>{$('photoModal').hidden=true;(presentationActive?$('presentationReference'):$('reference')).focus();});
$('startTour').addEventListener('click',()=>tour(tourIndex<0||tourIndex===layout.tour.length-1?0:tourIndex+1));$('nextTour').addEventListener('click',()=>tour(tourIndex+1));$('prevTour').addEventListener('click',()=>tour(tourIndex-1));
$('present').addEventListener('click',()=>{presentation(true);presentationInspect();});$('presentationExit').addEventListener('click',()=>presentation(false));$('presentationFly').addEventListener('click',toggleFly);$('presentationPrev').addEventListener('click',()=>presentationStop(-1));$('presentationNext').addEventListener('click',()=>presentationStop(1));
for(const id of ['timeOfDay','presentationTimeOfDay'])$(id).addEventListener('click',()=>setTimeOfDay(timeOfDay.mode==='day'?'sunset':'day'));
$('presentationSave').addEventListener('click',savePresentationImage);
addEventListener('keydown',e=>{if(e.key==='Escape'&&presentationActive&&$('photoModal').hidden)presentation(false);});
const startupParams=new URLSearchParams(location.search);
if(ready&&startupParams.has('city')){$('cityView').click();if(startupParams.has('fly')){toggleFly();$('navigator').classList.add('hidden');$('detail').classList.add('collapsed');}else if(startupParams.has('present'))presentation(true);}
else if(ready&&startupParams.has('campus')){$('overview').click();if(startupParams.has('present'))presentation(true);}
else if(ready&&startupParams.has('present')){presentation(true);presentationInspect();}
