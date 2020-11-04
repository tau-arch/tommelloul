import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js';
import { SubdivisionModifier } from 'https://unpkg.com/three@0.120.1/examples/jsm/modifiers/SubdivisionModifier.js';


const container = document.getElementById("logo");

var camera, scene, controls, clock;
var raycaster, mouse, innerWidth, innerHeight;

var modelMesh, positions, plane;
var composer, renderer;

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
var loaderTexture = new THREE.TextureLoader();


var subdivisions = 1;

const s = {
	vs: `
      #define NUM_OCTAVES 8

      uniform vec3 mouse;
      uniform float time;
	  uniform float viewport;

      varying vec2 vUv;
      varying vec3 vPosition;

      //	Simplex 4D Noise 
      //	by Ian McEwan, Ashima Arts
      //
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

      vec4 grad4(float j, vec4 ip){
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;

        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

        return p;
      }

      float snoise(vec4 v){
        const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                              0.309016994374947451); // (sqrt(5) - 1)/4   F4
      // First corner
        vec4 i  = floor(v + dot(v, C.yyyy) );
        vec4 x0 = v -   i + dot(i, C.xxxx);

      // Other corners

      // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
        vec4 i0;

        vec3 isX = step( x0.yzw, x0.xxx );
        vec3 isYZ = step( x0.zww, x0.yyz );
      //  i0.x = dot( isX, vec3( 1.0 ) );
        i0.x = isX.x + isX.y + isX.z;
        i0.yzw = 1.0 - isX;

      //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
        i0.y += isYZ.x + isYZ.y;
        i0.zw += 1.0 - isYZ.xy;

        i0.z += isYZ.z;
        i0.w += 1.0 - isYZ.z;

        // i0 now contains the unique values 0,1,2,3 in each channel
        vec4 i3 = clamp( i0, 0.0, 1.0 );
        vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
        vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

        //  x0 = x0 - 0.0 + 0.0 * C 
        vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
        vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
        vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
        vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

      // Permutations
        i = mod(i, 289.0); 
        float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
        vec4 j1 = permute( permute( permute( permute (
                   i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                 + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                 + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                 + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
      // Gradients
      // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
      // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

        vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

        vec4 p0 = grad4(j0,   ip);
        vec4 p1 = grad4(j1.x, ip);
        vec4 p2 = grad4(j1.y, ip);
        vec4 p3 = grad4(j1.z, ip);
        vec4 p4 = grad4(j1.w, ip);

      // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        p4 *= taylorInvSqrt(dot(p4,p4));

      // Mix contributions from the five corners
        vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
        vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
        m0 = m0 * m0;
        m1 = m1 * m1;
        return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                     + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

      }

      void main(){
        vec3 newpos = position;
        vec3 dir = newpos - mouse;
        float dist = length(dir);
        float radius = 5.;

        vec3 noisepos;

        noisepos.x = 5.0 * snoise(vec4(position * 5.0, time * 0.5));
        noisepos.y = snoise(vec4(position, time));    
        noisepos.z = 5.0 * snoise(vec4(position * 5.0, time * 0.5));

        float ratio = 1. - clamp(dist / radius, 0.0, 1.0);

        vec3 pos = dir * ratio * noisepos * 1.5;
          
        newpos.y += pos.y * 0.2;
        newpos.xz += pos.xz;

        vec4 mvPosition = modelViewMatrix * vec4(newpos, 1.0);
        gl_PointSize = 110. * (1. / - mvPosition.z) * viewport * 0.001;
        gl_Position = projectionMatrix * mvPosition;

        vPosition = position;
        vUv = uv;
      }
`,
	fs: `
      varying vec2 vUv;
      varying vec3 vPosition;
	  uniform float viewport;
	  uniform float mobVal;
	  uniform vec3 meshColor;
	  uniform sampler2D pointTexture;

      void main(){ 
        vec2 uv = vUv;
        
        if (length(gl_PointCoord.xy - vec2(0.5)) > 0.5) discard;

        vec3 normal = normalize(vPosition);
        vec3 light = normalize(vec3(0.0, 0.5, -1.0));

        float diff = max(dot(normal, light), 0.0) * 2.0 * viewport * 0.0000001;

        vec3 color = meshColor / 255.;

		vec4 tex = texture2D ( pointTexture, gl_PointCoord );
        gl_FragColor = vec4(0.50,0.50,0.50, tex.a * 2.3);
		//gl_FragColor = vec4(220,220,220, 1.0);
		//gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      }
`
};
const uniforms = {
				time: {
					type: "f",
					value: 0
				},
				resolution: {
					type: "v2",
					value: new THREE.Vector2(innerWidth, innerHeight)
				},
				mouse: {
					type: "v3",
					value: new THREE.Vector3(0, 0, 0)
				},
				viewport: {
					value: window.innerHeight * window.devicePixelRatio
				},
				pointTexture: {
					value: new THREE.TextureLoader().load( "assets/textures/spark1.png" )
				},
				meshColor: {
					value: new THREE.Vector3(255,255,255)
				}
			};

init();
animate();

function init() {

	mouse = new THREE.Vector3();
	raycaster = new THREE.Raycaster();
	plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	

	var innerHeight = container.innerHeight;
	var innerWidth = container.innerWidth;

	camera = new THREE.PerspectiveCamera( 18, innerWidth / innerHeight, 0.1, 1000 );
	camera.position.set( 0, 10, 50 );
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	
	controls = new OrbitControls( camera, container );

	controls.autoRotate = true;
	controls.autoRotateSpeed = 4.0;
	
	controls.enableZoom = false;
	controls.enablePan = false;
	controls.maxPolarAngle = Math.PI * 0.8;
	controls.minPolarAngle = Math.PI * 0.2;
	

	scene = new THREE.Scene();	
	clock = new THREE.Clock();

	var modifier = new SubdivisionModifier(subdivisions, true);
	

	manager.onLoad = function ( ) {

		console.log( 'Loading complete!');
		$('#logo').addClass('ready');
		
	};


	manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

		console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

	};

	manager.onError = function ( url ) {

		console.log( 'There was an error loading ' + url );

	};
	
	loader.load('assets/models/logo-final.glb', function( gltf ) {

		var object = gltf.scene.children[0];

		object.traverse( function ( child )	{
			if ( child instanceof THREE.Mesh )	{
				var childGeo = modifier.modify(new THREE.Geometry().fromBufferGeometry( child.geometry ));
				//var childBuffGeo = modifier.modify( childGeo );
				var childBuffGeo = new THREE.BufferGeometry().fromGeometry( childGeo );	//child.castShadow = true;					
				child.geometry = childBuffGeo;
			}
		} );

	
		positions = combineBuffer(gltf, "position");

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", positions);
		
		var material;
		const texture = new THREE.TextureLoader().load( "assets/textures/spark1.png" );

		if ($isMobile) {
			material = new THREE.PointsMaterial( {
				color: 0x555555,
				size: 0.25,
				transparent: true,
				sizeAttenuation: true,
				alphaTest: 0.1
			});
		}
		else {
			material = new THREE.ShaderMaterial({
				extensions: {
					derivatives: "#extension GL_OES_standard_derivatives : enable"
				},

				uniforms: uniforms,
				vertexShader: s.vs,
				fragmentShader: s.fs
			});
			geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
		}

		geo.computeBoundingBox();
		geo.rotateX(-Math.PI * 0.5);
		
		modelMesh = new THREE.Points(geo, material);
		modelMesh.position.set(0, -554.8, 0);
		scene.add(modelMesh);

		plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

		endAnimation();
		animate();
		addLight();

	});
	
	
	
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize(innerWidth, innerHeight);
	
	renderer.autoClear = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( innerWidth, innerHeight );
	renderer.setClearColor( 0x222222, 0);

	
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', resize, false );
	
}

function endAnimation() {
	controls.addEventListener("end", () => {
		plane.normal.copy(camera.position);
		plane.normal.y = 0;
		plane.normal.y = 0;
		plane.normal.normalize();
	});
}

function combineBuffer(model, bufferName) {
	let count = 0;

	model.scene.traverse(child => {
		if (child.isMesh) {
			const buffer = child.geometry.attributes[bufferName];

			count += buffer.array.length;
		}
	});

	const combined = new Float32Array(count);

	let offset = 0;

	model.scene.traverse(child => {
		if (child.isMesh) {
			const buffer = child.geometry.attributes[bufferName];
			combined.set(buffer.array, offset);
			offset += buffer.array.length;
		}
	});

	return new THREE.BufferAttribute(combined, 3);
}

function resize() {

	var dimensions = container.getBoundingClientRect();
	renderer.setSize( dimensions.width, dimensions.height );
	camera.aspect = dimensions.width / dimensions.height;
	camera.updateProjectionMatrix();

}

function animate() {

	const time = clock.getElapsedTime() * 0.5;
	uniforms.time.value = time;
	
	var dimensions = container.getBoundingClientRect();
	renderer.setSize( dimensions.width, dimensions.height );
					 
	camera.aspect = dimensions.width / dimensions.height;
	camera.updateProjectionMatrix();
	
	controls.update();
	
	if (container.parentNode == document.getElementById("menuHome")) {
		mouse.x = innerWidth + 1;
		mouse.y = innerHeight + 1;
		raycaster.setFromCamera(mouse, camera);

		raycaster.ray.intersectPlane(plane, uniforms.mouse.value);
		modelMesh.worldToLocal(uniforms.mouse.value);

		const intersect = raycaster.intersectObjects(scene.children);
		controls.enableRotate = false;
		
		if ($('#menuHome.hover').length) {
			controls.autoRotateSpeed = 30.0;
		} else {
			controls.autoRotateSpeed = 4.0;
		}

	} else {
		controls.enableRotate = true;
		controls.autoRotateSpeed = 4.0;
	}
	
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
	
}

function addLight() {
	const ambientLight = new THREE.HemisphereLight(
		0xddeeff, // sky color
		0x202020, // ground color
		5 // intensity
	);

	scene.add(ambientLight);

	const mainLight = new THREE.DirectionalLight(0xffffff, 3);
	mainLight.position.set(10, -565, 10);

	scene.add(mainLight);
}

function onMousemove(ev) {
	if (!$(container).hasClass('ready')) { return; }
	if (container.parentNode == document.getElementById("menuHome")) {
		mouse.x = innerWidth + 1;
		mouse.y = innerHeight + 1;
		raycaster.setFromCamera(mouse, camera);

		raycaster.ray.intersectPlane(plane, uniforms.mouse.value);
		modelMesh.worldToLocal(uniforms.mouse.value);

		const intersect = raycaster.intersectObjects(scene.children);
	}
	else {
		mouse.x = ev.clientX / window.innerWidth * 2 - 1;
		mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);

		raycaster.ray.intersectPlane(plane, uniforms.mouse.value);
		modelMesh.worldToLocal(uniforms.mouse.value);

		const intersect = raycaster.intersectObjects(scene.children);
	}
}

window.addEventListener("mousemove", ev => onMousemove(ev));
