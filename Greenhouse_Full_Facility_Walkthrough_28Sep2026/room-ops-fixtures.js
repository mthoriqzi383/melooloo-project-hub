import * as THREE from 'three';

// Reusable room signage makes the proposed process areas legible at walking
// distance. Wording and placements are visual concepts, not operating SOPs.
const specs={
 S04:{title:'TRANSPLANT',sub:'NURSERY / READY TRAYS',rows:['Inspect roots and leaves','Record batch and variety','Move clean trays to GH'],accent:'#588b58'},
 S07:{title:'NUTRIENT PREP',sub:'WATER / STOCK SOLUTION',rows:['Check water source','Log EC and pH','Confirm dosing line'],accent:'#4b8990'},
 S09:{title:'MAINTENANCE',sub:'TOOLS / SPARES / SERVICE',rows:['Tag equipment before work','Return cleaned tools','Record service action'],accent:'#b78345'},
 S17:{title:'QUALITY CONTROL',sub:'SORT / WEIGH / GRADE',rows:['Record lot and harvest','Inspect fruit surface','Separate grading lanes'],accent:'#718f65'}
};
const boardX={S04:.48,S07:.48,S09:.88,S17:.48};

function boardTexture(id,spec){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=704;
 const g=canvas.getContext('2d');
 g.fillStyle='#ecebe2';g.fillRect(0,0,512,704);
 let seed=id.charCodeAt(2)*271+93;
 for(let i=0;i<2400;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%512;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%704;
  g.fillStyle=i%3?'rgba(74,83,69,.025)':'rgba(255,255,255,.04)';g.fillRect(x,y,2,2);
 }
 g.fillStyle='#254838';g.fillRect(0,0,512,114);
 g.fillStyle='#dce8da';g.font='700 21px Arial';g.fillText('MELOOLOO  /  OPERATIONS',34,42);
 g.fillStyle='#f6f2e8';g.font='700 36px Arial';g.fillText(id+'  '+spec.title,34,88);
 g.fillStyle=spec.accent;g.fillRect(34,148,444,8);
 g.fillStyle='#2f5142';g.font='700 24px Arial';g.fillText(spec.sub,34,200);
 g.fillStyle='#657766';g.font='17px Arial';g.fillText('PROPOSED ROOM WORKFLOW',34,238);
 spec.rows.forEach((row,i)=>{
  const y=298+i*99;
  g.fillStyle=i%2?'#e2e7db':'#dce3d7';g.fillRect(30,y-34,452,77);
  g.fillStyle=spec.accent;g.beginPath();g.arc(67,y+3,18,0,Math.PI*2);g.fill();
  g.fillStyle='#ffffff';g.font='700 19px Arial';g.textAlign='center';g.fillText(String(i+1),67,y+10);g.textAlign='left';
  g.fillStyle='#2d4539';g.font='22px Arial';g.fillText(row,105,y+10);
 });
 g.strokeStyle='#b5beb0';g.lineWidth=2;g.strokeRect(29,615,454,55);
 g.fillStyle='#5b705e';g.font='18px Arial';g.fillText('BATCH  __________    DATE  __________',44,650);
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}

export function addRoomOpsFixtures(scene,layout){
 const frameMaterial=new THREE.MeshStandardMaterial({name:'Room board powder coated frame',color:'#334c3d',metalness:.48,roughness:.52});
 const frames=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),frameMaterial,4);
 frames.name='Room-specific operations boards / frames';
 const dummy=new THREE.Object3D();let count=0;
 for(const room of layout.rooms){
  const spec=specs[room.id];if(!spec)continue;
  const sideWall=room.id==='S09'?'right':room.id==='S17'?'left':null;
  const x=sideWall==='right'?room.x+room.width-.073:sideWall==='left'?room.x+.073:room.x+boardX[room.id];
  const y=room.z+1.68,z=sideWall?-(room.y+room.depth*.64):-(room.y+room.depth)+.06;
  dummy.position.set(sideWall==='right'?x+.018:sideWall==='left'?x-.018:x,y,sideWall?z:z-.018);dummy.rotation.set(0,sideWall==='right'?-Math.PI/2:sideWall==='left'?Math.PI/2:0,0);dummy.scale.set(.78,1.07,.035);dummy.updateMatrix();frames.setMatrixAt(count++,dummy.matrix);
  const material=new THREE.MeshStandardMaterial({name:room.id+' proposed operations board',map:boardTexture(room.id,spec),roughness:.84,metalness:0,emissive:'#ffffff',emissiveIntensity:.035,side:THREE.DoubleSide});
  const face=new THREE.Mesh(new THREE.PlaneGeometry(.70,.97),material);
  face.name=room.id+' proposed room operations board';face.userData={section_id:room.id,design_status:'presentation concept, not an operating instruction'};
  face.position.set(sideWall==='right'?x-.005:sideWall==='left'?x+.005:x,y,sideWall?z:z+.005);face.rotation.y=sideWall==='right'?-Math.PI/2:sideWall==='left'?Math.PI/2:0;face.castShadow=false;face.receiveShadow=false;scene.add(face);
 }
 frames.count=count;frames.instanceMatrix.needsUpdate=true;frames.computeBoundingSphere();frames.castShadow=false;scene.add(frames);
 return {boards:count,additionalDrawCalls:count+1,sections:Object.keys(specs)};
}
