// import '../style/3d.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

// import { scrollToNext , scrollToPrevious } from '../src/carousel';
// import { scrollToNext, scrollToPrevious } from '../public/3dcarousel';


const cards = document.querySelectorAll(".card");
const container_button = document.querySelector(".cards-selection");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const loadingSpinner = document.getElementById("load-spin");

const container = document.getElementById('container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var ambientLight = new THREE.AmbientLight(0xffffff, 3); // color, intensity
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.setY(3);
camera.position.setZ(7);
camera.position.setX(-2);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Load custom .glb file
const models = [
  '../models/specs1.glb',
  '../models/specs2.glb',
  '../models/cool_sunglasses.glb',
  '../models/simple_glasses.glb',
  '../models/cyclops_sunglasses.glb',
  '../models/specs3.glb',
]

var current_model = models[0];

container_button.addEventListener("scroll", function(event) {
    event.preventDefault();
    return false;
});

let currentModelObject = null

export function loadModel(modelPath) {

  const loader = new GLTFLoader();
  
  

  loader.load(
    modelPath,
    function (gltf) {
      const model = gltf.scene;

      if (currentModelObject !== null) {
        scene.remove(currentModelObject);
      }

      // Calculate bounding box of the model
      const bbox = new THREE.Box3().setFromObject(model);
      const modelSize = bbox.getSize(new THREE.Vector3());

      // Calculate scaling factor based on window size
      const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
      const maxWindowSize = Math.max(container.clientWidth, container.clientHeight);
      const scaleFactor = maxWindowSize / maxDimension * 0.01; // Adjust scale as needed

      // Apply scaling factor to the model
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      scene.add(model);
      currentModelObject = model;
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading GLTF model:', error);
    }
  );
}

// loadModel(current_model);


const point = new THREE.PointLight(0xffffff);
point.position.set(5, 5, 5);
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

const lighthelper = new THREE.PointLightHelper(point);
const grid = new THREE.GridHelper(1000, 100);
// scene.add(lighthelper,grid);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

window.addEventListener('resize', onWindowResize);

function scrollToNext() {
  let nextCardIndex = getCurrentIndex() + 1;
  if (nextCardIndex >= cards.length) {
      nextCardIndex = cards.length - 1;
  }
  const scrollLeft = cards[nextCardIndex].offsetLeft - (container_button.offsetWidth - cards[nextCardIndex].offsetWidth) / 2;
  container_button.scrollTo({
      left: scrollLeft,
      behavior: "smooth"
  });
  return new Promise(resolve => {
      setTimeout(() => {
          resolve(getCurrentIndex());
      }, 500); // Adjust the timeout as needed to ensure scrolling completes before getting the index
  });
}

function scrollToPrevious() {
  let prevCardIndex = getCurrentIndex() - 1;
  if (prevCardIndex < 0) {
      prevCardIndex = 0;
  }
  const scrollLeft = cards[prevCardIndex].offsetLeft - (container_button.offsetWidth - cards[prevCardIndex].offsetWidth) / 2;
  container_button.scrollTo({
      left: scrollLeft,
      behavior: "smooth"
  });
  return new Promise(resolve => {
      setTimeout(() => {
          resolve(getCurrentIndex());
      }, 500); // Adjust the timeout as needed to ensure scrolling completes before getting the index
  });
}

function getCurrentIndex() {
  const centerScroll = container_button.scrollLeft + container_button.offsetWidth / 2;
  let currentIndex = 0;
  cards.forEach((card, index) => {
      if (card.offsetLeft <= centerScroll && card.offsetLeft + card.offsetWidth >= centerScroll) {
          currentIndex = index;
          return;
      }
  });
  return currentIndex;
}