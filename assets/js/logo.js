var host = 'https://unpkg.com/three@0.120.1';
import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js';
import { LineMaterial } from 'https://unpkg.com/three@0.120.1/examples/jsm/lines/LineMaterial.js';
import { Wireframe } from 'https://unpkg.com/three@0.120.1/examples/jsm/lines/Wireframe.js';
import { WireframeGeometry2 } from 'https://unpkg.com/three@0.120.1/examples/jsm/lines/WireframeGeometry2.js';

var container, camera, scene, scene2, scene3, controls, pointLight;
var composer, renderer;

var glitchPass;

init();
animate();

function init() {

	container = document.getElementById("logo");
	var height = container.clientHeight;
	var width = container.clientWidth;

	camera = new THREE.PerspectiveCamera( 20, container.clientWidth / container.clientHeight, 1, 1000 );
	camera.position.set( 150, 100, 150 );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	scene = new THREE.Scene();	
	
	scene2 = new THREE.Scene();
	scene3 = new THREE.Scene();

	var matLine = new LineMaterial( {
		color: 0xffffff,
		linewidth: 0.02,
		dashed: false

	} );
	var matDashed = new THREE.LineDashedMaterial( {
		color: 0xffffff,
		scale: 2,
		dashSize: 2, 
		gapSize: 3,
		transparent: true,
		opacity: 0.35
	} );
	var matMesh = new THREE.MeshBasicMaterial( {
		color: 0x444444
	} )

	var manager = new THREE.LoadingManager();

	manager.onLoad = function ( ) {
		console.log( 'Loading complete!');
		$('#logo').addClass('ready');

	};
	
	var loader = new GLTFLoader(manager);
	loader.load('assets/models/logo.glb', function( gltf ) {

		var object = gltf.scene.children[0];

		object.traverse( function ( child )	{
			if ( child instanceof THREE.Mesh )	{
				child.castShadow = true;

				var edges = new THREE.EdgesGeometry( child.geometry );
				var line = new Wireframe( new WireframeGeometry2(child.geometry), matLine );
				scene.add( line );

				var mesh = new THREE.Mesh( child.geometry, matMesh );
				scene2.add( mesh );

				var dashedLine = new THREE.LineSegments( edges, matDashed );
				dashedLine.computeLineDistances();
				scene3.add( dashedLine );
			}
		} );

		var allEdges = new THREE.EdgesGeometry( object.geometry );
		const matEdge = new THREE.LineBasicMaterial({color: 0xffffff});
		const meshEdge = new THREE.LineSegments(allEdges, matEdge);
		scene2.add( meshEdge );

	});
	
	
	
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize(width, height);
	
	renderer.autoClear = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor( 0x222222, 0);


	// postprocessing

	//
	
	container.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, container );

	controls.autoRotate = true;
	controls.autoRotateSpeed = 4.0;
	
	controls.enableZoom = false;
	controls.enablePan = false;
	
	window.addEventListener( 'resize', resize, false );

}

function resize() {

	var dimensions = container.getBoundingClientRect();
	renderer.setSize( dimensions.width, dimensions.height );
	camera.aspect = dimensions.width / dimensions.height;
	camera.updateProjectionMatrix();

}

function animate() {

	var dimensions = container.getBoundingClientRect();
	renderer.setSize( dimensions.width, dimensions.height );
					 
	camera.aspect = dimensions.width / dimensions.height;
	camera.updateProjectionMatrix();
	
	controls.update();
	if (container.parentNode == document.getElementById("menuHome")) {
		controls.enableRotate = false; 
		if ($('#menuHome.hover').length) {
			controls.autoRotateSpeed = 54.0;
		}
		else { controls.autoRotateSpeed = 4.0; }
	
	}	
	else { controls.enableRotate = true; controls.autoRotateSpeed = 4.0; }
	
	renderer.clear();
	renderer.render( scene, camera );
	renderer.clearDepth();
	renderer.render( scene2, camera );
	renderer.clearDepth();
	renderer.render( scene3, camera );
	

	
	requestAnimationFrame( animate );
	
}