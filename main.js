//インポートから始まるのは全部ここ
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

console.log('aaa')

//シーンを作る
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xadadad);

//カメラを作る
const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0,2.3,0);

//レンダラー(プロジェクターとスクリーン)
const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//レンダラーを整える
renderer.outputColorSpace = THREE.SRGBColorSpace;  // three r152+ の場合
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.physicallyCorrectLights = true;          // 物理ベースライティング


 //影をつける
renderer.shadowMap.enabled = true; 

//床の作成
const floor_geometry = new THREE.PlaneGeometry(20, 20);
const floor_material = new THREE.MeshStandardMaterial({
  color: 0x7d7d7d,
  roughness: 1,
  metalness: 0
});
const plate = new THREE.Mesh(floor_geometry, floor_material);
plate.rotation.x = -Math.PI / 2;
plate.position.y = 0.04; // ← これが“段差”
scene.add(plate);

//床に影を落す
plate.receiveShadow = true;
scene.add(plate);

//クロスヘア

 //1.クロスヘアを設置
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

const glbPath1 = "./models/table.glb"
const glbPath2 = "./models/yuutu.glb"
const glbPath3 = "./models/puranetes.glb"
const glbPath4 = "./models/setuna.glb" 

//tableのオブジェクトを読み込み
  loader.load(
  glbPath1,
  function (gltf) {
    const model1 = gltf.scene; //<-ここの変数を増やす
    
    // モデルのサイズや位置を調整
    model1.scale.set(0.7, 0.7, 0.7); //モデルの大きさを調整
    model1.rotation.set(0, Math.PI / 2, 0); // モデルの回転を調整
    model1.position.set(0, -0.4, 0);//モデルの位置を調整
    model1.receiveShadow = true;//影を付ける
    
   
    scene.add(model1);
    console.log("モデル1が正常に読み込まれました。");
  })

  //メアリー・スーの憂鬱のオブジェクトを読み込み
  loader.load(
    glbPath2,
    function (gltf) {
      const model2 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model2.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model2.rotation.set(Math.PI,0, Math.PI); // モデルの回転を調整
      model2.position.set(0, 1.8,4.7);//モデルの位置を調整
      model2.receiveShadow = true;//影を付ける
    
   
      scene.add(model2);
      console.log("モデル2が正常に読み込まれました。");
    })

     //プラネテスのオブジェクトを読み込み
  loader.load(
    glbPath3,
    function (gltf) {
      const model3 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model3.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model3.rotation.set(Math.PI,-Math.PI/1.7, Math.PI); // モデルの回転を調整
      model3.position.set(-2.92, 1.8,2.8);//モデルの位置を調整
      model3.receiveShadow = true;//影を付ける
    
   
      scene.add(model3);
      console.log("モデル3が正常に読み込まれました。");
    })

    //陽だまりのセツナのオブジェクトを読み込み
  loader.load(
    glbPath3,
    function (gltf) {
      const model4 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model4.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model4.rotation.set(Math.PI,Math.PI/1.7, Math.PI); // モデルの回転を調整
      model4.position.set(2.92, 1.8,2.8);//モデルの位置を調整
      model4.receiveShadow = true;//影を付ける
    
   
      scene.add(model4);
      console.log("モデル4が正常に読み込まれました。");
    })

//光  

  //環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 色、強度
  scene.add(ambientLight);

  //ライトの調整
  const sun = new THREE.DirectionalLight(0xffffff, 3.0);
sun.position.set(5, 10, 7.5);
scene.add(sun);

const fill = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
scene.add(fill);

  // 点光源を作成

  // スポットライト光源を作成
// new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
const light1 = new THREE.SpotLight(0Xffe9b3, 80, 2, Math.PI, 4, 0.5);
scene.add(light1);
light1.position.set(0, 3, 4.8);
light1.castShadow = true;

const light2 = new THREE.SpotLight(0Xffe9b3, 80, 2, Math.PI, 4, 0.5);
scene.add(light2);
light2.position.set(-3.1, 3, 2.8);
light2.castShadow = true;

const light3 = new THREE.SpotLight(0Xffe9b3, 80, 2, Math.PI, 4, 0.5);
scene.add(light3);
light3.position.set(3.1, 3, 2.8);
light3.castShadow = true;

//fps設定

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

 velocity.copy(direction).multiplyScalar(0.04); // 移動の速さを調整

 // 実際にカメラを動かす
 controls.moveRight(velocity.x);
 controls.moveForward(velocity.z);
 }

  renderer.render(scene, camera);

}



animate()

// ---------- リサイズ対応 ----------
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});