import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'GLTFLoader'
import {AnimationMixer} from 'three'

let scene, camera, cameraPOV, renderer, controls
let geo, mat, mesh
let mixer, clips = [], clock
let currentAnimationIndex = 0
const loader = new GLTFLoader()

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

    document.body.appendChild(renderer.domElement)
}

let sky = () => {
    geo = new THREE.BoxGeometry(1500, 1500, 1500)

    const ft = new THREE.TextureLoader().load("./Assets/cloudy/bluecloud_ft.jpg")
    const bk = new THREE.TextureLoader().load("./Assets/cloudy/bluecloud_bk.jpg")
    const up = new THREE.TextureLoader().load("./Assets/cloudy/bluecloud_up.jpg")
    const dn = new THREE.TextureLoader().load("./Assets/cloudy/bluecloud_dn.jpg")
    const rt = new THREE.TextureLoader().load("./Assets/cloudy/bluecloud_rt.jpg")
    const lf = new THREE.TextureLoader().load("./Assets/cloudy/bluecloud_lf.jpg")

    const materials = [
        new THREE.MeshBasicMaterial({ map: rt, side: THREE.BackSide }), // right
        new THREE.MeshBasicMaterial({ map: lf, side: THREE.BackSide }), // left
        new THREE.MeshBasicMaterial({ map: up, side: THREE.BackSide }), // top
        new THREE.MeshBasicMaterial({ map: dn, side: THREE.BackSide }), // bottom
        new THREE.MeshBasicMaterial({ map: ft, side: THREE.BackSide }), // front
        new THREE.MeshBasicMaterial({ map: bk, side: THREE.BackSide })  // back
    ]
    mesh = new THREE.Mesh(geo, materials)
    scene.add(mesh)
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

const dragon = () => {
    loader.load("./Assets/dragon/scene.gltf", function(gltf){
        // console.log(gltf)
        const root = gltf.scene
        root.scale.set(80,80,80)
        // root.position.set(0,150,-400)
        // root.rotateY(-45)
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

let render = () => {
    requestAnimationFrame(render)
    controls.update()
    renderer.render(scene, camera)
}

let hemisLight = () => {
    const light = new THREE.HemisphereLight(0xFFFFFC, 0x080820, 2)
    scene.add(light)
    light.position.set(0,0,0)
    light.castShadow = true
}

let ambientLight = () => {
    const light = new THREE.AmbientLight(0xFFFFFC, 1)
    scene.add(light)
    light.position.set(0,0,0)
    light.castShadow = true
}

let spotLight = () => {
    const light = new THREE.SpotLight(0xFFFFFF, 10) //day
    scene.add(light)
    light.position.set(-80,40,0)
    light.castShadow = true
}

window.onload = () => {
    init();
    sky();
    castle();
    // dragon();

    hemisLight();
    ambientLight();
    spotLight();
    render();
}

// window.onrensize = () => {
//     let w = window.innerWidth
//     let h = window.innerHeight

//     renderer.setSize(w, h)
//     camera.aspect = w/h
//     camera.updateProjectionMatrix()
// }