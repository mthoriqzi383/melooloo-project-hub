import * as THREE from 'three';

// Two presentation lighting presets. The model's Cycles lightmaps remain a
// daytime bake; this layer changes live light, atmosphere and unbaked detail.
export function createTimeOfDay(scene, renderer, sun, hemisphere) {
  const skyMaterial = new THREE.ShaderMaterial({
    name: 'Day / sunset sky',
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
    toneMapped: false,
    uniforms: {
      sunset: {value: 0},
      sunDirection: {value: new THREE.Vector3(-.689254, .714246, .121581).normalize()}
    },
    vertexShader: `varying vec3 vDirection;
      void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `varying vec3 vDirection;
      uniform float sunset;
      uniform vec3 sunDirection;
      void main() {
        vec3 direction = normalize(vDirection);
        float height = smoothstep(-0.18, 0.42, direction.y);
        vec3 day = mix(vec3(.76,.84,.86), vec3(.35,.59,.78), height);
        vec3 dusk = mix(vec3(.91,.52,.39), vec3(.27,.35,.58), height);
        float towardSun = max(dot(direction, normalize(sunDirection)), 0.0);
        dusk += vec3(.23,.13,.06) * pow(towardSun, 12.0) * (1.0-height*.55);
        vec3 color = mix(day, dusk, sunset);
        float glow = pow(towardSun, 240.0) * sunset;
        float disc = smoothstep(.99964, .99984, towardSun) * sunset;
        color = mix(color, vec3(1.0,.87,.63), min(1.0, glow*.55+disc*.9));
        gl_FragColor = vec4(color, 1.0);
      }`
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(850, 32, 16), skyMaterial);
  sky.name = 'Illustrative day and sunset sky';
  sky.renderOrder = -1000;
  sky.frustumCulled = false;
  scene.add(sky);

  const dayDirection = new THREE.Vector3(-.689254, .714246, .121581).normalize();
  const duskDirection = new THREE.Vector3(-.91, .20, .36).normalize();
  let mode = 'day';
  function set(next) {
    mode = next === 'sunset' ? 'sunset' : 'day';
    const dusk = mode === 'sunset';
    const direction = dusk ? duskDirection : dayDirection;
    skyMaterial.uniforms.sunset.value = Number(dusk);
    skyMaterial.uniforms.sunDirection.value.copy(direction);
    sun.position.copy(sun.target.position).addScaledVector(direction, 140);
    sun.color.set(dusk ? '#ffb17b' : '#fff1d4');
    sun.intensity = dusk ? 1.45 : 1.35;
    hemisphere.color.set(dusk ? '#f0bba1' : '#d9eeff');
    hemisphere.groundColor.set(dusk ? '#596579' : '#8b9474');
    hemisphere.intensity = dusk ? .73 : 1.0;
    scene.fog.color.set(dusk ? '#c69c9a' : '#c8d7df');
    scene.background.set(dusk ? '#c69c9a' : '#c8d7df');
    scene.environmentIntensity = dusk ? .43 : .6;
    renderer.toneMappingExposure = dusk ? .82 : .95;
    sun.shadow.needsUpdate = true;
    renderer.shadowMap.needsUpdate = true;
    return mode;
  }
  return {set, get mode() {return mode;}, follow(camera) {sky.position.copy(camera.position);}};
}
