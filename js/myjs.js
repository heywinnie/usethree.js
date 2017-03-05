/**
 * Created by john on 2017/3/1.
 */

var requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
    || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var id = null;
var ballMesh = null;
var ballMesh1 = null;
var v = 0;
var a = -0.01;
var b = 0.05;
var c = 1;
var isMoving = false;
var isMoving1 = false;
var h = 5;
var w = 2;
var ballRadius = 0.2;
var stat = null;
var scene = null;
var camera = null;
var renderer =  null;

function init() {
    stat = new Stats();
    stat.domElement.style.position = "absolute";
    stat.domElement.style.right = "0px";
    stat.domElement.style.top = "0px";
    document.body.appendChild(stat.domElement);

    //Three.js init

    //renderer
    //Three.js生成Canvas元素
    // var renderer = new THREE.WebGLRenderer();
    // renderer.setSize (400,300);
    // document.getElementsByTagName("body")[0].appendChild(renderer.domElement);
    //手动定义Canvas元素
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("mainCanvas"),
        antialias: true,precision: "highp"
        //  开启消除锯齿,默认false,渲染精度  highp/mediump/lowp
    });
    renderer.setClearColor(0x555555);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    //scene
    scene = new  THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45,500/300,1,10);
    camera.position.set(4,3,-5);//(4,3,-5)
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera);

    //material
    var texture = THREE.ImageUtils.loadTexture('img/wood.jpg', {} , function () {
        renderer.render(scene,camera);
    });


    // new THREE.MeshPhongMaterial({color:0xcecece,shininess:1000})
    //a cube in the scene
    var cube = new THREE.Mesh(new THREE.CubeGeometry(1,1,3),new THREE.MeshPhongMaterial({map:texture}));
    var cube1 = new THREE.Mesh(new THREE.CubeGeometry(1,0.1,3), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    var column1 = new THREE.Mesh(new THREE.CubeGeometry(0.05,1,0.05), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    var column2 = new THREE.Mesh(new THREE.CubeGeometry(0.05,1,0.05), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    var circle1 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 12, 30), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    var circle2 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 12, 30), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    var circle3 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 12, 30), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    var circle4 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 12, 30), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    ballMesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius,20,20), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));
    ballMesh1 = new THREE.Mesh(new THREE.SphereGeometry(0.3,20,20), new THREE.MeshPhongMaterial({color: 0xf3f173,shininess:1000}));

    circle1.rotation.y = Math.PI/2;
    circle1.position.set(0.6,-0.5,1);
    circle2.rotation.y = Math.PI/2;
    circle2.position.set(-0.6,-0.5,1);
    circle3.rotation.y = Math.PI/2;
    circle3.position.set(0.6,-0.5,-1);
    circle4.rotation.y = Math.PI/2;
    circle4.position.set(-0.6,-0.5,-1);
    cube1.position.set(0,1.5,0);
    column1.position.set(0,1,1.2);
    column2.position.set(0,1,-1.2);
    ballMesh1.position.set(0,-0.6,-2);
    ballMesh1.position.x = 2;
    ballMesh.position.set(2,0,0);
    ballMesh.position.y = -0.7;

    //plane
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(6,6), new THREE.MeshLambertMaterial({color: 0x809aeb}));
    plane.rotation.x = -1.57;
    plane.position.set(0,-0.9,0);

    plane.receiveShadow = true;
    cube.castShadow = true;
    cube.receiveShadow = true;
    circle1.castShadow = true;
    circle3.castShadow = true;
    cube1.castShadow = true;
    column1.castShadow = true;
    column2.castShadow = true;
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    ballMesh1.castShadow = true;
    ballMesh1.receiveShadow = true;

    scene.add(cube);
    scene.add(cube1);
    scene.add(column1);
    scene.add(column2);
    scene.add(circle1);
    scene.add(circle2);
    scene.add(circle3);
    scene.add(circle4);
    scene.add(plane);
    scene.add(ballMesh);
    scene.add(ballMesh1);

    //light
    var ambientLight = new THREE.AmbientLight(0x777777);   // 添加环境光
    scene.add(ambientLight);
    var light = new THREE.SpotLight(0x989898);  // 添加聚光灯
    light.position.set(2,5,6);   // 设置聚光灯光源位置
    light.target = cube;
    light.castShadow = true;
    light.shadowCameraVisible = true;
    light.shadowCameraNear = 2;
    light.shadowCameraFar = 10;
    light.shadowCameraFov = 30;
    light.shadowMapWidth= 4096;
    light.shadowMapHeight= 4096;
    light.shadowDarkness= 1;

    scene.add(light);



    //render
    // renderer.render(scene,camera);

    //运动
    id = requestAnimationFrame(draw);

}

function drop() {
    isMoving = true;
    ballMesh.position.y = h;
    v = 0;
}

function drop1(){
    b = 0.05;
    c = 1;
    isMoving1 = true;
    ballMesh1.position.x = w;
    draw1();
}

function draw1() {
    stat.begin();
    if (isMoving1){
        ballMesh1.position.x -= c*b;
        c -= c * 0.01;
        if(ballMesh1.position.x <= -2){
            isMoving1 = false;
            ballMesh1.position.x = -2;
        }
    }
    renderer.render(scene,camera);
    id = requestAnimationFrame(draw1);
    stat.end();
}

function draw() {
    stat.begin();
    if (isMoving){
        ballMesh.position.y += v;
        v += 3*a;
        if(ballMesh.position.y <= -0.7){
            //hit plane
            v = -v * 0.9;
        }
        // if (Math.abs(v)<0.0005){
        //     //stop moving
        //     isMoving = false;
        //     ballMesh.position.y = -0.7;
        // }
    }
    renderer.render(scene,camera);
    id = requestAnimationFrame(draw);
    stat.end();
}

function stop0() {
    if (id !== null) {
        cancelAnimationFrame(id);
        id = null;
    }
}
function stop1() {
    if (ic !== null){
        cancelAnimationFrame(ic);
        ic = null;
    }
}

