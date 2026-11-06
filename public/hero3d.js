// Hero: a real project model that builds itself, then turns slowly. Drag to orbit.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.getElementById("hero3d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch {
  canvas.remove(); // no WebGL: the CSS gradient stays
  throw new Error("WebGL unavailable");
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0d0f11, 45, 90); // far enough to keep the model colours
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
camera.position.set(26, 8.5, 26);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = 0.6;
controls.maxPolarAngle = 1.3; // camera stays above the ground: no view from below
controls.autoRotate = !reduce;
controls.autoRotateSpeed = 0.6;
// Any touch input (incl. hybrid laptops): the hero fills the screen, so keep vertical scroll and drop drag-to-orbit.
const coarse = matchMedia("(any-pointer: coarse)").matches;
if (coarse) {
  controls.enabled = false;
  canvas.style.touchAction = "pan-y";
  canvas.style.cursor = "default";
  const tag = document.getElementById("modelTag");
  if (tag) tag.textContent = "3D · Κατοικία στους Τσουκαλάδες";
}

// Light: soft studio environment + a low sun, so the model shows its own materials.
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();
const sun = new THREE.DirectionalLight(0xfff2e0, 1.6);
sun.position.set(-12, 20, 10);
scene.add(sun);

// Site grid
scene.add(new THREE.GridHelper(40, 40, 0x2a2e33, 0x1a1d21));

// Build animation: a plane rises from the ground and reveals the model below it.
const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
renderer.localClippingEnabled = true;

// Real project model (Τσουκαλάδες), glTF + Draco, metres, with its own materials.
const house = new THREE.Group();
scene.add(house);
let height = 0, start = Infinity;
const draco = new DRACOLoader().setDecoderPath("https://unpkg.com/three@0.170.0/examples/jsm/libs/draco/gltf/");
new GLTFLoader().setDRACOLoader(draco).load(new URL("models/tsoukalades-villa.glb", import.meta.url).href, (gltf) => {
  const model = gltf.scene;
  model.updateMatrixWorld(true);
  model.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [o.material].flat()) m.clippingPlanes = [clip];
  });
  // Fit: ~13 units wide (mobile shows it whole), centred, base on the ground.
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const k = 13 / Math.max(size.x, size.z);
  model.scale.multiplyScalar(k);
  const c = box.getCenter(new THREE.Vector3());
  model.position.set(-c.x * k, -box.min.y * k, -c.z * k);
  house.add(model);
  height = size.y * k;
  start = performance.now();
  draco.dispose();
});
const DUR = 2600;
const ease = (k) => 1 - Math.pow(1 - k, 3);

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // Push the model to the right on wide screens so the headline has room.
  if (w > 960) camera.setViewOffset(w, h, -w * 0.2, h * 0.06, w, h);
  else camera.setViewOffset(w, h, 0, h * 0.2, w, h); // mobile: model above the headline
  camera.fov = w > 960 ? 32 : 44;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

// Pause rendering when the hero is off-screen.
let visible = true;
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

renderer.setAnimationLoop((t) => {
  if (!visible) return;
  const k = reduce ? 1 : Math.min(1, Math.max(0, (performance.now() - start) / DUR));
  clip.constant = ease(k) * (height + 0.5);
  controls.update();
  renderer.render(scene, camera);
});
