const data=await fetch('./data/mall_artha_gading_map_context.json').then(r=>{if(!r.ok)throw Error('Map source missing');return r.json()});
const svg=document.getElementById('plan'),ns='http://www.w3.org/2000/svg';
svg.setAttribute('viewBox','-420 -380 850 730');
svg.setAttribute('preserveAspectRatio','xMidYMid meet');
const heading=data.coordinates.proposed_greenhouse_heading_degrees_east_of_north*Math.PI/180;
const east0=data.coordinates.proposed_greenhouse_origin_east_north_m[0],north0=data.coordinates.proposed_greenhouse_origin_east_north_m[1];
function toGeo([x,y]){return [east0+x*Math.cos(heading)+y*Math.sin(heading),north0-x*Math.sin(heading)+y*Math.cos(heading)];}
function toScreen(point){const [east,north]=toGeo(point);return `${east},${-north}`;}
function node(tag,attrs={},parent=svg){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);parent.append(n);return n;}
function polygon(points,attrs,parent){return node('polygon',{points:points.map(toScreen).join(' '),...attrs},parent);}
function polyline(points,attrs,parent){return node('polyline',{points:points.map(toScreen).join(' '),fill:'none',...attrs},parent);}
function label(value,x,y,attrs={},parent=svg){const n=node('text',{x,y,...attrs},parent);n.textContent=value;return n;}
const areas=node('g',{id:'areas'});
for(const a of data.areas)polygon(a.polygon,{fill:a.kind==='water'?'#afcbd1':'#bfd2b5',stroke:'none'},areas);
const roads=node('g',{id:'roads','stroke-linecap':'round','stroke-linejoin':'round'});
for(const r of data.roads){const h=r.highway,w=r.width??({trunk:10,motorway:10,primary:9,secondary:7,tertiary:7,residential:6,service:4,footway:2.2,path:1.8}[h]||4.5);polyline(r.points,{stroke:r.bridge?'#777a71':h==='trunk'||h==='motorway'?'#777a71':h==='footway'||h==='path'?'#d0cabb':'#bbbbae','stroke-width':Math.max(1.4,Math.min(15,w))},roads);}
const buildings=node('g',{id:'buildings'});
for(const b of data.buildings)polygon(b.polygon,{fill:'#b2c7b6',stroke:'#718d7a','stroke-width':'.8'},buildings);
const mall=node('g',{id:'mall'});
polygon(data.mall.polygon,{fill:'#b7c0ba',stroke:'#244f3e','stroke-width':'2.7'},mall);
const trees=node('g',{id:'trees',fill:'#719c71',opacity:'.88'});
for(const row of data.tree_rows){let last=null;for(const p of row.points){if(last){const d=Math.hypot(p[0]-last[0],p[1]-last[1]),steps=Math.floor(d/10);for(let k=0;k<steps;k++){const t=(k+.5)/steps,[east,north]=toGeo([last[0]+(p[0]-last[0])*t,last[1]+(p[1]-last[1])*t]);node('circle',{cx:east,cy:-north,r:2.2},trees);}}last=p;}}
for(const p of data.trees){const [east,north]=toGeo(p);node('circle',{cx:east,cy:-north,r:2.7},trees);}
const proposal=node('g',{id:'proposal'});
polygon([[0,0],[78,0],[78,86],[0,86]],{fill:'#e9a95c',opacity:'.66',stroke:'#9b4a1e','stroke-width':3,'stroke-dasharray':'7 5'},proposal);
const [ghEast,ghNorth]=toGeo([39,43]);
label('CONCEPT',ghEast,-ghNorth-11,{'text-anchor':'middle','font-size':10,'font-weight':800,fill:'#452717'},proposal);
label('GREENHOUSE',ghEast,-ghNorth+2,{'text-anchor':'middle','font-size':10,'font-weight':800,fill:'#452717'},proposal);
label('ROOF FIT UNVERIFIED',ghEast,-ghNorth+14,{'text-anchor':'middle','font-size':7,'font-weight':800,fill:'#452717'},proposal);
const labels=node('g',{id:'mapLabels'});
label('MALL ARTHA GADING',-6,98,{'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#183f32',stroke:'#e7e7df','stroke-width':3,'paint-order':'stroke'},labels);
for(const [name,target] of [
  ['Jalan Yos Sudarso',[-220,20]],
  ['Jalan Artha Gading Selatan',[-150,-45]],
  ['Jalan Artha Gading Boulevard',[-130,240]],
  ['Jalan Permata Artha Gading',[153,83]]
]){
  let best=null;
  for(const r of data.roads)if(r.name===name)for(let i=0;i<r.points.length-1;i++){
    const a=toGeo(r.points[i]),b=toGeo(r.points[i+1]),len=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if(len<7)continue;
    const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2,score=Math.hypot(x-target[0],y-target[1]);
    if(!best||score<best.score)best={a,b,x,y,score};
  }
  if(best){
    let angle=Math.atan2(-(best.b[1]-best.a[1]),best.b[0]-best.a[0])*180/Math.PI;
    if(angle>90)angle-=180;if(angle< -90)angle+=180;
    label(name,best.x,-best.y-6,{'text-anchor':'middle','font-size':9,'font-weight':700,fill:'#3b5147',stroke:'#e5e5d9','stroke-width':3,'paint-order':'stroke',transform:`rotate(${angle} ${best.x} ${-best.y-6})`},labels);
  }
}
const compass=node('g',{transform:'translate(-380 -326)'});
node('path',{d:'M0 15 L0 -20 M0 -20 L-7 -6 M0 -20 L7 -6',stroke:'#1d503a','stroke-width':3,fill:'none','stroke-linecap':'round'},compass);
label('N',0,-27,{'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#1d503a'},compass);
const scale=node('g',{transform:'translate(-365 295)'});
node('path',{d:'M0 0 H100 M0 -5 V5 M50 -5 V5 M100 -5 V5',stroke:'#214c39','stroke-width':2,fill:'none'},scale);
label('0',0,20,{'text-anchor':'middle','font-size':10,fill:'#214c39'},scale);label('100 m',100,20,{'text-anchor':'middle','font-size':10,fill:'#214c39'},scale);
document.getElementById('mallCount').textContent=`${data.mall.polygon.length} mall outline points`;
document.getElementById('buildingCount').textContent=`${data.buildings.length} nearby buildings`;
document.getElementById('roadCount').textContent=`${data.roads.length} road ways`;
document.getElementById('mallArea').textContent=`${Math.round(data.mall_footprint_area_m2).toLocaleString()} m²`;
for(const input of document.querySelectorAll('[data-layer]'))input.addEventListener('change',()=>{document.getElementById(input.dataset.layer).style.display=input.checked?'':'none';});
