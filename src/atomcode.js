// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

var text2 = document.createElement('div')
  document.body.appendChild(text2)

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer  ({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

var keyboard = {};
var player = {
  speed: -0.05
}

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

function onMouseMove( event ) {
	mouse.x = ( event.clientX - windowHalf.x );
	mouse.y = ( event.clientY - windowHalf.x );
}

var mouse1 = new THREE.Vector3(0,0,0);
var raycaster = new THREE.Raycaster();

function setMouseVector(event) {
  mouse1.x = 2 * (event.clientX/window.innerWidth)-1;
  mouse1.y = -2 * (event.clientY/window.innerHeight)+1;
  redraw();
}

function show() {
  console.log(mouse1.x + " " + mouse1.y);
}

//setInterval(show, 1000);

// sphere that follows mouse1
var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
var sphereMaterial = new THREE.MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xffff00
})

// Raycaster
var raycaster = new THREE.Raycaster();
var oldObjects = new Set()

var redraw = function() {
  //direction for Raycaster
  var direction = new THREE.Vector3().copy(mouse1).unproject(camera).sub(camera.position).normalize();
  raycaster.setFromCamera( direction, camera );
  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects( scene.children );

  oldObjects.forEach(function(obj){
    obj.material.color.set(obj.oldColor);
  })
  oldObjects.clear()

  var displayedText = false;
  for ( var i = 0; i < intersects.length; i++ ) {
    var obj = intersects[i].object;

    const v = new THREE.Color(obj.material.color)
    obj.oldColor = v;
    obj.material.color.set( 0xff0000 );

    oldObjects.add(obj);

    if(typeof intersects[i].object.text != 'undefined'){
      displayText(intersects[i].object.text);
      displayedText = true
    }else{
      console.error("error: unnamed object detected, can't display text")
    }
  }

  if(!displayedText){
    hideText()
  }
  // THIS IS VERY IMPORTANT
}

var rotation = new THREE.Vector3()

var cameraInput = function(){
  if(keyboard[87]){ // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[83]){ // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[65]){ // A key
    camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
  }
  if(keyboard[68]){ // D key
    camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
  }

  target.x = ( 1 - mouse.x ) * 0.002;
  target.y = ( 1 - mouse.y ) * 0.002;

  //right
  if(keyboard[39])
    camera.rotation.y -= 0.01

  //left
  if(keyboard[37])
    camera.rotation.y += 0.01

  //up
  if(keyboard[38])
    camera.rotation.x += 0.01

  //down
  if(keyboard[40])
    camera.rotation.x -= 0.01

  camera.up = new THREE.Vector3(0, 0, 1)
  //camera.rotation.set(rotation)

  //camera.rotation.x += 0.05 * (target.x - camera.rotation.x);
  //camera.rotation.y += 0.05 * (target.y  - camera.rotation.y);
}

function onResize( event ) {

	const width = window.innerWidth;
	const height = window.innerHeight;

  windowHalf.set( width / 2, height / 2 );

  camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );

}

var displayText = function(text){
  text2.style.position = 'absolute'
  text2.style.width = 100
  text2.style.height = 100
  text2.style.color = 'white'
  text2.innerHTML = text;
  text2.style.top = 200 + 'px'
  text2.style.left = 200 + 'px'
  text2.style.display = 'block'
}

var hideText = function(){
  text2.style.display = 'none'
}

// ------------------------------------------------
// this is where the fun begins
// ------------------------------------------------

var loader = new THREE.OBJLoader();
loader.load('https://console.echoar.xyz/query?key=young-field-0597&file=6af76ce2-2f57-4ed0-82d8-42652f0eddbe', function(gltf){
  car = gltf.scene.children[0];
  car.scale.set(0.5,0.5,0.5);
  scene.add(gltf.scene);
  animate();
});

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );

cube.text = 'test text on raycast'
// Add cube to Scene
scene.add( cube );

// Render Loop
var render = function () {
  //render
  requestAnimationFrame( render );

  //update
  cameraInput();

  // Render the scene
  renderer.render(scene, camera
};

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

//event listeners
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener( 'resize', onResize, false );
document.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener("mousemove", setMouseVector);

render();

//mouse locking
var canvas = document.getElementsByTagName("canvas")[0]

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

canvas.requestPointerLock()
