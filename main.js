import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';
// import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

console.log('aaa')

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);//シーンを作る

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0,3,0);//カメラを作る

const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);//レンダラー(プロジェクターとスクリーン)

renderer.shadowMap.enabled = true; //影をつける

//床の作成
const floor_geometry = new THREE.PlaneGeometry(2, 2);
const floor_material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1,
  metalness: 0
});
const plate = new THREE.Mesh(floor_geometry, floor_material);
plate.rotation.x = -Math.PI / 2;
plate.position.y = 0.03; // ← これが“段差”
scene.add(plate);

//床に影を落す
plate.receiveShadow = true;
scene.add(plate);

//クロスヘアを設置
const size = 0.02;  // crosshair の長さを調整
const crossfair_material = new THREE.LineBasicMaterial({ color: 0xffffff });

const crosshairGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -size,  0, -1,   size,  0, -1,   // 横線
   0, -size, -1,   0,  size, -1    // 縦線
]);
crosshairGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 2. LineSegments で十字を描く
const crosshair = new THREE.LineSegments(crosshairGeometry, crossfair_material);

// 3. カメラに add して、シーンにも camera を add
camera.add(crosshair);

// ---------- GLB の読み込み ----------
const loader = new GLTFLoader()

const glbPath1 = "./model/table.glb"

//tableのオブジェクトを読み込み
  loader.load(
  glbPath1,
  function (gltf) {
    const model1 = gltf.scene; //<-ここの変数を増やす
    
    // モデルのサイズや位置を調整
    model1.scale.set(0.5, 0.5, 0.5); //モデルの大きさを調整
    model1.rotation.set(0, Math.PI / 2, 0); // モデルの回転を調整
    model1.position.set(0, 0.1, 0);//モデルの位置を調整
    model1.receiveShadow = true;
    
   
    scene.add(model1);
    console.log("モデル1が正常に読み込まれました。");
  })

//環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 色、強度
  scene.add(ambientLight);

// カメラをマウスで操作できるようにする
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

document.addEventListener("click", () =>{
  controls.lock()
})

// キーボードのキーが押されたかチェックする
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// 動く方向と速さのデータ
const direction = new THREE.Vector3();
const velocity = new THREE.Vector3();

// 毎フレーム（60回/秒）動かす関数
function animate() {
 requestAnimationFrame(animate);

 if (controls.isLocked) {
  direction.set(0, 0, 0); // 方向を初期化

 // 押されたキーに応じて方向を設定
 if (keys['KeyS']) direction.z -= 1;
 if (keys['KeyW']) direction.z += 1;
 if (keys['KeyA']) direction.x -= 1;
 if (keys['KeyD']) direction.x += 1;

 direction.normalize(); // 斜めでも速さを一定に

 velocity.copy(direction).multiplyScalar(0.1); // 移動の速さを調整

 // 実際にカメラを動かす
 controls.moveRight(velocity.x);
 controls.moveForward(velocity.z);
 }

  renderer.render(scene, camera);

}

// function animate(){
//     requestAnimationFrame(animate)
//     renderer.render(scene, camera)
// }

animate()

// ---------- リサイズ対応 ----------
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});