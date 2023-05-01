/*
 * UBC CPSC 314 2020W1
 * Assignment 2
 * Transformations
 */

//*****************************TEMPLATE CODE DO NOT MODIFY********************************//
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
// SETUP RENDERER AND SCENE
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);
// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
camera.position.set(-28,10,28);
camera.lookAt(scene.position);
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
// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
//****************************************************************************************//

// OCTOPUS MATRIX: To make octopus move, modify this matrix in updatebody()
var octopusMatrix = {type: 'm4', value: new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,3.0, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
  )};

//*****************************TEMPLATE CODE DO NOT MODIFY********************************//
// MATERIALS
var normalMaterial = new THREE.MeshNormalMaterial();
var octopusMaterial = new THREE.ShaderMaterial({
  uniforms:{
    octopusMatrix: octopusMatrix,
  },
});
var shaderFiles = [
  'glsl/octopus.vs.glsl',
  'glsl/octopus.fs.glsl'
];
new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  octopusMaterial.vertexShader = shaders['glsl/octopus.vs.glsl'];
  octopusMaterial.fragmentShader = shaders['glsl/octopus.fs.glsl'];
})
// GEOMETRY
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
  
}
// We set octopus on (0,0,0) without scaling
// so we can change these values with transformation matrices.
loadOBJ('obj/Octopus_08_A.obj',octopusMaterial,1.0,0,0,0,0,0,0);

//***** YOU MAY FIND THESE FUNCTIONS USEFUL ******//
function defineRotation_X(theta) {
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var mtx = new THREE.Matrix4().set(
    1.0,       0.0,      0.0,       0.0, 
    0.0,       cosTheta, -sinTheta, 0.0, 
    0.0,       sinTheta, cosTheta,  0.0, 
    0.0,       0.0,      0.0,       1.0
  );
  return mtx;
}
function defineRotation_Y(theta) {
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var mtx = new THREE.Matrix4().set(
    cosTheta,  0.0,      sinTheta,  0.0, 
    0.0,       1.0,      0.0,       0.0, 
    -sinTheta, 0.0,      cosTheta,  0.0, 
    0.0,       0.0,      0.0,       1.0
  );
  return mtx;
}
function defineRotation_Z(theta) {
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var mtx = new THREE.Matrix4().set(
    cosTheta,  -sinTheta, 0.0,       0.0, 
    sinTheta,  cosTheta,  0.0,       0.0, 
    0.0,       0.0,       1.0,       0.0, 
    0.0,       0.0,       0.0,       1.0
  );
  return mtx;
}
//************************************************//
function addEyeAndPupil(material, eyeballTS, pupilTS, pupilTheta) {
  var eyegeo = new THREE.SphereGeometry(1.0,64,64);
  // Eyeball
  var eyeball = new THREE.Mesh(eyegeo, material);
  var eyeballMtx = new THREE.Matrix4().multiplyMatrices(
    octopusMatrix.value,
    eyeballTS 
  );
  eyeball.setMatrix(eyeballMtx);
  scene.add(eyeball);
  // Pupil
  var pupilRT = defineRotation_Y(pupilTheta);
  var pupilTSR = new THREE.Matrix4().multiplyMatrices(
    pupilRT, 
    pupilTS
  );
  var pupilMtx = new THREE.Matrix4().multiplyMatrices(
    eyeballMtx, 
    pupilTSR
  );
  var pupil = new THREE.Mesh(eyegeo, material);
  pupil.setMatrix(pupilMtx);
  scene.add(pupil);
  return [eyeball, pupil];
}

// Left eye
var eyeballTS_L = new THREE.Matrix4().set(
  0.5,0.0,0.0,-0.2, 
  0.0,0.5,0.0,4.1, 
  0.0,0.0,0.5,0.92, 
  0.0,0.0,0.0,1.0
);
var pupilTS_L = new THREE.Matrix4().set(
  0.35,0.0,0.0,0.0, 
  0.0,0.35,0.0,0.0, 
  0.0,0.0,0.15,-0.9, 
  0.0,0.0,0.0,1.0
);
var theta_L = Math.PI * (130 /180.0);
// Right eye
var eyeballTS_R = new THREE.Matrix4().set(
  0.5,0.0,0.0,-0.2, 
  0.0,0.5,0.0,4.1, 
  0.0,0.0,0.5,-0.92, 
  0.0,0.0,0.0,1.0
);
var pupilTS_R = new THREE.Matrix4().set(
  0.35,0.0,0.0,0.0, 
  0.0,0.35,0.0,0.0, 
  0.0,0.0,0.15,-0.9, 
  0.0,0.0,0.0,1.0
);
var theta_R = Math.PI * (50 /180.0);
lefteye = addEyeAndPupil(normalMaterial, eyeballTS_L, pupilTS_L, theta_L);
eyeball_L = lefteye[0];
pupil_L = lefteye[1];
righteye = addEyeAndPupil(normalMaterial, eyeballTS_R, pupilTS_R, theta_R);
eyeball_R = righteye[0];
pupil_R = righteye[1];
//****************************************************************************************//


//***** YOUR CODE HERE *****//
// You need to add 3 joints and 3 links for each arm
// Each arm starts with a joint and ends with a link
// joint-link-joint-link-joint-link

// Geometries of the arm
var j1 = new THREE.SphereGeometry(0.5,64,64);
var l1 = new THREE.CylinderGeometry(0.35, 0.45, 2.0, 64);
var j2 = new THREE.SphereGeometry(0.4, 64, 64);
var l2 = new THREE.CylinderGeometry(0.25, 0.35, 2.0, 64);
var j3 = new THREE.SphereGeometry(0.3, 64, 64);
var l3 = new THREE.CylinderGeometry(0.1, 0.25, 2.0, 64);

// ***** Q1 *****//
function addOneArm(angle_Y, angle_Z, socketPosition) {
  /* angle_Y, angle_Z determines the direction of the enire arm
   * i.e. you create a arm on world scene's origin, rotate along
   * y-axis, and z-axis by these angles will let you insert your
   * arm into the socket
  */

  // Add joint1
  /* Hint: You should rotate joint1 so that for future links and joints,
   *       They can be along the direction of the socket
   *       Even though the sphere looks unchanged but future links are
   *       chidren frames of this joint1
   * Hint: You also need to translate joint1
  */
  var joint1 = new THREE.Mesh(j1, normalMaterial);
  var M_j1 = new THREE.Matrix4().multiplyMatrices(
    octopusMatrix.value,
    new THREE.Matrix4().multiplyMatrices(
      new THREE.Matrix4().set(
        1.0,0.0,0.0,socketPosition[0], 
        0.0,1.0,0.0,socketPosition[1], 
        0.0,0.0,1.0,socketPosition[2], 
        0.0,0.0,0.0,1.0
      ),
      new THREE.Matrix4().multiplyMatrices(
        defineRotation_Y(angle_Y), 
        defineRotation_Z(angle_Z)
      )
    )
  );
  joint1.setMatrix(M_j1);
  scene.add(joint1);

  // Add link1
  /* Hint: Find out the translation matrix so that
   *       link is connected with joints, without overlaping
   */
  var link1 = new THREE.Mesh(l1, normalMaterial);
  var M_l1 = new THREE.Matrix4().multiplyMatrices(M_j1, trans_l1);
  link1.setMatrix(M_l1);
  scene.add(link1);
  
  // Add joint2
  var joint2 = new THREE.Mesh(j2, normalMaterial);
  var M_j2 = new THREE.Matrix4().multiplyMatrices(M_l1, trans_j2);
  joint2.setMatrix(M_j2);
  scene.add(joint2);

  // Add link2
  var link2 = new THREE.Mesh(l2, normalMaterial);
  var M_l2 = new THREE.Matrix4().multiplyMatrices(M_j2, trans_l2);
  link2.setMatrix(M_l2);
  scene.add(link2);

  // Add joint3
  var joint3 = new THREE.Mesh(j3, normalMaterial);
  var M_j3 = new THREE.Matrix4().multiplyMatrices(M_l2, trans_j3);
  joint3.setMatrix(M_j3);
  scene.add(joint3);

  // Add link3
  var link3 = new THREE.Mesh(l3, normalMaterial);
  var M_l3 = new THREE.Matrix4().multiplyMatrices(M_j3, trans_l3);
  link3.setMatrix(M_l3);
  scene.add(link3);

  return [joint1, link1, joint2, link2, joint3, link3];
}

var trans_l1 = new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,1.0, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
);

var trans_j2 = new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,1.0, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
);

var trans_l2 = new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,1.0, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
);

var trans_j3 = new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,1.1, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
);

var trans_l3 = new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,1.0, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
);

var matrices = [trans_l1,trans_j2,trans_l2,trans_j3,trans_l3];

/* Now, call addOneArm() 4 times with 4 directions and
 * and 4 socket positions, you will add 4 arms on octopus
 * We return a tuple of joints and links, use them to 
 * animate the octupus
*/

// Socket positions
socketPos1 = [-3.14, -0.35, 1.44];
socketPos2 = [3.14, -0.35, 1.44];
socketPos3 = [3.14, -0.35, -1.44];
socketPos4 = [-3.14, -0.35, -1.44];
socketPos5 = [-1.44, -0.35, 3.14];
socketPos6 = [1.44, -0.35, 3.14];
socketPos7 = [1.44, -0.35, -3.14];
socketPos8 = [-1.44, -0.35, -3.14];
//***** Q2 *****//
var arm1 = addOneArm(Math.PI*(-157.5/180), Math.PI*(-0.5), socketPos1);
var arm2 = addOneArm(Math.PI*(-22.5/180), Math.PI*(-0.5), socketPos2);
var arm3 = addOneArm(Math.PI*(22.5/180), Math.PI*(-0.5), socketPos3);
var arm4 = addOneArm(Math.PI*(157.5/180), Math.PI*(-0.5), socketPos4);
var arm5 = addOneArm(Math.PI*(-112.5/180), Math.PI*(-0.5), socketPos5);
var arm6 = addOneArm(Math.PI*(-67.5/180), Math.PI*(-0.5), socketPos6);
var arm7 = addOneArm(Math.PI*(67.5/180), Math.PI*(-0.5), socketPos7);
var arm8 = addOneArm(Math.PI*(112.5/180), Math.PI*(-0.5), socketPos8);

function getEndEffector(t, socketPosition) {
  var period = 2 + Math.PI;
  var cur_time = t%period;
  var x_offset = socketPosition[0] >= 0? socketPosition[0]+2.5 : socketPosition[0]-3.5;
  var z_offset = socketPosition[2] >= 0? socketPosition[2]+1.1 : socketPosition[2]-1.1;
  if (cur_time <= 2.0) {
    return new THREE.Vector3(x_offset + cur_time,
      0,
      z_offset);
  } else {
    return new THREE.Vector3(x_offset + 1 + Math.cos((cur_time-2)),
      Math.sin((cur_time-2)),
      z_offset);
  }
}

function getIntersection(l1_length,l2_length,start_pos,endEffector,upvector) {
  var VectorA = endEffector.clone().sub(start_pos);
  var a = VectorA.length();
  var o_s2 = a - l2_length;
  var c = l1_length - o_s2;
  var b = o_s2 + (0.5 * c);
  var d = (b * c)/a;

  var j = VectorA.clone().normalize().multiplyScalar(o_s2 + d).add(start_pos);
  var planeNormal = VectorA.clone();
  planeNormal.cross(upvector).normalize();
  var VectorJ = planeNormal.clone();
  VectorJ.cross(VectorA).normalize();
  var OppositeLeg = Math.sqrt(Math.pow(l1_length,2) - Math.pow(o_s2 + d,2));
  var Intersect =  VectorJ.clone().multiplyScalar(OppositeLeg).add(j);
  return Intersect;
}

function lookatTransformation(objPos,targetPos,upvector) {
  var z_axis = targetPos.clone().sub(objPos);
  z_axis.normalize();
  var x_axis = z_axis.clone();
  x_axis.cross(upvector).normalize();
  var y_axis = x_axis.clone();
  y_axis.cross(z_axis).normalize();
  return new THREE.Matrix4().set(
    x_axis.x,z_axis.x,y_axis.x,objPos.x, 
    x_axis.y,z_axis.y,y_axis.y,objPos.y, 
    x_axis.z,z_axis.z,y_axis.z,objPos.z, 
    0.0,0.0,0.0,1.0
  );
}



function animateArm(t, arm, angle_Y, angle_Z, socketPosition) {
  joint1 = arm[0];
  link1 = arm[1];
  joint2 = arm[2];
  link2 = arm[3];
  joint3 = arm[4];
  link3 = arm[5];
  
  var M_j1 = new THREE.Matrix4().multiplyMatrices(
    octopusMatrix.value,
    new THREE.Matrix4().multiplyMatrices(
      new THREE.Matrix4().set(
        1.0,0.0,0.0,socketPosition[0], 
        0.0,1.0,0.0,socketPosition[1], 
        0.0,0.0,1.0,socketPosition[2], 
        0.0,0.0,0.0,1.0
      ),
      new THREE.Matrix4().multiplyMatrices(
        defineRotation_Y(angle_Y), 
        defineRotation_Z(angle_Z)
      )
    )
  );
  joint1.setMatrix(M_j1);
  var joint1_pos = new THREE.Vector3();
  joint1.getWorldPosition(joint1_pos);
  var endEffector = getEndEffector(t,socketPosition);

  var dis = endEffector.clone().sub(joint1_pos).length();
  var upvector = new THREE.Vector3(0,1.0,0);
  var joint3_pos = getIntersection(dis*3/4,2.0,joint1_pos,endEffector,upvector);
  var joint2_pos = getIntersection(2.0,2.0,joint1_pos,joint3_pos,upvector);

  // Add link1
  var rot_l1 = lookatTransformation(joint1_pos,joint2_pos,upvector);
  var M_l1 = new THREE.Matrix4().multiplyMatrices(
      rot_l1,
      trans_l1
    );
  link1.setMatrix(M_l1);

  // Add joint2
  var M_j2 = new THREE.Matrix4().multiplyMatrices(
    M_l1, trans_j2);
  joint2.setMatrix(M_j2);

  // Add link2
  var rot_l2 = lookatTransformation(joint2_pos,joint3_pos,upvector);
  var M_l2 = new THREE.Matrix4().multiplyMatrices(
      rot_l2,
      trans_l2
    );
  link2.setMatrix(M_l2);

  // Add joint3
  var M_j3 = new THREE.Matrix4().multiplyMatrices(M_l2, trans_j3);
  joint3.setMatrix(M_j3);

  // Add link3
  var rot_l3 = lookatTransformation(joint3_pos,endEffector,upvector);
  var M_l3 = new THREE.Matrix4().multiplyMatrices(
      rot_l3,
      trans_l3
    );
  link3.setMatrix(M_l3);

}

var clock = new THREE.Clock(true);
var initalMtx = octopusMatrix.value;
function updateBody() {
  switch(channel)
  {
    case 0: 
      break;

    case 1:
      //***** Example of how to rotate eyes with octopus *****//
      // Your animations should be similar to this
      // i.e. octopus' body parts moves at the same time
      var t = 2.0 * clock.getElapsedTime();
      octopusMatrix.value = new THREE.Matrix4().multiplyMatrices(
        defineRotation_Z(15/180*Math.sin(Math.max(t/((2+Math.PI)/(2*Math.PI))+1,0))-1/12),
        initalMtx
      );
      // Right eye
      eyeball_R.setMatrix(new THREE.Matrix4().multiplyMatrices(
        octopusMatrix.value,
        eyeballTS_R
      ));
      pupil_R.setMatrix(new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().multiplyMatrices(
          octopusMatrix.value,
          eyeballTS_R
        ),
        new THREE.Matrix4().multiplyMatrices(
          defineRotation_Y(theta_R),
          pupilTS_R
        )
      ));
      scene.add(eyeball_R);
      scene.add(pupil_R);
      // You can also define the matrices and multiply
      // Left eye
      oct_eye_L = new THREE.Matrix4().multiplyMatrices(
        octopusMatrix.value,
        eyeballTS_L
      );
      pupil_L_TSR = new THREE.Matrix4().multiplyMatrices(
        defineRotation_Y(theta_L),
        pupilTS_L
      );
      oct_pupil = new THREE.Matrix4().multiplyMatrices(
        oct_eye_L,
        pupil_L_TSR
      );
      eyeball_L.setMatrix(oct_eye_L);
      pupil_L.setMatrix(oct_pupil);

      // animate arms
      animateArm(t+0.7, arm1, Math.PI*(-157.5/180), Math.PI*(-0.5), socketPos1);
      animateArm(t+1.3, arm2, Math.PI*(-22.5/180), Math.PI*(-0.5), socketPos2);
      animateArm(t+1.9, arm3, Math.PI*(22.5/180), Math.PI*(-0.5), socketPos3);
      animateArm(t+1.1, arm4, Math.PI*(157.5/180), Math.PI*(-0.5), socketPos4);
      animateArm(t+0.2, arm5, Math.PI*(-112.5/180), Math.PI*(-0.5), socketPos5);
      animateArm(t+0.9, arm6, Math.PI*(-67.5/180), Math.PI*(-0.5), socketPos6);
      animateArm(t, arm7, Math.PI*(67.5/180), Math.PI*(-0.5), socketPos7);
      animateArm(t+0.4, arm8, Math.PI*(112.5/180), Math.PI*(-0.5), socketPos8);

      break;
    case 2:
      break;
    case 3:
      break;
    default:
      break;
  }
}


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var channel = 0;


function checkKeyboard() {
  for (var i=0; i<6; i++)
  {
    if (keyboard.pressed(i.toString()))
    {
      channel = i;
      break;
    }
  }
}


// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateBody();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();