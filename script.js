import * as THREE from "three";
import body from "./data";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.obj_body = body;

console.log('loaded')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, -5, 20 );
controls.update();


function start() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    let arcShape, holePath, geometry, material, mesh;

    //Draw the neck
    let neckWithHole = {
        amount : 2,
        steps : 1,
        bevelEnabled: false,
        curveSegments: 20,
        depth: body.neck.outer.height,
    };

    arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, body.neck.outer.radius(), 0, Math.PI * 2, 0, false);
    
    holePath = new THREE.Path();
    holePath.absarc(0, 0, body.neck.hole.radius(), 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);
    
    geometry = new THREE.ExtrudeGeometry(arcShape, neckWithHole);

    material = new THREE.MeshBasicMaterial( { 
        color: 0x00ff00,
        wireframe: true
     } );

    const neck = new THREE.Mesh( geometry, material ) ;

    neck.rotation.x = Math.PI / 2;

    neck.castShadow = true;

    //allow the neck to be affected by light
    neck.receiveShadow = true;

    //Draw the neck side hole

    var bodyWithNeckSideHole = {
        amount : 2,
        steps : 1,
        bevelEnabled: false,
        curveSegments: 20,
        depth: body.main.hole2.height
    }

    arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, body.main.outer.radius(), 0, Math.PI * 2, 0, false);

    holePath = new THREE.Path();
    holePath.absarc(0, 0, body.main.hole2.radius(), 0, Math.PI * 2, true);

    arcShape.holes.push(holePath);

    geometry = new THREE.ExtrudeGeometry(arcShape, bodyWithNeckSideHole);

    material = new THREE.MeshBasicMaterial( { 
        color: 0x2f69de,
        wireframe: true
    } );

    const bodyWithNeckSideHoleMesh = new THREE.Mesh( geometry, material ) ;

    bodyWithNeckSideHoleMesh.position.y = -(body.neck.outer.height);
    bodyWithNeckSideHoleMesh.rotation.x = Math.PI / 2;

    bodyWithNeckSideHoleMesh.castShadow = true;

    //Draw the solid middle section
    var bodySolid = {
        amount : 2,
        steps : 1,
        bevelEnabled: false,
        curveSegments: 20,
        depth: body.main.outer.height - body.main.hole1.height - body.main.hole2.height
    }

    arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, body.main.outer.radius(), 0, Math.PI * 2, 0, false);

    geometry = new THREE.ExtrudeGeometry(arcShape, bodySolid);

    material = new THREE.MeshBasicMaterial( { 
        color: 0xd82cde,
        wireframe: true
     } );

    const bodySolidMesh = new THREE.Mesh( geometry, material ) ;

    bodySolidMesh.position.y = -(body.neck.outer.height + body.main.hole2.height);
    bodySolidMesh.rotation.x = Math.PI / 2;

    bodySolidMesh.castShadow = true;
    bodySolidMesh.receiveShadow = true;

    //Draw the butt side hole
    var bodyWithButtSideHole = {
        amount : 2,
        steps : 1,
        bevelEnabled: false,
        curveSegments: 20,
        depth: body.main.hole1.height
    }

    arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, body.main.outer.radius(), 0, Math.PI * 2, 0, false);

    holePath = new THREE.Path();
    holePath.absarc(0, 0, body.main.hole1.radius(), 0, Math.PI * 2, true);

    arcShape.holes.push(holePath);

    geometry = new THREE.ExtrudeGeometry(arcShape, bodyWithButtSideHole);

    material = new THREE.MeshBasicMaterial( { 
        color: 0x2f69de,
        wireframe: true
     } );

    const bodyWithButtSideHoleMesh = new THREE.Mesh( geometry, material ) ;

    bodyWithButtSideHoleMesh.position.y = -(body.neck.outer.height + body.main.outer.height - body.main.hole1.height);
    bodyWithButtSideHoleMesh.rotation.x = Math.PI / 2;

    bodyWithButtSideHoleMesh.castShadow = true;
    bodyWithButtSideHoleMesh.receiveShadow = true;

    //Draw the butt
    var butt = {
        amount : 2,
        steps : 1,
        bevelEnabled: false,
        curveSegments: 20,
        depth: body.butt.outer.height
    }

    arcShape = new THREE.Shape();
    
    arcShape.absarc(0, 0, body.butt.outer.radius(), 0, Math.PI * 2, 0, false);

    holePath = new THREE.Path();
    holePath.absarc(0, 0, body.butt.hole.radius(), 0, Math.PI * 2, true);

    arcShape.holes.push(holePath);

    geometry = new THREE.ExtrudeGeometry(arcShape, butt);

    material = new THREE.MeshBasicMaterial( { 
        color: 0x00ff00,
        wireframe: true
     } );

    const buttMesh = new THREE.Mesh( geometry, material ) ;

    buttMesh.position.y = -(body.neck.outer.height + body.main.outer.height);
    buttMesh.rotation.x = Math.PI / 2;

    //set buttmesh to be affected by light
    buttMesh.castShadow = true;
    buttMesh.receiveShadow = true;

    //Add all the meshes to the scene
    scene.add(neck);
    scene.add(bodyWithNeckSideHoleMesh);
    scene.add(bodySolidMesh);
    scene.add(bodyWithButtSideHoleMesh);
    scene.add(buttMesh);

    //we're also going to make the axis lines
    const axesHelper = new THREE.AxesHelper( 5 );

    //make the axis at the bottom of the scene
    axesHelper.position.y = -(body.neck.outer.height + body.main.outer.height + body.butt.outer.height);

    scene.add( axesHelper );

    const light = new THREE.AmbientLight( 0x404040, 0.5 ); // soft white light
    scene.add( light );

}

const maxDistanceBetween = 4;

function animate() {
	requestAnimationFrame( animate );

    controls.update();

    const distanceBetweenPercentage = document.getElementById("distance-between-percentage").value / 100;

    const bodyWithNeckSideHoleMesh = scene.children[1];
    const bodySolidMesh = scene.children[2];
    const bodyWithButtSideHoleMesh = scene.children[3];
    const buttMesh = scene.children[4];
    const axisHelper = scene.children[5];

    const neckHeight = body.neck.outer.height;
    const bodyHeight = body.main.outer.height;
    const buttHeight = body.butt.outer.height;

    const bodyHoleButtSideHeight = body.main.hole1.height;
    const bodyHoleNeckSideHeight = body.main.hole2.height;

    bodyWithNeckSideHoleMesh.position.y = -(neckHeight) - (maxDistanceBetween * distanceBetweenPercentage);
    bodySolidMesh.position.y = -(neckHeight + bodyHoleNeckSideHeight) - (maxDistanceBetween * distanceBetweenPercentage) * 2;
    bodyWithButtSideHoleMesh.position.y = -(neckHeight + bodyHeight - bodyHoleButtSideHeight) - (maxDistanceBetween * distanceBetweenPercentage) * 3;
    buttMesh.position.y = -(neckHeight + bodyHeight) - (maxDistanceBetween * distanceBetweenPercentage) * 4;

    axisHelper.position.y = window.axisEnabled ? -(neckHeight + bodyHeight + buttHeight) - (maxDistanceBetween * distanceBetweenPercentage) * 4 : 100000;

	renderer.render( scene, camera );
}

window.axisEnabled = true;

let wireframeEnabled = true;

window.toggleWireframe = function toggleWireframe() {
    wireframeEnabled = !wireframeEnabled;

    const neck = scene.children[0];
    const bodyWithNeckSideHoleMesh = scene.children[1];
    const bodySolidMesh = scene.children[2];
    const bodyWithButtSideHoleMesh = scene.children[3];
    const buttMesh = scene.children[4];

    neck.material.wireframe = wireframeEnabled;
    bodyWithNeckSideHoleMesh.material.wireframe = wireframeEnabled;
    bodySolidMesh.material.wireframe = wireframeEnabled;
    bodyWithButtSideHoleMesh.material.wireframe = wireframeEnabled;
    buttMesh.material.wireframe = wireframeEnabled;
}



function cssAnimation() {
    const allElementsWithHiddenPanel = document.getElementsByClassName("extend-panel-anim");

    for (let i = 0; i < allElementsWithHiddenPanel.length; i++) {
        setTimeout(() => {
            allElementsWithHiddenPanel[0].classList.toggle("extend-panel-anim");
        }, 500 * i);
    }
}

cssAnimation();
start();
animate();
