import *  as  THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { WebXRManager } from 'three/src/renderers/webxr/WebXRManager';

var container;
var camera, scene, renderer;
var controller;
var sessionStarted = false;
var model

var text2 = document.createElement('div')
document.body.appendChild(text2)

container = document.createElement('div');
document.body.appendChild(container);

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0.5, 1, 0.25);
scene.add(light)

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

container.appendChild(renderer.domElement);

var arBtn = ARButton.createButton(renderer, { optionalFeatures: ['dom-overlay'], domOverlay: { root: document.getElementById("overlay") } });

var items = []
arBtn.addEventListener("click", function () {
    document.getElementById('reticle').style.display = 'block'
    let name = document.querySelector("input[type='radio'][name='select']:checked").value; //name
    const filtered = items.filter(e => { return e.name == name })
    loadModel(filtered[0]);
})
document.body.appendChild(arBtn);

controller = renderer.xr.getController(0);
controller.addEventListener("select", onSelect)

scene.add(controller);
window.addEventListener('resize', onWindowResize, false);
var text

fetch(`https://console.echoar.xyz/query?key=young-field-0597`).then(response => response.json()).then(obj => {
    console.log(obj)
    var things = obj.db;

    console.log(obj.db)
    var select = document.getElementById("select")
    for (let [key, value] of Object.entries(things)) {
        const name = value.additionalData.source

        items.push({
            url: `https://console.echoar.xyz/query?key=young-field-0597&file=${value.additionalData.glbHologramStorageID}`,
            name,
            text: value.additionalData.text
        })
        select.innerHTML += `<input type="radio" name="select" value="${name}" id="${name}"><label for="${name}">${name}</label>`
    }

})

window.camera = camera;
window.scene = scene
window.renderer = renderer

function loadModel(item) {
    var loader = new GLTFLoader();
    loader.load(item.url, function (gltf) {
        gltf.scene.children.forEach(e => { e.text = item.text }) //not recursive
        gltf.scene.children[0].scale.set(0.05, 0.05, 0.05)
        model = gltf
        text = item.text
        sessionStarted = true
        console.log(gltf)
        renderer.setAnimationLoop(render);
    })
}

function onSelect() {
    if (model.scene)
        scene.add(model.scene)
    else
        scene.add(model.scene)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
var display = false

var displayText = function (text) {
    document.getElementById("textWrapper").innerText = text;
    document.getElementById("textWrapper").style.display = 'block'
}

var hideText = function () {
    document.getElementById("textWrapper").style.display = 'none'
}

// Raycaster
var raycaster = new THREE.Raycaster();
// var oldObjects = new Set()
function raycast(position, direction) {
    raycaster.camera = camera
    raycaster.set(position, direction);
    // calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children, true);

    // oldObjects.forEach(function (obj) {
    //     obj.material.color.set(obj.oldColor);
    // })
    // oldObjects.clear()

    var displayedText = false;
    for (var i = 0; i < intersects.length; i++) {
        var obj = intersects[i].object;
        //https://threejs.org/docs/#manual/en/introduction/Creating-text
        if (typeof obj.material.color != 'undefined' && obj.material.color) {

            displayText(text);
            displayedText = true;

        }


    }

    if (!displayedText) {
        hideText()
    }
}

var runBefore = false

function render() {
    if (sessionStarted) {


        var xrCamera = renderer.xr.getCamera(camera)
        if (xrCamera.cameras[0]) {
            let e = xrCamera.cameras[0].matrixWorld.elements
            let direction = new THREE.Vector3(-e[8], -e[9], -e[10]).normalize()
            // console.log(direction)
            var position = new THREE.Vector3();
            var quaternion = new THREE.Quaternion();
            var scale = new THREE.Vector3();

            xrCamera.cameras[0].matrixWorld.decompose(position, quaternion, scale);

            raycast(position, direction)
            // console.log(position, quaternion)
        }
    }
    renderer.render(scene, camera);
}