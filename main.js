import './style.css';
import * as THREE from "three";
import { PointLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


//canvas
const canvas = document.querySelector("#webgl");
//scene
const scene = new THREE.Scene();
//bg -image
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("images/bg.jpg");
scene.background = bgTexture;
//sizes
const sizes = {
  width: innerWidth,
  height: innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera(53, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//Directional light
const directionalLight = new THREE.DirectionalLight(0XF5F0FF,8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
//point light
const pointLight = new THREE.PointLight(0XF5F0FF,1);
pointLight.position.set(-200, -200, -200)
scene.add(pointLight);


//Donut!!
let donut = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './assets/donut/scene.gltf', 
  (gltf) => {
    donut = gltf.scene;

    donut.rotation.x = Math.PI * 0.3;
    donut.rotation.z = Math.PI * 0.15;

    const radius = 0.01
    donut.scale.set(radius, radius, radius);
    scene.add(donut);
});

//mouse controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//animation
const clock = new THREE.Clock()
let lastElapsedTime = 0;

const tick = ()=> {
  
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  if (!!donut) {
    donut.position.y = Math.sin(elapsedTime * 0.9) * 0.1 - 0.1
  }

  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

//resizes
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});