import * as THREE from 'three';

// Horizontal geometry comes from the offline OSM extract. Elevations, roof
// plant, facade finishes and the greenhouse's position are design assumptions.
export function addMappedMallContext(scene, map) {
  const root = new THREE.Group();
  root.name = 'Mall Artha Gading / OpenStreetMap aligned context';
  scene.add(root);
  const grade = -27, mallTop = -.55;
  const counts = {mallPolygon:map.mall.polygon.length,buildings:map.buildings.length,
    roads:map.roads.length,areas:map.areas.length,treeRows:map.tree_rows.length};

  function geometry() {
    const positions=[], normals=[], uvs=[];
    return {positions,normals,uvs,push(a,b,c,normal,uv) {
      for (const [p,t] of [[a,uv[0]],[b,uv[1]],[c,uv[2]]]) {
        positions.push(...p);normals.push(...normal);uvs.push(...t);
      }
    },finish() {
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
      g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
      g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
      g.computeBoundingSphere();return g;
    }};
  }
  function roof(poly,z,out) {
    if(poly.length<3)return;
    const points=poly.map(([x,y])=>new THREE.Vector2(x,y));
    for(const tri of THREE.ShapeUtils.triangulateShape(points,[])) {
      const v=tri.map(i=>poly[i]);
      out.push([v[0][0],z,-v[0][1]],[v[1][0],z,-v[1][1]],
        [v[2][0],z,-v[2][1]],[0,1,0],v.map(([x,y])=>[x/8,y/8]));
    }
  }
  function walls(poly,bottom,top,out) {
    let area=0;
    for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];area+=a[0]*b[1]-b[0]*a[1];}
    const sign=area>=0?1:-1;
    for(let i=0;i<poly.length;i++){
      const [x1,y1]=poly[i],[x2,y2]=poly[(i+1)%poly.length],dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
      if(len<.02)continue;
      const normal=[sign*dy/len,0,sign*dx/len],u=len/4.2,v=(top-bottom)/3.4;
      const a=[x1,bottom,-y1],b=[x2,bottom,-y2],c=[x2,top,-y2],d=[x1,top,-y1];
      out.push(a,b,c,normal,[[0,0],[u,0],[u,v]]);
      out.push(a,c,d,normal,[[0,0],[u,v],[0,v]]);
    }
  }
  function surface(poly,z,material,name) {
    const data=geometry();roof(poly,z,data);
    const mesh=new THREE.Mesh(data.finish(),material);mesh.name=name;mesh.receiveShadow=false;root.add(mesh);
  }
  function noiseTexture(kind) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    const c=canvas.getContext('2d');
    if(kind==='mall'){
      c.fillStyle='#b9c4c4';c.fillRect(0,0,256,256);
      c.fillStyle='#6a8999';c.fillRect(20,26,216,169);
      c.fillStyle='#d4dbd5';for(let x=0;x<=256;x+=64)c.fillRect(x,0,8,256);
      for(let y=0;y<=256;y+=64)c.fillRect(0,y,256,9);
      c.fillStyle='#94a8a8';c.fillRect(30,31,16,159);
      for(let i=0;i<4;i++){c.fillStyle=['#b7a176','#8eabb5','#95aa99','#c09274'][i];c.fillRect(i*64+47,0,10,256);}
    }else{
      const warm=kind==='neighborWarm',dark=kind==='neighborDark';
      c.fillStyle=warm?'#c4b8a5':dark?'#9faaa8':'#bbc6c4';c.fillRect(0,0,256,256);
      c.fillStyle=warm?'#625f57':dark?'#394f56':'#728b93';c.fillRect(26,28,202,171);
      c.fillStyle=warm?'#ded1b9':dark?'#b8c4bf':'#e0e4dc';c.fillRect(0,0,256,13);c.fillRect(0,208,256,19);
      c.fillStyle=warm?'#b39b7b':dark?'#6a8082':'#94aab0';c.fillRect(38,32,28,161);
      c.fillStyle=warm?'#6c695f':dark?'#45585b':'#667983';c.fillRect(124,27,8,172);
      c.fillStyle=warm?'#d7c6ae':dark?'#b2c0bd':'#d6dbd6';c.fillRect(0,228,256,28);
    }
    let seed=kind==='mall'?384912:8857;
    for(let i=0;i<4500;i++){
      seed=(1664525*seed+1013904223)>>>0;const x=seed%256;
      seed=(1664525*seed+1013904223)>>>0;const y=seed%256;
      c.fillStyle=i%2?'rgba(255,255,255,.025)':'rgba(14,26,26,.025)';c.fillRect(x,y,1,1);
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;return texture;
  }
  function surfaceTexture(kind) {
    // Repeating, deterministic material detail. These textures are a visual
    // finish, not a tracing of roof fixtures or paving visible in imagery.
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    const c=canvas.getContext('2d'),pixels=c.createImageData(256,256);
    const palette=kind==='road'?[65,70,70]:kind==='roof'?[110,120,121]:kind==='neighborRoof'?[143,148,145]:[171,170,159];
    let seed=kind==='road'?24013:kind==='roof'?92813:kind==='neighborRoof'?41723:79031;
    for(let i=0;i<pixels.data.length;i+=4){
      seed=(1664525*seed+1013904223)>>>0;
      const fine=((seed>>>24)/255-.5)*(kind==='road'?31:kind==='roof'?24:18);
      const broad=Math.sin((i/4%256)/21)*2.2+Math.sin(Math.floor(i/4/256)/29)*2.3;
      pixels.data[i]=palette[0]+fine+broad;
      pixels.data[i+1]=palette[1]+fine+broad;
      pixels.data[i+2]=palette[2]+fine+broad;
      pixels.data[i+3]=255;
    }
    c.putImageData(pixels,0,0);
    if(kind==='roof'||kind==='neighborRoof'){
      c.fillStyle='rgba(27,40,40,.16)';c.fillRect(0,0,256,3);c.fillRect(0,0,3,256);
      c.fillStyle='rgba(235,236,229,.15)';c.fillRect(4,4,1,252);c.fillRect(4,4,252,1);
      c.strokeStyle='rgba(70,81,79,.13)';c.lineWidth=2;c.beginPath();c.moveTo(0,129);c.lineTo(256,129);c.stroke();
      // A subtle repair seam prevents repeated roof tiles from reading as a grid.
      c.strokeStyle='rgba(54,65,66,.08)';c.beginPath();c.moveTo(194,29);c.lineTo(180,86);c.lineTo(210,126);c.stroke();
    }else if(kind==='ground'){
      c.strokeStyle='rgba(95,97,87,.12)';c.lineWidth=1;
      for(let x=0;x<256;x+=32){c.beginPath();c.moveTo(x,0);c.lineTo(x,256);c.stroke();}
      for(let y=0;y<256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();}
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;
    return texture;
  }
  const mallFacade=new THREE.MeshStandardMaterial({map:noiseTexture('mall'),color:0xd0dbda,roughness:.61,metalness:.09,side:THREE.DoubleSide});
  const neighborFacades=['neighbor','neighborWarm','neighborDark'].map(kind=>new THREE.MeshStandardMaterial({map:noiseTexture(kind),roughness:.77,metalness:.035,side:THREE.DoubleSide}));
  const mallRoof=new THREE.MeshStandardMaterial({map:surfaceTexture('roof'),roughness:.94,metalness:.02,side:THREE.DoubleSide});
  const neighborRoofTexture=surfaceTexture('neighborRoof');
  const neighborRoofs=[0xf0e7db,0xd4dedc,0xd1d2c7].map(color=>new THREE.MeshStandardMaterial({map:neighborRoofTexture,color,roughness:.91,side:THREE.DoubleSide}));
  const pavement=new THREE.MeshStandardMaterial({map:surfaceTexture('ground'),roughness:1});
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1450,1450),pavement);
  ground.name='Mapped district ground';ground.rotation.x=-Math.PI/2;ground.position.set(0,grade-.42,0);ground.receiveShadow=false;
  pavement.map.repeat.set(90,90);root.add(ground);

  const areaColors={water:0x71939c,grass:0x829d79,meadow:0x8b9f7c,wood:0x6e8875,scrub:0x8a9b80};
  for(const [kind,color] of Object.entries(areaColors)){
    const data=geometry();for(const item of map.areas)if(item.kind===kind)roof(item.polygon,grade-.3,data);
    if(data.positions.length){const mesh=new THREE.Mesh(data.finish(),new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide}));mesh.name='OSM '+kind+' land cover';root.add(mesh);}
  }
  const roadGroups=new Map();
  const roadMarkings=geometry();
  const roadAsphalt=surfaceTexture('road');
  const vehicles=[];
  for(const way of map.roads){
    const type=way.highway;
    const key=way.bridge?'bridge':type==='motorway'||type==='trunk'||type==='trunk_link'||type==='motorway_link'?'arterial':type==='secondary'||type==='tertiary'?'street':type==='footway'||type==='path'||type==='pedestrian'?'foot':'local';
    if(!roadGroups.has(key))roadGroups.set(key,geometry());
    const out=roadGroups.get(key),width=Math.max(1.6,Math.min(18,way.width||({motorway:10,trunk:10,secondary:7,tertiary:7,residential:6,service:4,footway:2.3,path:1.8,busway:4}[type]||5)));
    const z=way.bridge?grade+7.2:grade+.05;
    for(let i=0;i<way.points.length-1;i++){
      const [x1,y1]=way.points[i],[x2,y2]=way.points[i+1],dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
      if(len<.05)continue;
      const nx=-dy/len*width/2,ny=dx/len*width/2;
      const a=[x1+nx,z,-y1-ny],b=[x2+nx,z,-y2-ny],c=[x2-nx,z,-y2+ny],d=[x1-nx,z,-y1+ny];
      out.push(a,b,c,[0,1,0],[[0,0],[len/4,0],[len/4,width/4]]);
      out.push(a,c,d,[0,1,0],[[0,0],[len/4,width/4],[0,width/4]]);
      if(!way.bridge&&(key==='arterial'||key==='street')&&width>=5&&Math.abs((x1+x2)/2)<340&&Math.abs((y1+y2)/2)<410){
        // Painted centre dashes follow each mapped street segment. This is
        // presentational lane marking, not surveyed traffic-control data.
        const n=Math.floor(len/8),dash=3.2;
        for(let k=0;k<n;k++){
          const start=(k+.16)/n,end=Math.min(1,start+dash/len);
          if(end<=start)continue;
          const sx=x1+dx*start,sy=y1+dy*start,ex=x1+dx*end,ey=y1+dy*end;
          const mx=-dy/len*.085,my=dx/len*.085,h=z+.018;
          roadMarkings.push([sx+mx,h,-sy-my],[ex+mx,h,-ey-my],[ex-mx,h,-ey+my],[0,1,0],[[0,0],[1,0],[1,1]]);
          roadMarkings.push([sx+mx,h,-sy-my],[ex-mx,h,-ey+my],[sx-mx,h,-sy+my],[0,1,0],[[0,0],[1,1],[0,1]]);
        }
        if(way.osm_id%3===0&&vehicles.length<38){
          const count=Math.floor(len/46),side=way.osm_id%2?1:-1;
          for(let k=0;k<count&&vehicles.length<38;k++){
            const t=(k+.37)/count,offset=side*Math.min(width*.25,2.2);
            const vx=x1+dx*t-dy/len*offset,vy=y1+dy*t+dx/len*offset;
            if(Math.abs(vx)<245&&Math.abs(vy)<290)vehicles.push([vx,vy,Math.atan2(dx,-dy),vehicles.length]);
          }
        }
      }
    }
  }
  const roadColors={arterial:0xffffff,bridge:0xbac4c1,street:0xffffff,local:0xd0d5d0,foot:0xc1bfb3};
  for(const [kind,data] of roadGroups){
    const mesh=new THREE.Mesh(data.finish(),new THREE.MeshStandardMaterial({map:roadAsphalt,color:roadColors[kind],roughness:.98,side:THREE.DoubleSide}));
    mesh.name='OSM road / '+kind;root.add(mesh);
  }
  if(roadMarkings.positions.length){const mesh=new THREE.Mesh(roadMarkings.finish(),new THREE.MeshBasicMaterial({color:0xd3d0be,side:THREE.DoubleSide}));mesh.name='Visual road centre dashes / mapped alignments';root.add(mesh);}
  if(vehicles.length){
    // Parked and moving-traffic positions are visual estimates; only the road
    // alignments underneath them are mapped. Instancing keeps this to 3 draws.
    const carMaterials=[new THREE.MeshStandardMaterial({color:0xffffff,roughness:.35,metalness:.2}),new THREE.MeshStandardMaterial({color:0x34494e,roughness:.22,metalness:.15}),new THREE.MeshBasicMaterial({color:0x202628})];
    const carParts=carMaterials.map(material=>new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),material,vehicles.length));
    const carDummy=new THREE.Object3D(),colors=[0xeee9df,0x668276,0x3d5962,0x9daaa8,0x6f6a63,0xb7a379];
    for(const [x,y,yaw,i] of vehicles){
      carDummy.rotation.y=yaw;carDummy.position.set(x,grade+.55,-y);carDummy.scale.set(1.85,.72,4.2);carDummy.updateMatrix();carParts[0].setMatrixAt(i,carDummy.matrix);carParts[0].setColorAt(i,new THREE.Color(colors[i%colors.length]));
      carDummy.position.set(x,grade+1.13,-y-.12);carDummy.scale.set(1.55,.49,2.2);carDummy.updateMatrix();carParts[1].setMatrixAt(i,carDummy.matrix);
      carDummy.position.set(x,grade+.12,-y);carDummy.scale.set(1.95,.08,4.35);carDummy.updateMatrix();carParts[2].setMatrixAt(i,carDummy.matrix);
    }
    carParts.forEach((part,i)=>{part.instanceMatrix.needsUpdate=true;if(part.instanceColor)part.instanceColor.needsUpdate=true;part.computeBoundingSphere();part.name=['Illustrative street vehicles','Vehicle windscreens','Vehicle contact shadows'][i];root.add(part);});
  }

  const mainWalls=geometry(),mainCap=geometry();
  walls(map.mall.polygon,grade,mallTop,mainWalls);roof(map.mall.polygon,mallTop,mainCap);
  const mallWallMesh=new THREE.Mesh(mainWalls.finish(),mallFacade);mallWallMesh.name='Mapped Mall Artha Gading facade';root.add(mallWallMesh);
  const mallRoofMesh=new THREE.Mesh(mainCap.finish(),mallRoof);mallRoofMesh.name='Mapped Mall Artha Gading roof footprint';root.add(mallRoofMesh);
  // A restrained perimeter edge gives the roof legible depth. Its height and
  // appearance are illustrative because OSM supplies only the plan footprint.
  const parapetFaces=geometry();walls(map.mall.polygon,mallTop,mallTop+.7,parapetFaces);
  const parapet=new THREE.Mesh(parapetFaces.finish(),new THREE.MeshStandardMaterial({color:0x94a3a2,roughness:.7,metalness:.08,side:THREE.DoubleSide}));
  parapet.name='Illustrative mall roof perimeter parapet';root.add(parapet);
  function inside(poly,x,y){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;
  }return hit;}
  const neighborWalls=[geometry(),geometry(),geometry()],neighborCap=[geometry(),geometry(),geometry()],buildingPlinths=geometry();
  const rooftopUnits=[];
  for(const item of map.buildings){
    const poly=item.polygon;
    if(poly.length<3)continue;
    const area=Math.abs(poly.reduce((a,p,i)=>{const q=poly[(i+1)%poly.length];return a+p[0]*q[1]-q[0]*p[1];},0))/2;
    const levels=Number.parseFloat(item.levels);
    const height=Number.isFinite(levels)?Math.max(4,Math.min(80,levels*3.2)):(area>1400?22:area>350?13:area>90?9:7);
    const finish=item.osm_id%3;
    walls(poly,grade,grade+height,neighborWalls[finish]);roof(poly,grade+height,neighborCap[finish]);
    walls(poly,grade,grade+.32,buildingPlinths);
    if(area>115&&area<9000&&Math.abs(poly[0][0])<370&&Math.abs(poly[0][1])<390){
      const cx=poly.reduce((s,p)=>s+p[0],0)/poly.length,cy=poly.reduce((s,p)=>s+p[1],0)/poly.length;
      if(inside(poly,cx,cy))rooftopUnits.push([cx,cy,grade+height]);
    }
  }
  neighborWalls.forEach((data,i)=>{if(data.positions.length){const mesh=new THREE.Mesh(data.finish(),neighborFacades[i]);mesh.name='Mapped adjacent building facades / finish '+i;root.add(mesh);}});
  neighborCap.forEach((data,i)=>{if(data.positions.length){const mesh=new THREE.Mesh(data.finish(),neighborRoofs[i]);mesh.name='Mapped adjacent roofs '+i;root.add(mesh);}});
  const plinths=new THREE.Mesh(buildingPlinths.finish(),new THREE.MeshStandardMaterial({color:0x69736f,roughness:.94,side:THREE.DoubleSide}));plinths.name='Building ground contact band';root.add(plinths);
  // Roof equipment is an illustrative occupation cue. OSM records footprints
  // but does not locate these units, identify usable roof zones or give heights.
  const visualPlant=[];
  for(const [x,y] of [[14,-39],[60,-43],[91,-62],[21,-91],[70,-103],[43,-132],[94,-139]]){
    const halfX=2.8,halfY=1.7;
    if([[-halfX,-halfY],[halfX,-halfY],[halfX,halfY],[-halfX,halfY]].every(([dx,dy])=>inside(map.mall.polygon,x+dx,y+dy)))visualPlant.push([x,y,mallTop]);
  }
  const allUnits=[...rooftopUnits.map(([x,y,z])=>[x,y,z,.62]),...visualPlant.map(([x,y,z])=>[x,y,z,1.4])];
  if(allUnits.length){
    const unitDummy=new THREE.Object3D();
    const body=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xaab6b6,roughness:.62,metalness:.33}),allUnits.length);
    const plinth=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x7a8583,roughness:.88,metalness:.1}),allUnits.length);
    const grille=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x425659,roughness:.7,metalness:.36}),allUnits.length);
    allUnits.forEach(([x,y,z,s],i)=>{
      unitDummy.position.set(x,z+.75*s,-y);unitDummy.scale.set(4.7*s,1.15*s,2.8*s);unitDummy.updateMatrix();body.setMatrixAt(i,unitDummy.matrix);
      unitDummy.position.set(x,z+.095*s,-y);unitDummy.scale.set(5.2*s,.19*s,3.2*s);unitDummy.updateMatrix();plinth.setMatrixAt(i,unitDummy.matrix);
      unitDummy.position.set(x,z+.78*s,-y+1.42*s);unitDummy.scale.set(3.75*s,.64*s,.055*s);unitDummy.updateMatrix();grille.setMatrixAt(i,unitDummy.matrix);
    });
    for(const mesh of [body,plinth,grille]){mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();root.add(mesh);}
    body.name='Illustrative rooftop mechanical enclosure bodies';plinth.name='Illustrative rooftop mechanical plinths';grille.name='Illustrative rooftop ventilation grilles';
  }

  // The mall outline is mapped; its service paths, drains and access hatches
  // are a visual proposal. Keep each piece inside that outline and clear of
  // the 78 x 86 m greenhouse concept (model x 0..78, y 0..86).
  const roofDetails={walkwayMeters:0,drains:0,accessHatches:0,plantPads:0,draws:0,triangles:0};
  const roofClear=(x,y)=>inside(map.mall.polygon,x,y)&&
    !(x>=-2&&x<=80&&y>=-2&&y<=88);
  const safeFootprint=(x,y,halfX,halfY)=>
    [[-halfX,-halfY],[halfX,-halfY],[halfX,halfY],[-halfX,halfY],[0,0]]
      .every(([dx,dy])=>roofClear(x+dx,y+dy));
  function roofQuad(out,corners,height){
    if(!corners.every(([x,y])=>roofClear(x,y)))return false;
    const v=corners.map(([x,y])=>[x,height,-y]);
    out.push(v[0],v[1],v[2],[0,1,0],[[0,0],[1,0],[1,1]]);
    out.push(v[0],v[2],v[3],[0,1,0],[[0,0],[1,1],[0,1]]);
    return true;
  }
  function roofStrip(out,x1,y1,x2,y2,width,height){
    const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),nx=-dy/len*width/2,ny=dx/len*width/2;
    if(len<.01)return false;
    return roofQuad(out,[[x1+nx,y1+ny],[x2+nx,y2+ny],[x2-nx,y2-ny],[x1-nx,y1-ny]],height);
  }
  function addRoofMesh(data,color,name,roughness=1){
    if(!data.positions.length)return;
    const mesh=new THREE.Mesh(data.finish(),new THREE.MeshStandardMaterial({color,roughness,metalness:.02,side:THREE.DoubleSide}));
    mesh.name=name;mesh.receiveShadow=false;root.add(mesh);
    roofDetails.draws++;roofDetails.triangles+=data.positions.length/9;
  }
  const membraneSeams=geometry(),walkBorder=geometry(),walkTread=geometry(),plantPads=geometry();
  for(const y of [-9,-25,-42,-59,-76,-93,-110,-127,-144]){
    for(let x=-12;x<112;x+=4)roofStrip(membraneSeams,x,y,x+3.72,y,.075,mallTop+.033);
  }
  for(const x of [-7,8,23,38,53,68,83,98,113]){
    for(let y=-148;y<-4;y+=4)roofStrip(membraneSeams,x,y,x,y+3.72,.075,mallTop+.033);
  }
  // Narrow non-slip tread connects roof plant zones; the darker edge reads as
  // a recessed membrane border from the aerial camera, without raised curbs.
  for(const [x1,y1,x2,y2] of [[38,-5,38,-137],[5,-26,91,-26],[5,-101,92,-101]]){
    const len=Math.hypot(x2-x1,y2-y1),steps=Math.ceil(len/3);
    for(let i=0;i<steps;i++){
      const a=i/steps,b=(i+1)/steps,
        ax=x1+(x2-x1)*a,ay=y1+(y2-y1)*a,bx=x1+(x2-x1)*b,by=y1+(y2-y1)*b;
      if(roofStrip(walkBorder,ax,ay,bx,by,1.55,mallTop+.052)){
        roofStrip(walkTread,ax,ay,bx,by,1.24,mallTop+.064);
        roofDetails.walkwayMeters+=len/steps;
      }
    }
  }
  for(const [x,y] of visualPlant){
    if(roofQuad(plantPads,[[x-4.4,y-3],[x+4.4,y-3],[x+4.4,y+3],[x-4.4,y+3]],mallTop+.044))roofDetails.plantPads++;
  }
  addRoofMesh(membraneSeams,0x687775,'Illustrative roof membrane seam strips');
  addRoofMesh(plantPads,0x687b79,'Illustrative roof plant protection pads');
  addRoofMesh(walkBorder,0x657471,'Illustrative roof maintenance tread borders');
  addRoofMesh(walkTread,0xb5bdaf,'Illustrative non-slip maintenance treads',.96);

  const drainSites=[[-5,-18],[84,-18],[-5,-63],[85,-63],[-5,-108],[86,-108],[16,-145],[83,-146]]
    .filter(([x,y])=>safeFootprint(x,y,.65,.65));
  if(drainSites.length){
    const rim=new THREE.InstancedMesh(new THREE.CylinderGeometry(.55,.55,.035,12),new THREE.MeshStandardMaterial({color:0x98a49f,roughness:.83}),drainSites.length);
    const grate=new THREE.InstancedMesh(new THREE.CylinderGeometry(.36,.36,.04,12),new THREE.MeshStandardMaterial({color:0x34494b,metalness:.44,roughness:.68}),drainSites.length);
    const dummy=new THREE.Object3D();
    drainSites.forEach(([x,y],i)=>{
      dummy.position.set(x,mallTop+.065,-y);dummy.scale.set(1,1,1);dummy.updateMatrix();rim.setMatrixAt(i,dummy.matrix);
      dummy.position.y=mallTop+.09;dummy.updateMatrix();grate.setMatrixAt(i,dummy.matrix);
    });
    for(const [mesh,name] of [[rim,'Illustrative roof drain collars'],[grate,'Illustrative roof drain grates']]){
      mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.name=name;root.add(mesh);
      roofDetails.draws++;roofDetails.triangles+=mesh.geometry.index.count/3*drainSites.length;
    }
    roofDetails.drains=drainSites.length;
  }
  const hatchSites=[[9,-70],[84,-126]].filter(([x,y])=>safeFootprint(x,y,1.5,1.8));
  if(hatchSites.length){
    const hatchMaterials=[new THREE.MeshStandardMaterial({color:0x879b99,metalness:.21,roughness:.63}),new THREE.MeshStandardMaterial({color:0x4e6669,metalness:.3,roughness:.49})];
    const parts=hatchMaterials.map(m=>new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),m,hatchSites.length));
    const dummy=new THREE.Object3D();
    hatchSites.forEach(([x,y],i)=>{
      dummy.position.set(x,mallTop+.31,-y);dummy.scale.set(2.8,.52,3.3);dummy.updateMatrix();parts[0].setMatrixAt(i,dummy.matrix);
      dummy.position.set(x,mallTop+.585,-y);dummy.scale.set(2.38,.045,2.85);dummy.updateMatrix();parts[1].setMatrixAt(i,dummy.matrix);
    });
    parts.forEach((mesh,i)=>{mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.name=['Illustrative roof access hatch housings','Illustrative weathered hatch lids'][i];root.add(mesh);roofDetails.draws++;roofDetails.triangles+=12*hatchSites.length;});
    roofDetails.accessHatches=hatchSites.length;
  }

  // Measured horizontal tree row alignments are retained; individual heights
  // and canopy shapes are presentation approximations.
  const treePoints=map.trees.map(v=>v.slice());
  for(const row of map.tree_rows)for(let i=0;i<row.points.length-1;i++){
    const [x1,y1]=row.points[i],[x2,y2]=row.points[i+1],len=Math.hypot(x2-x1,y2-y1),count=Math.floor(len/9);
    for(let k=0;k<count;k++){const t=(k+.5)/count;treePoints.push([x1+(x2-x1)*t,y1+(y2-y1)*t]);}
  }
  const dummy=new THREE.Object3D();
  const foliage=new THREE.InstancedMesh(new THREE.SphereGeometry(.5,8,6),new THREE.MeshStandardMaterial({color:0x64846c,roughness:1}),treePoints.length);
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.5,.6,1,5),new THREE.MeshStandardMaterial({color:0x6d6655,roughness:1}),treePoints.length);
  treePoints.forEach(([x,y],i)=>{const h=3.6+(i%5)*.35;dummy.position.set(x,grade+h+1.5,-y);dummy.scale.set(3.4+(i%3)*.35,3.2,3.4+(i%3)*.35);dummy.updateMatrix();foliage.setMatrixAt(i,dummy.matrix);dummy.position.set(x,grade+h/2,-y);dummy.scale.set(.3,h,.3);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);});
  foliage.instanceMatrix.needsUpdate=trunks.instanceMatrix.needsUpdate=true;
  foliage.computeBoundingSphere();trunks.computeBoundingSphere();foliage.name='OSM tree rows / canopy';trunks.name='OSM tree rows / trunks';root.add(foliage,trunks);

  return {...counts,trees:treePoints.length,source:map.source.mall_way,
    illustrativeDetails:{mallRooftopUnits:visualPlant.length,nearbyRooftopUnits:rooftopUnits.length,vehicles:vehicles.length,roofService:roofDetails},
    roofPlacement:'proposed',roofFitVerified:false,
    greenhouseHeadingDegreesEastOfNorth:map.coordinates.proposed_greenhouse_heading_degrees_east_of_north,
    mallFootprintAreaM2:map.mall_footprint_area_m2};
}
