import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'GLTFLoader'
import {AnimationMixer} from 'three'

let scene, camera, cameraPOV, renderer, controls
let geo, mat, mesh
let mixer, clips = []
let currentAnimationIndex = 0
const loader = new GLTFLoader()
const clock = new THREE.Clock();

let init = () => {
    scene = new THREE.Scene()

    let fov = 75
    let w = window.innerWidth
    let h = window.innerHeight
    let aspect = w/h

    camera = new THREE.PerspectiveCamera(fov, aspect)
    camera.position.set(0, 30, 130) //x, y, z
    camera.lookAt(0,0,0)

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(w,h)
    renderer.setClearColor('black')
    renderer.shadowMap.enabled = true

    controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true

    document.body.appendChild(renderer.domElement)
}

var skybox = () => {
    var skyboxGeo = new THREE.BoxGeometry(1000,1000,1000);

    var textureLoader = new THREE.TextureLoader();

    var skyboxMaterials = [
        new THREE.MeshBasicMaterial ({
            map: textureLoader.load('./Assets/skybox/nightsky_rt.png'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial ({
            map: textureLoader.load('./Assets/skybox/nightsky_lf.png'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial ({
            map: textureLoader.load('./Assets/skybox/nightsky_up.png'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial ({
            map: textureLoader.load('./Assets/skybox/nightsky_dn.png'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial ({
            map: textureLoader.load('./Assets/skybox/nightsky_ft.png'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial ({
            map: textureLoader.load('./Assets/skybox/nightsky_bk.png'),
            side: THREE.BackSide
        }),
    ]

    var skyboxMesh = new THREE.Mesh(skyboxGeo,skyboxMaterials)
    skyboxMesh.position.set(0,0,0);

    scene.add(skyboxMesh)
}

const castle = () => {
    loader.load("./Assets/floating_island_mine_house.glb", function(gltf){
        // console.log(gltf)
        const root = gltf.scene
        root.scale.set(100,100,100)
        root.position.set(0,0,0)
        root.castShadow = true
        root.receiveShadow = true
        root.traverse(function(child){
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        });
        scene.add(root)
    });
}

const cloudRing = () => {
    loader.load("./Assets/cloud_ring/scene.gltf", function(gltf){
        // console.log(gltf)
        const root = gltf.scene
        root.scale.set(50,50,50)
        root.position.set(0,-50,0)
        scene.add(root)
    });
}

const cloud = () => {
    loader.load("./Assets/cloud/scene.gltf", function(gltf){
        // console.log(gltf)
        const root = gltf.scene
        root.scale.set(5,5,5)
        root.position.set(30,60,0)
        scene.add(root)
    });
}

const cloud2 = () => {
    loader.load("./Assets/cloud/scene.gltf", function(gltf){
        // console.log(gltf)
        const root = gltf.scene
        root.scale.set(8,5,5)
        root.position.set(-90,80,20)
        scene.add(root)
    });
}

var models = () => {
    loader.load(
        './Assets/snow-dragon/source/dragon_white_low_poly/scene.gltf',
    (object)=> {
        let model = object.scene
        model.scale.set(20,20,20)

        mixer = new THREE.AnimationMixer(model);

        const action = mixer.clipAction(object.animations[3]);
        action.play();
        model.position.set(30,0,0);

        scene.add(model)
    }
    )
}

let render = () => {
    if(mixer){
        mixer.update(clock.getDelta())
    }
    requestAnimationFrame(render)
    controls.update()
    renderer.render(scene, camera)
}

let hemisLight = () => {
    const light = new THREE.HemisphereLight(0x00468B, 0x080820, 1)
    scene.add(light)
    light.position.set(0,0,0)
    light.castShadow = true
}

let ambientLight = () => {
    const light = new THREE.AmbientLight(0x00008B, 1)
    scene.add(light)
    light.position.set(0,0,0)
    light.castShadow = true
}

let spotLight = () => {
    const light = new THREE.SpotLight(0xFFFFFC, 3)
    scene.add(light)
    light.position.set(100, 100, 300)
    const helper = new THREE.SpotLightHelper(light, 1)
    // scene.add(helper)
    light.castShadow = true
}

window.onload = () => {
    init();
    skybox();
    castle();
    models();

    cloudRing();
    // cloud();
    // cloud2();

    hemisLight();
    ambientLight();
    spotLight();
    render();
}

window.onresize = () => {
    let w = window.innerWidth
    let h = window.innerHeight

    renderer.setSize(w, h)
    camera.aspect = w/h
    camera.updateProjectionMatrix()
}