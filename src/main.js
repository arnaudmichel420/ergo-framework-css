import "@fortawesome/fontawesome-free/css/all.min.css";
import GUI from "lil-gui";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
const parameters = {};
parameters.directionalLight = {};
parameters.ambientLight = {};
parameters.ambientLight.intensity = 0.13;
parameters.ambientLight.color = "#ffe5e5";
parameters.directionalLight.position = { x: 4.8, y: 2.9, z: 0.6 };
parameters.directionalLight.color = "#fffc90";
parameters.directionalLight.target = { x: 1.9, y: 0, z: 0 };
parameters.directionalLight.intensity = 3.02;
const gui = new GUI({
  width: 400,
});
gui.hide();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: getCanvasHeight(window.innerWidth),
};

function getCanvasHeight(width) {
  if (width > 1280) return window.innerHeight * 0.9;
  else if (width >= 1024) return window.innerHeight * 0.75;
  else if (width >= 768) return window.innerHeight * 0.7;
  else return window.innerHeight * 0.65;
}

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// GLTF loader
const gltfLoader = new GLTFLoader();

/**
 * Model
 */
let planet = null;
gltfLoader.load("model/24881_Mars_1_6792.glb", (gltf) => {
  planet = gltf.scene;
  planet.rotation.z = THREE.MathUtils.degToRad(25.19);
  adaptePlanet(planet, sizes.width);
  scene.add(planet);
});

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(
  parameters.ambientLight.color,
  parameters.ambientLight.intensity,
);
const directionalLight = new THREE.DirectionalLight(
  parameters.directionalLight.color,
  parameters.directionalLight.intensity,
);
directionalLight.position.set(
  parameters.directionalLight.position.x,
  parameters.directionalLight.position.y,
  parameters.directionalLight.position.z,
);
directionalLight.target.position.set(
  parameters.directionalLight.target.x,
  parameters.directionalLight.target.y,
  parameters.directionalLight.target.z,
);
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLight.target);

const ambientFolder = gui.addFolder("Ambient Light");
ambientFolder.add(ambientLight, "intensity", 0, 1, 0.01).name("Intensity");
ambientFolder
  .addColor(parameters.ambientLight, "color")
  .name("color")
  .onChange((value) => {
    ambientLight.color.set(value);
  });

const dirFolder = gui.addFolder("Directional Light");
dirFolder.add(directionalLight, "intensity", 0, 5, 0.01).name("Intensity");
dirFolder
  .addColor(parameters.directionalLight, "color")
  .name("color")
  .onChange((value) => {
    directionalLight.color.set(value);
  });
dirFolder
  .add(directionalLight.target.position, "x", -10, 10, 0.1)
  .name("target X");
dirFolder
  .add(directionalLight.target.position, "y", -10, 10, 0.1)
  .name("target Y");
dirFolder
  .add(directionalLight.target.position, "z", -10, 10, 0.1)
  .name("target Z");

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = getCanvasHeight(window.innerWidth);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  adaptePlanet(planet, sizes.width);
});

function adaptePlanet(planet, width) {
  if (!planet) return;
  if (width > 1280) planet.scale.setScalar(0.003);
  else if (width >= 1024) planet.scale.setScalar(0.003);
  else if (width >= 768) planet.scale.setScalar(0.0027);
  else planet.scale.setScalar(0.0027);
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

/**
 * Animate
 */
const clock = new THREE.Timer();

const tick = () => {
  clock.update();
  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsed();

  if (planet) {
    planet.rotation.y += delta * 0.1;
  }

  directionalLight.position.x = Math.sin(elapsedTime * 0.25) * 7;
  directionalLight.position.z = Math.cos(elapsedTime * 0.25) * 7;
  directionalLight.position.y = 3;

  // Update controls
  //   controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
