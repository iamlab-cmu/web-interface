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

let joint_names = [
  "panda_joint1",
  "panda_joint2",
  "panda_joint3",
  "panda_joint4",
  "panda_joint5",
  "panda_joint6",
  "panda_joint7",
  "panda_joint8",
  "panda_hand_joint",
  "panda_finger_joint1",
  "panda_finger_joint2"
]

let canvas,scene, camera, renderer, robot, controls, cubeGeo, cubeMaterial,traj;
let traj_step = 0;
let follow_traj = false;
let joints_array = [];


var ros = new ROSLIB.Ros({url : 'ws://iam-wanda.ri.cmu.edu:9090'});
var robot_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/robot_state_publisher_node_1/robot_state',
    messageType : 'franka_interface_msgs/RobotState'
});


         
canvas = document.getElementById(document.currentScript.getAttribute('id')+"_canvas");
init();
render();

function init() {

    scene = new Scene();
    scene.background = new Color(0x263238);

    camera = new PerspectiveCamera();
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);

    renderer = new WebGLRenderer({canvas: canvas, antialias: true });
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    //document.body.appendChild(renderer.domElement);

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

    //Need to access these variables here otherwise won't scope properly
    var traj_txt = document.currentScript.getAttribute('traj');
    var id = document.currentScript.getAttribute('id');

    // Load robot
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    loader.load('../../urdf/franka/urdf/franka.urdf', result => {

        robot = result;

    });

    // wait until all the geometry has loaded to add the model to the scene
    manager.onLoad = () => {

        robot.rotation.x = -Math.PI / 2;
        robot.traverse(c => {
            c.castShadow = true;
        });

        robot_listener.subscribe(function(m) {
            joints_array = m.q
        });

        if (traj_txt == "true"){
            follow_traj = true;
            if (id == 'robot_1') {traj = viz_data.traj1};
            if (id == 'robot_2') {traj = viz_data.traj2};
        }

        for (let i = 10; i <= 16; i++) {
            const voxel = new Mesh( cubeGeo, cubeMaterial );
            voxel.position.set(i*0.02,0.01,0.01);
            scene.add(voxel);
        }
        
        //updateJoints();
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
    let width = 400;
    let height = 400;//canvas.getAttribute('height');
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}


function updateJointsLive(){
    for (let i = 0; i < joints_array.length; i++) {
        robot.joints[joint_names[i]].setJointValue(joints_array[i]);
    }
}

function followTraj(){
    for (let i = 0; i < traj.joint_names.length; i++) {
        robot.joints[traj.joint_names[i]].setJointValue(traj.points[traj_step].positions[i]);
    }

    traj_step++;
    if (traj_step >= traj.points.length) traj_step = 0;
}

function render() {

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    if (follow_traj) followTraj()
    else updateJointsLive(joints_array);
    
}
