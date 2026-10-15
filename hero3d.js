// Hero: wireframe house that builds itself, then turns slowly. Drag to orbit.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
scene.fog = new THREE.Fog(0x0d0f11, 30, 60);
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
camera.position.set(26, 8.5, 26);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = 0.6;
controls.maxPolarAngle = 1.35;
controls.autoRotate = !reduce;
controls.autoRotateSpeed = 0.6;
// Any touch input (incl. hybrid laptops): the hero fills the screen, so keep vertical scroll and drop drag-to-orbit.
const coarse = matchMedia("(any-pointer: coarse)").matches;
if (coarse) {
  controls.enabled = false;
  canvas.style.touchAction = "pan-y";
  canvas.style.cursor = "default";
  const tag = document.getElementById("modelTag");
  if (tag) tag.textContent = "3D · Κατοικία στη Βάρη";
}

const CYAN = 0x7fd1ff;
const lineMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9 });
const faintLine = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.35 });
const faceMat = new THREE.MeshBasicMaterial({ color: 0x0d0f11, transparent: true, opacity: 0.55, depthWrite: false });
const glassMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.06, depthWrite: false, side: THREE.DoubleSide });
const poolMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.22, depthWrite: false });

const house = new THREE.Group();
scene.add(house);
const parts = []; // build order

// A box whose origin sits at its base, so scaling Y "grows" it upwards.
function block(w, h, d, x, y, z, { mat = faceMat, line = lineMat } = {}) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  const obj = new THREE.Group();
  obj.add(new THREE.Mesh(g, mat));
  obj.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), line));
  obj.position.set(x, y, z);
  house.add(obj);
  parts.push(obj);
  return obj;
}

// Site plot outline + grid
const grid = new THREE.GridHelper(40, 40, 0x2a2e33, 0x1a1d21);
scene.add(grid);
const plot = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(22, 16).rotateX(-Math.PI / 2)), faintLine);
plot.position.y = 0.01;
scene.add(plot);

// Foundation and ground floor (glazed)
block(12, 0.35, 8, 0, 0, 0);
block(8, 3, 6, -1.5, 0.35, 0, { mat: glassMat });
// mullions on the front glass
for (let i = 0; i <= 4; i++) block(0.08, 3, 0.08, -5.5 + i * 2, 0.35, 3, { line: faintLine });
// columns under the cantilever
block(0.3, 3, 0.3, 4.6, 0.35, 2.2);
block(0.3, 3, 0.3, 4.6, 0.35, -2.2);
// first-floor slab, cantilevered upper volume, roof
block(12.6, 0.3, 6.4, 1, 3.35, 0);
block(11.6, 2.9, 5.6, 1, 3.65, 0);
block(12.2, 0.25, 6.2, 1, 6.55, 0);
// upper ribbon window
block(7, 1.1, 0.06, 2, 4.6, 2.84, { mat: glassMat });
// stair core on the roof
block(2.4, 1.2, 2.4, -3, 6.8, -1);
// pool and deck
block(7, 0.12, 3, -1, 0.02, 6.2, { mat: poolMat });
block(9, 0.06, 4.4, -1, 0, 6.2, { line: faintLine });

// Build animation: every part grows from scale 0, staggered.
const start = performance.now() + 300;
const DUR = 650, GAP = 140;
parts.forEach((p) => p.scale.set(1, reduce ? 1 : 0.0001, 1));
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
  if (!reduce) {
    parts.forEach((p, i) => {
      const k = Math.min(1, Math.max(0, (t - start - i * GAP) / DUR));
      p.scale.y = Math.max(0.0001, ease(k));
    });
  }
  controls.update();
  renderer.render(scene, camera);
});
