import *  as  THREE from 'three';
import { ARPerspectiveCamera } from 'three.ar.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var container;
var camera, scene, renderer;
var controller;
var sessionStarted = false;
var model

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.set(0, 1.6, 0);

    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    var arBtn = ARButton.createButton(renderer);
    arBtn.addEventListener("click", function () {
        sessionStarted = true
    })
    document.body.appendChild(arBtn);
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect)

    scene.add(controller);
    window.addEventListener('resize', onWindowResize, false);
    renderer.setAnimationLoop(render);
    window.camera = camera;
    window.scene = scene
    window.renderer = renderer
    var loader = new GLTFLoader();


    function onSelect() {
        loader.load('https://console.echoar.xyz/query?key=steep-thunder-4720&file=6af76ce2-2f57-4ed0-82d8-42652f0eddbe.glb', function (gltf) {
            console.log(gltf)
            scene.add(gltf.scene)
        });
    }


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

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
            // console.log(position, quaternion)
        }
    }
    renderer.render(scene, camera);
}

//here is the code
var displayText = function (text) {
    text2.style.position = 'absolute'
    text2.style.width = 100
    text2.style.height = 100
    text2.style.color = 'white'
    text2.innerHTML = text;
    text2.style.top = 200 + 'px'
    text2.style.left = 200 + 'px'
    text2.style.display = 'block'
}

var hideText = function () {
    text2.style.display = 'none'
}

init();