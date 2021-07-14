import {
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial,
    Scene,
    Mesh,
    PlaneBufferGeometry,
    GridHelper,
    ShadowMaterial,
    DirectionalLight,
    PCFSoftShadowMap,
    sRGBEncoding,
    Color,
    AmbientLight,
    Box3,
    Vector3,
    LoadingManager,
    MathUtils,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import URDFLoader from '../../src/URDFLoader.js';

let scene, camera, renderer, robot, controls, cubeGeo, cubeMaterial;

console.log("Start");
init();
render();

function init() {
    scene = new Scene();
    scene.background = new Color(0x263238);

    camera = new PerspectiveCamera();
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);

    renderer = new WebGLRenderer({ antialias: true });
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const directionalLight = new DirectionalLight(0xffffff, 1.0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar(1024);
    directionalLight.position.set(5, 30, 5);
    scene.add(directionalLight);

    const ambientLight = new AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const ground = new Mesh(new PlaneBufferGeometry(), new ShadowMaterial({ opacity: 0.25 }));
    ground.rotation.x = -Math.PI / 2;
    ground.scale.setScalar(30);
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new GridHelper( 2, 100 );
    scene.add(gridHelper);

    cubeGeo = new BoxGeometry( 0.02, 0.02, 0.02 );
    cubeMaterial = new MeshBasicMaterial( { color: 0xffffff } );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.5;
    controls.target.y = 0.7;
    controls.update();

    // Load robot
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    console.log("sending command for file");
    loader.load('../../urdf/franka/urdf/franka.urdf', result => {

        robot = result;

    });

    // wait until all the geometry has loaded to add the model to the scene
    manager.onLoad = () => {

        robot.rotation.x = -Math.PI / 2;
        robot.traverse(c => {
            c.castShadow = true;
        });

        for (let i = 10; i <= 16; i++) {
            const voxel = new Mesh( cubeGeo, cubeMaterial );
            voxel.position.set(i*0.02,0.01,0.01);
            scene.add(voxel);
        }
        // for (let i = 1; i <= 6; i++) {

        //     robot.joints[`HP${ i }`].setJointValue(MathUtils.degToRad(30));
        //     robot.joints[`KP${ i }`].setJointValue(MathUtils.degToRad(120));
        //     robot.joints[`AP${ i }`].setJointValue(MathUtils.degToRad(-60));

        // }
        console.log(Object.keys(robot.joints))
        robot.updateMatrixWorld(true);

        const bb = new Box3();
        bb.setFromObject(robot);

        robot.position.y -= bb.min.y;
        scene.add(robot);

    };

    onResize();
    window.addEventListener('resize', onResize);

}

function onResize() {
    let width = document.currentScript.getAttribute('width');
    let height = document.currentScript.getAttribute('height');
    console.log(width)
    console.log(width)
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function render() {

    requestAnimationFrame(render);
    renderer.render(scene, camera);

}
