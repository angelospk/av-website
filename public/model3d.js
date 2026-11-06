// Shared 3D viewer: loads a glTF/GLB model (Draco ok), shows it with its own materials,
// "builds" it from the ground up while the camera moves in, then turns slowly.
// Used by the home hero (hero3d.js) and by project photos (carousel.js).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export const DRACO_PATH = "https://unpkg.com/three@0.170.0/examples/jsm/libs/draco/gltf/";
const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
draco.preload(); // start fetching the decoder while the model downloads
const loader = new GLTFLoader().setDRACOLoader(draco);

const SIZE = 13; // model fitted to ~13 units wide
const ease = (k) => 1 - Math.pow(1 - k, 3);

// hero: true = home page (fog, grid, offset framing, no zoom). Otherwise a viewer with zoom.
export function mountModel(canvas, url, { hero = false } = {}) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    canvas.remove(); // no WebGL: the CSS background stays
    return () => {};
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  if (hero) scene.fog = new THREE.Fog(0x0d0f11, 45, 90);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // Low sun with soft shadows on an invisible ground.
  const sun = new THREE.DirectionalLight(0xfff2e0, 1.8);
  sun.position.set(-12, 20, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.35 }));
  ground.receiveShadow = true;
  scene.add(ground);
  if (hero) scene.add(new THREE.GridHelper(40, 40, 0x2a2e33, 0x1a1d21));

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const near = hero ? 1 : 0.62; // project viewer: closer, the model fills the photo frame
  const end = new THREE.Vector3(26, 8.5, 26).multiplyScalar(near); // final camera position
  const from = new THREE.Vector3(34, 22, 12).multiplyScalar(near); // intro: higher and further round
  camera.position.copy(reduce ? end : from);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 2.5, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = !hero;
  controls.minDistance = 12;
  controls.maxDistance = 55;
  controls.minPolarAngle = 0.6;
  controls.maxPolarAngle = 1.3; // camera stays above the ground: no view from below
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.6;
  // OrbitControls sets touch-action:none inline; the project viewer keeps vertical page scroll.
  if (!hero) canvas.style.touchAction = "pan-y";
  // Hero on any touch device: it fills the screen, so keep vertical scroll and drop drag-to-orbit.
  if (hero && matchMedia("(any-pointer: coarse)").matches) {
    controls.enabled = false;
    canvas.style.touchAction = "pan-y";
    canvas.style.cursor = "default";
  }
  let intro = !reduce;
  controls.addEventListener("start", () => { intro = false; });

  // Build animation: a plane rises from the ground and reveals the model below it.
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), reduce ? 1e3 : 0);
  let height = 0, start = Infinity;
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = o.receiveShadow = true;
      for (const m of [o.material].flat()) { m.clippingPlanes = [clip]; m.clipShadows = true; }
    });
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const k = SIZE / Math.max(size.x, size.z);
    model.scale.multiplyScalar(k);
    const c = box.getCenter(new THREE.Vector3());
    model.position.set(-c.x * k, -box.min.y * k, -c.z * k);
    scene.add(model);
    height = size.y * k;
    start = performance.now();
  });
  const DUR = 1800;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.clearViewOffset();
    if (hero) {
      // Wide screens: model to the right, so the headline has room. Mobile: model above the headline.
      if (w > 960) camera.setViewOffset(w, h, -w * 0.2, h * 0.06, w, h);
      else camera.setViewOffset(w, h, 0, h * 0.2, w, h);
      camera.fov = w > 960 ? 32 : 44;
    } else {
      camera.fov = w / h < 1.2 ? 44 : 30;
    }
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Pause rendering when the canvas is off-screen (or on a hidden carousel slide).
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const k = reduce ? 1 : Math.min(1, Math.max(0, (performance.now() - start) / DUR));
    if (!reduce) clip.constant = ease(k) * (height + 0.5);
    if (intro && start !== Infinity) {
      camera.position.lerpVectors(from, end, ease(k));
      if (k === 1) intro = false;
    }
    controls.update();
    renderer.render(scene, camera);
  });

  return function dispose() {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    io.disconnect();
    controls.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
