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

// TIME
var time = {type: "f", value: 0 };

//LIGHTING PROPERTIES
var lightColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};
var ambientColor = {type: "c", value: new THREE.Color(0.4,0.4,0.4)};
var lightPosition = {type: "v3", value: new THREE.Vector3(-0.49,0.79,0.49)};

//MATERIAL PROPERTIES 
var kAmbient = {type: "f", value: 0.4 };
var kDiffuse = {type: "f", value: 0.5 };
var kSpecular = {type: "f", value: 0.3 };
var shininess = {type: "f", value: 1.5 };

//TEXTURES
var chessboardTexture =  new THREE.ImageUtils.loadTexture('Bonus_Files/checkerboard.jpg');
chessboardTexture.wrapS = chessboardTexture.wrapT = THREE.RepeatWrapping;
chessboardTexture.repeat.set(4,4);
var leafDiffuse = new THREE.ImageUtils.loadTexture('Bonus_Files/Leaf_01_Diffuse.png');
var leafOpacity = new THREE.ImageUtils.loadTexture('Bonus_Files/Leaf_01_Opacity.jpg');
var pumpkinBump = new THREE.ImageUtils.loadTexture('Bonus_Files/Pumpkin_Bump.png');
var pumpkinNormals = new THREE.ImageUtils.loadTexture('Bonus_Files/Pumpkin_Normals.png');
var pumpkinDiffuse = new THREE.ImageUtils.loadTexture('Bonus_Files/Pumpkin_DiffuseColor.png');
var pumpkinSpecular = new THREE.ImageUtils.loadTexture('Bonus_Files/Pumpkin_Specular_Inv.png');
var stemDiffuse = new THREE.ImageUtils.loadTexture('Bonus_Files/Stem_Diffuse2.png');
var stemDisplace = new THREE.ImageUtils.loadTexture('Bonus_Files/Stem_Displace.png');
var stemNormals = new THREE.ImageUtils.loadTexture('Bonus_Files/Stem_NormalMap.png');

//INDIVIDUAL VARIABLE
var tableColor = {type: "c", value: new THREE.Color(0.9,0.5,0.4)};
var tableTexDensity = {type: "f", value: 10.0 };
var bunnyColor = {type: "c", value: new THREE.Color(0.5,0,0.5)};
var hatColor = {type: "c", value: new THREE.Color(0.1,0.1,0.5)};
var cloakColor = {type: "c", value: new THREE.Color(1.0,0.5,0.2)};
var cloakAmp = {type: "f", value: 0.1 };
var pumpkinColor = {type: "c", value: new THREE.Color(0.9,0.4,0.0)};
var pumpkintang = {type: "v3", value: new THREE.Vector3(0,1.0,0)};
var stemColor = {type: "c", value: new THREE.Color(0.33,0.4,0.15)};

// SHADER MATERIALS 
var tableMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColor: lightColor,
    tableColor: tableColor,
    kAmbient: kAmbient,
    chessboardTexture: {type: "t", value: chessboardTexture},
    tableTexDensity: tableTexDensity,
    shininess: shininess,
  }});
var bunnyMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColor: lightColor,
    lightPosition: lightPosition,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    kSpecular: kSpecular,
    shininess: shininess,
    bunnyColor: bunnyColor,
  }});
var hatMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColor: lightColor,
    kAmbient: kAmbient,
    hatColor: hatColor,
    shininess: shininess,
  }});
var cloakMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColor: lightColor,
    cloakColor: cloakColor,
    lightPosition: lightPosition,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    kSpecular: kSpecular,
    shininess: shininess,
    time: time,
    cloakAmp: cloakAmp,
  }});
var leafMaterial = new THREE.ShaderMaterial({
  uniforms:{
    leafDiffuse: {type: "t", value: leafDiffuse},
    leafOpacity: {type: "t", value: leafOpacity},
  },
  transparent: true});
var pumpkinMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightPosition: lightPosition,
    kAmbient: kAmbient,
    kDiffuse: {type: "f", value: 2.0 },
    kSpecular: {type: "f", value: 1.5 },
    shininess: {type: "f", value: 5.5 },
    pumpkinColor: pumpkinColor,
    pumpkintang: pumpkintang,
    pumpkinBump: {type: "t", value: pumpkinBump},
    pumpkinDiffuse: {type: "t", value: pumpkinDiffuse},
    pumpkinNormals: {type: "t", value: pumpkinNormals},
    pumpkinSpecular: {type: "t", value: pumpkinSpecular},
  },
  transparent: true});
var stemMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightPosition: lightPosition,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    stemColor: stemColor,
    pumpkintang: pumpkintang,
    stemDiffuse: {type: "t", value: stemDiffuse},
    stemDisplace: {type: "t", value: stemDisplace},
    stemNormals: {type: "t", value: stemNormals},
  },
  transparent: true});

// LOAD SHADERS
var shaderFiles = [
  'glsl_bonus/table.fs.glsl','glsl_bonus/table.vs.glsl',
  'glsl_bonus/bunny.fs.glsl','glsl_bonus/bunny.vs.glsl',
  'glsl_bonus/pumpkin.fs.glsl','glsl_bonus/pumpkin.vs.glsl',
  'glsl_bonus/stem.fs.glsl','glsl_bonus/stem.vs.glsl',
  'glsl_bonus/cloak.fs.glsl','glsl_bonus/cloak.vs.glsl',
  'glsl_bonus/hat.fs.glsl','glsl_bonus/hat.vs.glsl',
  'glsl_bonus/leaf.fs.glsl','glsl_bonus/leaf.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
 tableMaterial.vertexShader = shaders['glsl_bonus/table.vs.glsl'];
 tableMaterial.fragmentShader = shaders['glsl_bonus/table.fs.glsl'];
 bunnyMaterial.vertexShader = shaders['glsl_bonus/bunny.vs.glsl'];
 bunnyMaterial.fragmentShader = shaders['glsl_bonus/bunny.fs.glsl'];
 cloakMaterial.vertexShader = shaders['glsl_bonus/cloak.vs.glsl'];
 cloakMaterial.fragmentShader = shaders['glsl_bonus/cloak.fs.glsl'];
 hatMaterial.vertexShader = shaders['glsl_bonus/hat.vs.glsl'];
 hatMaterial.fragmentShader = shaders['glsl_bonus/hat.fs.glsl'];
 leafMaterial.vertexShader = shaders['glsl_bonus/leaf.vs.glsl'];
 leafMaterial.fragmentShader = shaders['glsl_bonus/leaf.fs.glsl'];
 pumpkinMaterial.vertexShader = shaders['glsl_bonus/pumpkin.vs.glsl'];
 pumpkinMaterial.fragmentShader = shaders['glsl_bonus/pumpkin.fs.glsl'];
 stemMaterial.vertexShader = shaders['glsl_bonus/stem.vs.glsl'];
 stemMaterial.fragmentShader = shaders['glsl_bonus/stem.fs.glsl'];
})

// LOAD OBJECT
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };
  var onError = function() {
    console.log('Failed to load ' + file);
  };
  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    scene.add(object);
  }, onProgress, onError);
  
  return loader;
}

loadOBJ('Bonus_Files/Table.obj',tableMaterial,1.0,0,0,0,0,0,0);
loadOBJ('Bonus_Files/Bunny.obj',bunnyMaterial,1.0,-3.0,0,-3.0,0,-0.75,0);
loadOBJ('Bonus_Files/Bunny_Hat.obj',hatMaterial,1.0,-3.0,0,-3.0,0,-0.75,0);
loadOBJ('Bonus_Files/Bunny_Cloak.obj',cloakMaterial,1.0,11.0,0,-15.0,0,0,0);
loadOBJ('Bonus_Files/Squash.obj',pumpkinMaterial,1.0,0,0,8.5,0,0,0);
loadOBJ('Bonus_Files/Squash_Steam.obj',stemMaterial,1.0,0,0,8.5,0,0,0);


// SETUP UPDATE CALL-BACK
var leaves = [];
var clock = new THREE.Clock();
clock.start();
// Enable blending
var render = function() {
  time.value = clock.getElapsedTime();
  if (Math.floor(time.value) % 3 == 0) {
    var leafGeometry = new THREE.PlaneGeometry(4,4,32,32);
    var leaf = new THREE.Mesh(leafGeometry,leafMaterial);
    leaf.position.set(80.0 * (Math.random()-0.5), 40.0, 80.0 * (Math.random()-0.5));
    leaf.rotation.x= 2.0 * (Math.random()-0.5);
    leaf.rotation.y = 2.0 * (Math.random()-0.5);
    leaf.rotation.z = 2.0 * (Math.random()-0.5);
    leaf.velocity = new THREE.Vector3(
      0.1 * (Math.random()-0.5),-0.1 * (Math.random()+1.0),0.1 * (Math.random()-0.5)
    );
    leaves.push(leaf);
    leaf.alive = true;
    setTimeout(function() {
      leaf.alive = false;
      scene.remove(leaf);
      leaves.shift();
    }, 8000);
    scene.add(leaf);
  }
  leaves.forEach(l => {
    l.position.add(l.velocity);
  });
  cloakMaterial.needsUpdate = true;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();