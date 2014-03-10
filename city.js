var camera, scene, renderer, light;
var controls, clock;

function setup () {
  setupThreeJS();
  setupWorld();
  requestAnimationFrame(function animate() {
    renderer.render(scene,camera);
    controls.update(clock.getDelta());
    requestAnimationFrame(animate);
  });
}

function setupThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1, 10000);
  camera.position.y = 10;
  camera.position.z = 1000;
  // camera.rotation.x = -30 * Math.PI / 180;

  //renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    //some fog for distance perception
    scene.fog = new THREE.FogExp2( 0xCCCCCC, 0.0007);
  
  //clock needed to update camera with controls below (used in requestAnimationFrame)
    clock = new THREE.Clock();

  //controls
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = true;
    controls.lookVertical = false;
    scene.add(controls);


  document.body.appendChild(renderer.domElement);
}

function setupWorld() {

//skybox
    var urls = [
      'images/pos-x.png',
      'images/neg-x.png',
      'images/pos-y.png',
      'images/neg-y.png',
      'images/pos-z.png',
      'images/neg-z.png'
    ];
    // var textureCube = THREE.ImageUtils.loadTextureCube( urls );  <------ (I think this is the old way??)
    var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeReflectionMapping());
      
      var shader = THREE.ShaderLib[ "cube" ];
      shader.uniforms[ "tCube" ].value = textureCube;
      var material = new THREE.ShaderMaterial({
                  fragmentShader: shader.fragmentShader,
                  vertexShader: shader.vertexShader,
                  uniforms: shader.uniforms,
                  depthWrite: false,
                  side: THREE.BackSide
              });

      cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), material);
      scene.add(cubeMesh);

  //floor
    var geo = new THREE.PlaneGeometry(3000,3000,20,20);
    var grass = new THREE.ImageUtils.loadTexture('images/Grass0003_2_S.jpg');
    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;
    grass.repeat.set(2000,2000);
    var mat = new THREE.MeshLambertMaterial({ map: grass, overdraw: false});
    var floor = new THREE.Mesh(geo,mat);
    floor.rotation.x = -90 * Math.PI /180;
    floor.receiveShadow = true;
    scene.add(floor);

  //og building- high rise apt
    var geometry = new THREE.CubeGeometry(1,1,1);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0.5,0));
    geometry.faceVertexUvs[0][4][0].set( 0, 0 );
    geometry.faceVertexUvs[0][4][1].set( 0, 0 );
    geometry.faceVertexUvs[0][4][2].set( 0, 0 );
    geometry.faceVertexUvs[0][5][0].set( 0, 0 );
    geometry.faceVertexUvs[0][5][1].set( 0, 0 );
    geometry.faceVertexUvs[0][5][2].set( 0, 0 );
    var texture = THREE.ImageUtils.loadTexture('images/HighRiseResidential0134_2_S.jpg');
    var bumpmap = THREE.ImageUtils.loadTexture('images/HighRiseResidential0134_2_Sbump.bmp');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5,15);
    var material = new THREE.MeshLambertMaterial({
      map: texture,
      bumpMap: bumpmap,
      bumpScale: 1,
      color: 0xCCCCCC, 
      overdraw: true
    });

  //og building - glass business
    var geometry2 = new THREE.CubeGeometry(1,1,1);
    geometry2.applyMatrix(new THREE.Matrix4().makeTranslation(0,0.5,0));
    geometry2.faceVertexUvs[0][4][0].set( 0, 0 );
    geometry2.faceVertexUvs[0][4][1].set( 0, 0 );
    geometry2.faceVertexUvs[0][4][2].set( 0, 0 );
    geometry2.faceVertexUvs[0][5][0].set( 0, 0 );
    geometry2.faceVertexUvs[0][5][1].set( 0, 0 );
    geometry2.faceVertexUvs[0][5][2].set( 0, 0 );
    var texture2 = THREE.ImageUtils.loadTexture('images/HighRiseGlass0026_2_S.jpg');
    var bumpmap2 = THREE.ImageUtils.loadTexture('images/HighRiseGlass0026_2_Sbump.bmp')
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(5,15);
    var material2 = new THREE.MeshLambertMaterial({
      map: texture2,
      bumpMap: bumpmap2,
      bumpScale: 1,
      color: 0xCCCCCC, 
      overdraw: false
    });

  //apartment clones
    var cityGeometry = new THREE.Geometry();
    for(var i = 0; i < 300; i++) {
      var building = new THREE.Mesh(geometry.clone());
      building.position.x = Math.floor(Math.random() * 600 - 300) * 4;
      building.position.z = Math.floor(Math.random() * 700 - 350) * 4;
      building.scale.x = Math.random() * 60 + 20;
      building.scale.y = building.scale.x * 5;
      building.scale.z = building.scale.x;
      THREE.GeometryUtils.merge(cityGeometry, building);
    }
  //glass clones
    var cityGeometry2 = new THREE.Geometry();
    for(var i = 0; i < 300; i++) {
      var building2 = new THREE.Mesh(geometry.clone());
      building2.position.x = Math.floor(Math.random() * 600 - 300) * 4;
      building2.position.z = Math.floor(Math.random() * 700 - 350) * 4;
      building2.scale.x = Math.random() * 60 + 20;
      building2.scale.y = building2.scale.x * 5;
      building2.scale.z = building2.scale.x;
      THREE.GeometryUtils.merge(cityGeometry2, building2);
    }

  //merge city buildings together
    var glass = new THREE.Mesh(cityGeometry2,material2)
    var residential = new THREE.Mesh(cityGeometry, material);

  //add buildings to scene
    scene.add(glass)
    scene.add(residential);

  //add shadows
    glass.castShadow = true;
    glass.receiveShadow = true;
    residential.castShadow = true;
    residential.receiveShadow = true;

  //lights
    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(500,1500,1300);
    light.target.position.set(0,0,0);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    light.cameraShadowVisible = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowCameraNear = 1000;
    light.shadowCameraFar= 8000;
    light.shadowCameraLeft= -1000;
    light.shadowCameraRight= 1000;
    light.shadowCameraTop= 1000; 
    light.shadowCameraBottom= -1000;
    scene.add(light);
}
setup();