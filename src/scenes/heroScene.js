import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Builds and animates the hero headlight scene on the given canvas.
 * Returns a `dispose()` function so the scene can be torn down cleanly
 * (e.g. if you later add client-side routing between pages).
 */
export function initHeroScene(canvasId = 'heroCanvas', heroSectionId = 'home') {
  const canvas = document.getElementById(canvasId);
  const heroSection = document.getElementById(heroSectionId);
  if (!canvas || !heroSection) return { dispose() {} };

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08090b, 0.055);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // ---- Post-processing (bloom for that HID glow) ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.15, 0.75, 0.18);
  composer.addPass(bloomPass);

  // ---- Lighting ----
  scene.add(new THREE.AmbientLight(0x1a2430, 1.2));
  const keyLight = new THREE.PointLight(0x6ec8ff, 6, 20, 2);
  keyLight.position.set(2.5, 2, 4);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0xffa53e, 2.4, 20, 2);
  rimLight.position.set(-3, -1.5, -3);
  scene.add(rimLight);

  // ---- Headlight group ----
  const headlightGroup = new THREE.Group();
  headlightGroup.position.set(1.6, 0.1, 0);
  scene.add(headlightGroup);

  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x15171b, metalness: 0.85, roughness: 0.32 });
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.16, 32, 100), bezelMat);
  headlightGroup.add(bezel);

  const haloMat = new THREE.MeshStandardMaterial({
    color: 0x6ec8ff,
    emissive: 0x6ec8ff,
    emissiveIntensity: 2.6,
    metalness: 0,
    roughness: 0.4,
  });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.045, 24, 100), haloMat);
  headlightGroup.add(halo);

  const halo2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.03, 20, 100), haloMat.clone());
  halo2.material.emissiveIntensity = 1.8;
  headlightGroup.add(halo2);

  const reflectorMat = new THREE.MeshStandardMaterial({ color: 0x0d1116, metalness: 1, roughness: 0.18, side: THREE.DoubleSide });
  const reflector = new THREE.Mesh(new THREE.ConeGeometry(1.85, 1.3, 48, 1, true), reflectorMat);
  reflector.rotation.x = Math.PI / 2;
  reflector.position.z = -0.55;
  headlightGroup.add(reflector);

  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfe6ff,
    transmission: 0.92,
    thickness: 0.6,
    roughness: 0.06,
    metalness: 0,
    ior: 1.4,
    transparent: true,
    opacity: 0.55,
    clearcoat: 1,
  });
  const lens = new THREE.Mesh(
    new THREE.SphereGeometry(1.9, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2.1),
    lensMat
  );
  lens.rotation.x = -Math.PI / 2;
  lens.position.z = 0.15;
  headlightGroup.add(lens);

  const coreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xeaf7ff, emissiveIntensity: 4.2 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), coreMat);
  core.position.z = -0.2;
  headlightGroup.add(core);

  const coreLight = new THREE.PointLight(0xbfe6ff, 8, 12, 2);
  coreLight.position.copy(core.position);
  headlightGroup.add(coreLight);

  // ---- Light beam (fake volumetric cone, additive) ----
  const beamGroup = new THREE.Group();
  headlightGroup.add(beamGroup);

  function makeBeamCone(length, radius, opacity) {
    const geo = new THREE.ConeGeometry(radius, length, 40, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x9fdcff,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -length / 2 - 0.3;
    return mesh;
  }
  beamGroup.add(makeBeamCone(9, 2.4, 0.05));
  beamGroup.add(makeBeamCone(5.5, 1.3, 0.08));
  beamGroup.add(makeBeamCone(2.6, 0.55, 0.14));

  // ---- Particle field inside/around the beam ----
  const PARTICLE_COUNT = REDUCED_MOTION ? 120 : 420;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const speeds = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random();
    const spread = 0.3 + t * 2.2;
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * spread;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r;
    positions[i * 3 + 2] = -Math.random() * 9;
    speeds[i] = 0.4 + Math.random() * 1.1;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xdff2ff,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  beamGroup.add(particles);

  // ---- Ambient background sparks (depth) ----
  const bgGeo = new THREE.BufferGeometry();
  const BG_COUNT = REDUCED_MOTION ? 60 : 180;
  const bgPos = new Float32Array(BG_COUNT * 3);
  for (let i = 0; i < BG_COUNT; i++) {
    bgPos[i * 3] = (Math.random() - 0.5) * 20;
    bgPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    bgPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
  }
  bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
  const bgMat = new THREE.PointsMaterial({ color: 0x4a6a80, size: 0.02, transparent: true, opacity: 0.4 });
  const bgPoints = new THREE.Points(bgGeo, bgMat);
  scene.add(bgPoints);

  // ---- Interaction state ----
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };
  const onMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('mousemove', onMouseMove);

  let scrollProgress = 0;
  function updateScrollProgress() {
    const rect = heroSection.getBoundingClientRect();
    const total = rect.height;
    const passed = Math.min(Math.max(-rect.top, 0), total);
    scrollProgress = total > 0 ? passed / total : 0;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    bloomPass.setSize(width, height);
    layoutForViewport();
  }

  function layoutForViewport() {
    if (width < 900) {
      headlightGroup.position.set(0.4, -1.1, -1.5);
      camera.position.z = 9.5;
    } else {
      headlightGroup.position.set(1.6, 0.1, 0);
      camera.position.z = 8;
    }
  }
  layoutForViewport();
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let rafId = null;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const speed = REDUCED_MOTION ? 0.15 : 1;

    headlightGroup.rotation.y = Math.sin(t * 0.18) * 0.12 + scrollProgress * -0.5;
    headlightGroup.rotation.x = Math.cos(t * 0.15) * 0.05;

    targetRotation.x += (mouse.y * 0.15 - targetRotation.x) * 0.04;
    targetRotation.y += (mouse.x * 0.2 - targetRotation.y) * 0.04;
    headlightGroup.rotation.x += targetRotation.x * speed;
    headlightGroup.rotation.y += targetRotation.y * speed;

    camera.position.y = 0.2 - scrollProgress * 1.2;
    camera.position.x = scrollProgress * -0.6;
    camera.lookAt(headlightGroup.position.x * 0.3, 0, 0);

    const pulse = 2.2 + Math.sin(t * 2) * 0.5;
    haloMat.emissiveIntensity = pulse * speed + (1 - speed) * 2.2;
    halo.rotation.z += 0.001 * speed;
    halo2.rotation.z -= 0.0016 * speed;

    coreMat.emissiveIntensity = 4 + Math.sin(t * 9) * 0.15;
    coreLight.intensity = 8 + Math.sin(t * 9) * 0.4;

    const posAttr = particles.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let z = posAttr.array[i * 3 + 2];
      z += speeds[i] * 0.02 * speed;
      if (z > 1) z = -9;
      posAttr.array[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;

    composer.render();
  }
  animate();

  // Pause heavy rendering when hero is off-screen for performance
  const visObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        renderer.domElement.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
      });
    },
    { threshold: 0 }
  );
  visObserver.observe(heroSection);

  function dispose() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', updateScrollProgress);
    window.removeEventListener('resize', onResize);
    visObserver.disconnect();
    renderer.dispose();
    composer.dispose?.();
  }

  return { dispose };
}
