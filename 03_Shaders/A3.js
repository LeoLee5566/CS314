/**
 * UBC CPSC 314 (2016_W1)
 * Assignment 3
 */

// CREATE SCENE
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xcdcdcd);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(25.0,(window.innerWidth/window.innerHeight), 0.1, 10000);
camera.position.set(0.0,15.0,40.0);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4,4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(30.0, 30.0), floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

//TEXTURES
var rocksTexture =  {type: "t", value: new THREE.ImageUtils.loadTexture('images/gravel-rocks-texture.jpg')};

//LIGHTING PROPERTIES
var lightColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};
var ambientColor = {type: "c", value: new THREE.Color(0.4,0.4,0.4)};
var lightPosition = {type: "v3", value: new THREE.Vector3(0.49,0.79,0.49)};

//MATERIAL PROPERTIES 
var kAmbient = {type: "f", value: 0.4 };
var kDiffuse = {type: "f", value: 0.8 };
var kSpecular = {type: "f", value: 0.8 };
var shininess = {type: "f", value: 10.0 };

//SPOT LIGHTING
var lightstate = {type: "i", value: 0 };
var lightsourcePosition = { type: "v3", value: new THREE.Vector3(0, 8.0, 4.0)};
var lightAngle = {type: "f", value: 0.95};


var uniforms = {
  lightColor: lightColor,
  ambientColor: ambientColor,
  lightPosition: lightPosition,
  kAmbient: kAmbient,
  kDiffuse: kDiffuse,
  kSpecular: kSpecular,
  shininess: shininess,
  lightstate: lightstate,
  lightsourcePosition: lightsourcePosition,
  lightAngle: lightAngle, 
}

// SHADER MATERIALS (Remember to change this, in order to use uniform variables.)
var gouraudMaterial = new THREE.ShaderMaterial({
  uniforms:uniforms});
var phongMaterial = new THREE.ShaderMaterial({
  uniforms:uniforms});
var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms:uniforms});
var textureMaterial = new THREE.ShaderMaterial({
  uniforms:{
    rocksTexture: rocksTexture,
    lightstate: lightstate,
    lightPosition: lightPosition,
    lightsourcePosition: lightsourcePosition,
    lightAngle: lightAngle, 
  }});

var lightsourceMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColor: lightColor,
  }});

// LOAD SHADERS
var shaderFiles = [
  'glsl/gouraud.fs.glsl','glsl/gouraud.vs.glsl',
  'glsl/phong.vs.glsl','glsl/phong.fs.glsl',
  'glsl/blinnPhong.vs.glsl','glsl/blinnPhong.fs.glsl',
  'glsl/texture.fs.glsl','glsl/texture.vs.glsl',
  'glsl/ls.fs.glsl','glsl/ls.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
 gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
 gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
 phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
 phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
 blinnPhongMaterial.vertexShader = shaders['glsl/blinnPhong.vs.glsl'];
 blinnPhongMaterial.fragmentShader = shaders['glsl/blinnPhong.fs.glsl'];
 textureMaterial.fragmentShader = shaders['glsl/texture.fs.glsl'];
 textureMaterial.vertexShader = shaders['glsl/texture.vs.glsl'];
 lightsourceMaterial.fragmentShader = shaders['glsl/ls.fs.glsl'];
 lightsourceMaterial.vertexShader = shaders['glsl/ls.vs.glsl'];
})

// CREATE SPHERES
var sphereRadius = 2.0;
var sphere = new THREE.SphereGeometry(sphereRadius, 16, 16);

var gouraudSphere = new THREE.Mesh(sphere, gouraudMaterial); 
gouraudSphere.position.set(-7.5, sphereRadius, 0);
scene.add(gouraudSphere);

var phongSphere = new THREE.Mesh(sphere, phongMaterial); 
phongSphere.position.set(-2.5, sphereRadius, 0);
scene.add(phongSphere);

var blinnPhongSphere = new THREE.Mesh(sphere, blinnPhongMaterial); 
blinnPhongSphere.position.set(2.5, sphereRadius, 0);
scene.add(blinnPhongSphere);

var textureSphere = new THREE.Mesh(sphere, textureMaterial); 
textureSphere.position.set(7.5, sphereRadius, 0);
scene.add(textureSphere);


var lightsourceSphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), lightsourceMaterial); 
lightsourceSphere.position.set(0,8.0,4.0);

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("1")) {
    lightColor.value = new THREE.Color(Math.random(),Math.random(),Math.random());
  }
  if (keyboard.pressed("M")) {
    ambientColor.value = new THREE.Color(Math.random(),Math.random(),Math.random());
    lightColor.value =  new THREE.Color(1.0,1.0,1.0);
  }
  if (keyboard.pressed("2")) {
    if (lightstate.value == 0) {
      clock.start();
      lightstate.value = 1;
      scene.add(lightsourceSphere);
    } 
  }
  if (keyboard.pressed("3")) {
    if (lightstate.value == 1) {
      lightstate.value = 0;
      lightsourceSphere.alive = false;
      lightPosition.value = new THREE.Vector3(0.49,0.79,0.49);
      scene.remove(lightsourceSphere);
    }
  }
}


// SETUP UPDATE CALL-BACK
var clock = new THREE.Clock();
clock.autoStart = false;
var render = function() {
  var time = clock.getElapsedTime();
  if (lightstate.value == 1) {
    lightPosition.value = new THREE.Vector3(7.5*Math.sin(time/2.0), -6.0, -4.0);
  }
  checkKeyboard();
	textureMaterial.needsUpdate = true;
	phongMaterial.needsUpdate = true;
	blinnPhongMaterial.needsUpdate = true;
  gouraudMaterial.needsUpdate = true;
  lightsourceMaterial.needsUpdate = true;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();