import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

// get start button and scene going with a button
const start = document.getElementById('play');
start.crossOrigin = 'anonymous';
start.addEventListener('click', main);

function main() {

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x4a376d);
  const fov = 75;
  const aspect = canvas.clientWidth/canvas.clientHeight;
  const near = 0.1;
  const far = 10000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 5;
  camera.position.y = 13;
  camera.position.z = 75;
  const listener = new THREE.AudioListener;
  camera.add(listener);
 

  let controls = new OrbitControls(camera, canvas);
  controls.target.set(0,0,0);
  controls.update();
  const scene = new THREE.Scene();
  const blobs = [10,9,4,8,7, -10, -3, -9,6, -4];
  const blobsRot = [];

  // play sound
  const soundFile = 'sounds/Cherry-Pie-temp.mp3';
  const audioLoader = new THREE.AudioLoader();
  const sound = new THREE.PositionalAudio(listener);
  audioLoader.load(soundFile, (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.play();
    
  })
  
// lights
  
  const color = 0xf7cbcb;
  const directLightIntensity = 0.75;
  const dirLight = new THREE.DirectionalLight(color, directLightIntensity );
  dirLight.position.set(-1, 2, 4);
  scene.add(dirLight);
  
  const upperColor = 0x8c0c03;
  const lowerColor = 0xff8585;
  const hemisphereLightIntensity = 0.5;
  const hemLight = new THREE.HemisphereLight(upperColor, lowerColor, hemisphereLightIntensity);
  scene.add(hemLight);
  
  const loader = new THREE.TextureLoader();

  const wireframeMaterial = new THREE.MeshPhongMaterial({wireframe: true, color:0x4a376d}); 
  
  // background

  const bgRadius = 100;
  const bgWidthSegments = 10;
  const bgHeightSegments = 5;
  const bgTexture = loader.load('images/bg1.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    
  });
  const bgMaterial = new THREE.MeshBasicMaterial({map: bgTexture, side: THREE.BackSide});
  const bgGeometry = new THREE.SphereGeometry(bgRadius, bgWidthSegments, bgHeightSegments);
  const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
  scene.add(bgSphere);

  // background frame

  const bgFrame = new THREE.Mesh(bgGeometry, wireframeMaterial);
  scene.add(bgFrame);

  //donut

  const tubeRadius = 7;
  const donutRadius = 6.65;
  const radialSegments = 30;
  const tubularSegments = 100;
  const p = 1;
  const q = 1;
  const donutMaterial = new THREE.MeshPhongMaterial({color: 0xfffc7c2, shininess: 80, transparent: true, opacity: 0.98});
  const donutGeometry = new THREE.TorusKnotGeometry(donutRadius, tubeRadius, radialSegments, tubularSegments, p, q);
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  scene.add(donut);

  //blobs

  const blobRadius = 0.6;
  const tubyRadius = 0.3;
  const r = 3;
  const s = 5;
  const blobMaterial = new THREE.MeshPhongMaterial({color: 0x570603, shininess: 20});
  const blobGeometry = new THREE.TorusKnotGeometry(blobRadius, tubyRadius, radialSegments, tubularSegments, r, s);
  for(let i = 0; i< blobs.length; i++){
    const blob = new THREE.Mesh(blobGeometry, blobMaterial);
    blob.material.transparent = true;
    blob.material.opacity = 0.99;
    blob.position.set(6 * Math.tan(blobs[i]) , 30 * Math.sin(blobs[i]) + 30, 18 * Math.cos(blobs[i]));
    scene.add(blob);
    blobsRot.push(blob);
  }

  // flesh ball

  const ballRadius = 10;
  const widthSegments = 64;
  const heightSegments = 32;
  const ballTexture = loader.load('images/ballTexture.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
  });
  const ballMaterial = new THREE.MeshPhongMaterial({map: ballTexture, side: THREE.BackSide});
  const ballGeometry = new THREE.SphereGeometry(ballRadius, widthSegments, heightSegments);
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.x = 40;
  scene.add(ball);

  // lighter purple stem

  const purpleStemTopRadius = 1;
  const purpleStemBottomRadius = 1;
  const purpleStemHeight = 20;
  const purpleStemRadialSegments = 10;
  const purpleStemHeightSegments = 10;
  const purpleStemMaterial = new THREE.MeshPhongMaterial({color: 0xaa7ff5, shininess: 10});
  const purpleStemGeometry = new THREE.CylinderGeometry(purpleStemTopRadius, purpleStemBottomRadius, purpleStemHeight, purpleStemRadialSegments, purpleStemHeightSegments);
  const purpleStem = new THREE.Mesh(purpleStemGeometry, purpleStemMaterial);
  purpleStem.position.set(0,-10,-50);
  scene.add(purpleStem);

  // darker purple stem

  const darkStemTopRadius =0.5;
  const darkStemBottomRadius = 1.5;
  const darkStemHeight = 30;
  const darkStemRadialSegments = 5;
  const darkStemHeightSegments = 3;
  const darkStemMaterial = new THREE.MeshPhongMaterial({map: bgTexture});
  const darkStemGeometry = new THREE.CylinderGeometry(darkStemTopRadius, darkStemBottomRadius,darkStemHeight, darkStemRadialSegments, darkStemHeightSegments);
  const darkStem = new THREE.Mesh(darkStemGeometry, darkStemMaterial);
  darkStem.position.set(-40,10,10);
  scene.add(darkStem);

  // stem with backround texture

  const darkStemTwin = new THREE.Mesh(darkStemGeometry, purpleStemMaterial);
  darkStemTwin.position.set(-40,10,10);
  darkStemTwin.rotation.z = Math.PI/6;
  scene.add(darkStemTwin);

  // green stem

  const greenStemTopRadius = 1.6;
  const greenStemHeight = 50;
  const greenStemRadialSegments = 64;
  const greenStemHeightSegments = 1;
  const greenStemMaterial = new THREE.MeshPhongMaterial({color: 0x4fce73, shininess: 50});
  const greenStemGeometry = new THREE.ConeGeometry(greenStemTopRadius, greenStemHeight, greenStemRadialSegments, greenStemHeightSegments);
  const greenStem = new THREE.Mesh(greenStemGeometry, greenStemMaterial);
  greenStem.position.set(0, -20, -30);
  scene.add(greenStem);

  // chimney

  const chimneyBoxGeometry = new THREE.BoxGeometry(50,100,50,1, 10, 1);
  const chimneyBox = new THREE.Mesh(chimneyBoxGeometry, wireframeMaterial);
  chimneyBox.position.set(-40,70,10);
  chimneyBox.material.color.setHex(0xf2d30c);
  scene.add(chimneyBox);

  const chimneyBoxMembrane = new THREE.Mesh(chimneyBoxGeometry, bgMaterial);
  chimneyBoxMembrane.position.set(-40,95,10);
  scene.add(chimneyBoxMembrane);

  //black boxes

  const blackBoxMaterial = new THREE.MeshPhongMaterial({color: 0x000000, shininess: 100, side: THREE.BackSide})

  const blackBoxGeometry = new THREE.BoxGeometry(10,10,10);
  const silentBlackBox = new THREE.Mesh(blackBoxGeometry,blackBoxMaterial);
  silentBlackBox.position.set(120,175,50);
  scene.add(silentBlackBox);

  const musicalBlackBox = new THREE.Mesh(blackBoxGeometry,blackBoxMaterial);
  musicalBlackBox.position.set(-200,120,100);
  scene.add(musicalBlackBox);  
  musicalBlackBox.add(sound);

  // twisted flesh stem

  class CustomCurve extends THREE.Curve {
    constructor(scale = 0.5) {
      super();
      this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()){

      const tx = Math.cos(Math.PI * t * 0.5);
      const ty = Math.tanh(2 * Math.PI * t);
      const tz = Math.sin(Math.PI * t);

      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const path = new CustomCurve(10);
  const fleshStemGeometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
  const modelTexture1 = loader.load('images/modelTexture1.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
  });
  const fleshStemMaterial = new THREE.MeshPhongMaterial({map: modelTexture1});
  const fleshStem = new THREE.Mesh(fleshStemGeometry, fleshStemMaterial);
  fleshStem.position.set(10, -30, -20);
  scene.add(fleshStem);


  // shriveled models

  let model, model2;

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('models/usnm_73-100k-2048.gltf', (gltf) => {
      model = gltf.scene;
      model.traverse ((m) => {
        if(m.isMesh){
          m.material.map =  modelTexture1;
        }
      })
      model.scale.x = 300;
      model.scale.y = 300;
      model.scale.z = 300;
      model.position.z = -35;
      model.position.x = 30;
      model.position.y = -20;
      scene.add(model);
  });

  gltfLoader.load('models/usnm_1174917-100k-2048.gltf', (gltf) => {
    const modelTexture2 = loader.load('images/modelTexture2.jpg', (texture) => {
      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
    });
    model2 = gltf.scene;
      model2.traverse ((m) => {
        if(m.isMesh){
          m.material.map = modelTexture2;
        }
      })
      model2.scale.x = 80;
      model2.scale.y = 80;
      model2.scale.z = 80;
      model2.position.z = 35;
      model2.position.x = 30;
      model2.position.y = -20;
    
      scene.add(model2);

  });

  renderer.render(scene, camera);

  function render(time) {
    time *= 0.001;

    bgFrame.rotation.y += 0.1 * Math.tan(2 * Math.PI * time);
    
    ball.rotation.y += 0.01;
    fleshStem.position.x ++;
    if(fleshStem.position.x > bgRadius/2 || fleshStem.position.x < -bgRadius/2){
      fleshStem.position.x *= -1;
    }
    purpleStem.position.y += Math.sin(2 * Math.PI * time);

    greenStem.position.y ++;
    if(greenStem.position.y > bgRadius/2 || greenStem.position.y < -bgRadius/2 ){
      greenStem.position.y *= -1;
    }
    
    darkStem.position.z += Math.cos(2 * Math.PI * time);
    darkStemTwin.position.z += Math.sin(2 * Math.PI * time);
    blobsRot.forEach((b) =>{
      b.rotation.x += Math.random() * Math.tan(2* Math.PI);
      b.rotation.y += Math.random() * Math.tan(2* Math.PI);
      b.rotation.z += Math.random() * Math.tan(2* Math.PI);

      b.position.x += 1/Math.sinh(2 * Math.PI * time)/2;
      b.position.y += Math.sin(2 * Math.PI * time)/2;
      b.position.z -= Math.cos(2 * Math.PI * time)/2;

    })

    donut.rotation.y += 0.01 * Math.tan(2 * Math.PI * time);

    musicalBlackBox.position.z -= 10 * Math.cos( 10 * Math.PI * time);
    musicalBlackBox.position.y -= 10 * Math.sin( 10 * Math.PI * time);
    musicalBlackBox.rotation.y -= Math.tan( 2 * Math.PI * time);

    
    if(model){
      model.rotation.z += 1;
    }

    if(model2){
      model2.position.y += 1;
      if(model2.position.y <bgRadius/2 || model2.position.y > bgRadius/2 ){
        model2.position.y *= -1;
      }
    }


    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}



