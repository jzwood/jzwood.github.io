///////////////////////////////////////////////
/* BELOW USES THREE.JS TO DRAW MAZE BY FLOOR */
//////////////////////////////////////////////

var querystring = location.search.slice(1);

var simpleGraphics = function(){
  var qsList = querystring.split('&');
  for(var spec in qsList){
    if (qsList[spec] === "simplegraphics=true"){
      return true;
    }
  }
  return false;
}();

//uses
function drawFloor(elevation, dims, loader, scene){
  var floorPlans = cleanMaze(makeMaze(dims),dims),
      walls = [];
  for(var i=0; i<dims; i++){
    for(var j=0; j<dims; j++){
      // var rot = j%2 === 0 ? 0 : Math.PI/2;
      var rot = 0;
      if (floorPlans[i][j] === 1)
        makeWall(i,elevation,j,rot,loader,scene);
      else if(floorPlans[i][j] === 0)
        drawCeiling(i,elevation,j,loader, scene);
        drawBlood(i,elevation,j,0.2,loader, scene);
    }
  }
  return floorPlans;
}

function groundFloor(dims, floor, loader, scene){
  for(var i=0; i<dims; i++){
    for(var j=0; j<dims; j++){
      if(floor[i][j] != 1){
        drawCeiling(i,-1,j,loader, scene);
        drawBlood(i,0,j,0.2, loader, scene);
      }
    }
  }
}

function makeWall(x,y,z,r,loader,scene){
  var WALLWIDTH = 1,
      WALLHEIGHT= 1,
      WALLDEPTH = 1;
  var geo = new THREE.BoxGeometry( WALLWIDTH, WALLDEPTH, WALLHEIGHT );
  // load a resource
  if(!simpleGraphics){
    loader.load('alone_assets/images/concrete2.jpg', function ( tex ) {
        // var texture = new THREE.TextureLoader().load( 'assets/images/' );
        var mat = new THREE.MeshPhongMaterial({ map: tex }),
            cube = new THREE.Mesh(geo,mat);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.castShadow = true;
        cube.receiveShadow = false;
        scene.add( cube );
      },
      function ( xhr ) { // Function called when download progresses
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function ( xhr ) { // Function called when download errors
        console.log( xhr, 'Texture Load Error Occurred' );
      });
    }else{
      var cols = ["#B7B7B7", "#BAB1AA", "#BEAB9D", "#C2A590", "#C69F84", "#CA9977", "#CD936A", "#D18D5E", "#D58751", "#D98144", "#DD7B38"];
      var mat = new THREE.MeshPhongMaterial({ color: cols[Math.floor(Math.random()*cols.length)] }),
          cube = new THREE.Mesh(geo,mat);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.castShadow = true;
      cube.receiveShadow = false;
      scene.add( cube );
    }
  }

function drawBlood(x,y,z,prob, iLoader, scene){
  /***************/
  if(Math.random() < prob){

    // load a image resource
    iLoader.load('alone_assets/images/blood/b' + Math.floor(Math.random()*6+1) + '.png',
    	// Function when resource is loaded
    	function ( image ) {

        var bMat = new THREE.MeshPhongMaterial({map: image}),
        bGeo = new THREE.PlaneGeometry(1, 1);

        var bMesh = new THREE.Mesh(bGeo, bMat);

        bMesh.position.set(x, y-0.494, z);
        bMesh.rotation.x -= Math.PI/2;
        bMesh.material.transparent = true;

        scene.add( bMesh );
    	},
    	// Function called when download progresses
    	function ( xhr ) {
    		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    	},
    	// Function called when download errors
    	function ( xhr ) {
    		console.log( 'An error happened' );
    	}
    );

  }
  /*******************/
}

//draws the floor tile for a given position
function drawCeiling(x, y, z, loader, scene){
  var WALLWIDTH = 1,
      WALLHEIGHT= 1,
      WALLDEPTH = 0.01;

  y+=0.5;
  var geo = new THREE.BoxGeometry( WALLWIDTH, WALLDEPTH, WALLHEIGHT );
  // load a resource
  if(!simpleGraphics){
    loader.load('alone_assets/images/concrete2.jpg', function ( tex ) {
        // var texture = new THREE.TextureLoader().load( 'assets/images/' );
        var mat = new THREE.MeshPhongMaterial({ map: tex }),
            cube = new THREE.Mesh(geo,mat);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.castShadow = true;
        cube.receiveShadow = false;
        scene.add( cube );
      },
      function ( xhr ) { // Function called when download progresses
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function ( xhr ) { // Function called when download errors
        console.log( xhr, 'Texture Load Error Occurred' );
      });
    }else{
      var cols = ["#B7B7B7", "#AFB1BA", "#A8ABBE", "#A0A5C2", "#999FC6", "#9299CA", "#8A93CD", "#838DD1", "#7B87D5", "#7481D9", "#6D7BDD"];
      var mat = new THREE.MeshPhongMaterial({ color: cols[Math.floor(Math.random()*cols.length)] }),
          cube = new THREE.Mesh(geo,mat);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.castShadow = true;
      cube.receiveShadow = false;
      scene.add( cube );
    }

}
