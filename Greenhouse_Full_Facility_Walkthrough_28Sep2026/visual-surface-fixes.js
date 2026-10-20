import * as THREE from 'three';

// A physical 40-mesh screen has subpixel openings at normal walkthrough
// distances. Sampling the 512px alpha tile 24.6 times across the panel makes
// those openings alias into broad moving bands. Use its area-average opacity
// for the interactive view; structural framing remains in the source model.
export function stabilizeGreenhouseNet(root){
 const seen=new Set();let materialCount=0,panelCount=0;
 root.traverse(o=>{
  if(!o.isMesh)return;
  for(const mat of Array.isArray(o.material)?o.material:[o.material]){
   if(!mat?.name?.includes('InsectNet40Mesh'))continue;
   panelCount++;
   if(seen.has(mat))continue;
   seen.add(mat);materialCount++;
   mat.map=null;mat.alphaMap=null;mat.alphaTest=0;
   mat.color.set('#bcc8c4');mat.opacity=.15;mat.transparent=true;
   mat.depthWrite=false;mat.side=THREE.DoubleSide;mat.roughness=.88;
   mat.needsUpdate=true;
  }
 });
 return {netMaterials:materialCount,netPanels:panelCount,method:'subpixel 40-mesh coverage'};
}
