// Define global variables
var gl;
var pwgl = {};
pwgl.ongoingImageLoads = [];
var canvas;

// Import shaders
import vertexShaderGLSL from '../shaders/vertex-shader-unknown-v2.glsl.js';
import fragmentShaderGLSL from '../shaders/fragment-shader-basic-v2.glsl.js';

// Variables for translations and rotations
var transY = 0;
var transZ = 0;

var xRot = 0;
var yRot = 0;
var zRot = 0;

var xOffs = 0;
var yOffs = 0;

var drag = 0;

// Keep track of pressed down keys
pwgl.listOffPressedKeys = [];

function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i = 0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch (e) {}
    if (context) {
        break;
      }
  }

  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShader(shaderScript, shaderType) {
  // var shaderScript = document.getElementById(id);

  // If we dont find an element with the specified id
  // we do and early exit
  if (!shaderScript) {
    return null;
  }

  // // Otherwise loop though the clildren for the found DOM element and
  // // build up the shader source code as a string
  // var shaderSource = "";
  // var currentChild = shaderScript.firstChild;
  // while (currentChild) {
  //   if (currentChild.nodeType == 3) {
  //     // 3 corresponds to TEXT_NODE
  //     shaderSource += currentChild.textContent;
  //   }
  //   currentChild =currentChild.nextSibling;
  // }

  // Create a WebGL shader object according to type of shader, i.e.,
  // vertex or fragment shader.
  var shader;
  if (shaderType == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderType == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderScript);
  gl.compileShader(shader);

  // Check compiling status
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    alert("Compiler!!!!!!!!");
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function setupShaders() {
  // Create vertex and fragment shaders
  var vertexShader = loadShader(vertexShaderGLSL, "x-shader/x-vertex");
  var fragmentShader = loadShader(fragmentShaderGLSL, "x-shader/x-fragment");

  // Create a WebGL program object
  var shaderProgram = gl.createProgram();

  // Load the shaders to the program object
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);

  // Link shaders and check linking COMPILE_STATUS
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) && !gl.isContextLost()) {
    alert("Failed to setup shaders");
  }

  // Activate program
  gl.useProgram(shaderProgram);

  pwgl.vertexPositionAttributeLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  pwgl.vertexTextureAttributeLoc = gl.getAttribLocation(shaderProgram, "aTextureCoordinates");
  pwgl.uniformMVMatrixLoc = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  pwgl.uniformProjMatrixLoc = gl.getUniformLocation(shaderProgram, "uPMatrix");
  pwgl.uniformSamplerLoc = gl.getUniformLocation(shaderProgram, "uSampler");

  gl.enableVertexAttribArray(pwgl.vertexPositionAttributeLoc);
  gl.enableVertexAttribArray(pwgl.vertexTextureAttributeLoc);

  pwgl.modelViewMatrix = mat4.create();
  pwgl.projectionMatrix = mat4.create();
  pwgl.modelViewMatrixStack = [];
}

function pushModelViewMatrix() {
  var copyToPush = mat4.create(pwgl.modelViewMatrix);
  pwgl.modelViewMatrixStack.push(copyToPush);
}

function popModelViewMatrix() {
  if (pwgl.modelViewMatrixStack.length == 0) {
    throw "Error popModelViewMatrix() - Stack was empty";
  }
  pwgl.modelViewMatrix = pwgl.modelViewMatrixStack.pop();
}

function setupFloorBuffers() {
  pwgl.floorVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexPositionBuffer);

  var floorVertexPosition = [
    // Plane in y=0
     5.0,  0.0,  5.0, //v0
     5.0,  0.0, -5.0, //v1
    -5.0,  0.0, -5.0, //v2
    -5.0,  0.0,  5.0  //v3
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexPosition), gl.STATIC_DRAW);
  pwgl.FLOOR_VERTEX_POS_BUF_ITEM_SIZE = 3;
  pwgl.FLOOR_VERTEX_POS_BUF_NUM_ITEMS = 4;

  // Floor index
  pwgl.floorVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.floorVertexIndexBuffer);

  var floorVertexIndices = [0, 1, 2, 3];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(floorVertexIndices), gl.STATIC_DRAW);
  pwgl.FLOOR_VERTEX_INDEX_BUF_ITEM_SIZE = 1;
  pwgl.FLOOR_VERTEX_INDEX_BUF_NUM_ITEMS = 4;

  // Floor texture coordinates
  pwgl.floorVertexTextureCoordinateBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexTextureCoordinateBuffer);

  // Floor texture coordinates. Note that wrapping is used
  var floorVertexTextureCoordinates = [
    2.0, 0.0, //v0
    2.0, 2.0, //v1
    0.0, 2.0, //v2
    0.0, 0.0  //v3
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexTextureCoordinates), gl.STATIC_DRAW);
  pwgl.FLOOR_VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;
  pwgl.FLOOR_VERTEX_TEX_COORD_BUF_NUM_ITEMS = 4;
}

function setupCubeBuffers() {
  pwgl.cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexPositionBuffer);

  var cubeVertexPosition = [
    // Front face
     1.0,  1.0,  1.0, //v0
    -1.0,  1.0,  1.0, //v1
    -1.0, -1.0,  1.0, //v2
     1.0, -1.0,  1.0, //v3

     // Back face
     1.0,  1.0, -1.0, //v4
    -1.0,  1.0, -1.0, //v5
    -1.0, -1.0, -1.0, //v6
     1.0, -1.0, -1.0, //v7

     // Left face
    -1.0,  1.0,  1.0, //v8
    -1.0,  1.0, -1.0, //v9
    -1.0, -1.0, -1.0, //v10
    -1.0, -1.0,  1.0, //v11

     // Right face
     1.0,  1.0,  1.0, //v12
     1.0, -1.0,  1.0, //v13
     1.0, -1.0, -1.0, //v14
     1.0,  1.0, -1.0, //v15

     // Top face
     1.0,  1.0,  1.0, //v16
     1.0,  1.0, -1.0, //v17
    -1.0,  1.0, -1.0, //v18
    -1.0,  1.0,  1.0, //v19

    // Bottom face
     1.0, -1.0,  1.0, //v20
     1.0, -1.0, -1.0, //v21
    -1.0, -1.0, -1.0, //v22
    -1.0, -1.0,  1.0, //v23
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition), gl.STATIC_DRAW);

  pwgl.CUBE_VERTEX_POS_BUF_ITEM_SIZE = 3;
  pwgl.CUBE_VERTEX_POS_BUF_NUM_ITEMS = 24;

  pwgl.cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.cubeVertexIndexBuffer);

  // For simplicity, each face will be drawn as gl.TRIANGLES, therefore
  // the indices for each triangle are specified.
  var cubeVertexIndices = [
     0,  1,  2,    0,  2,  3,    // Front face
     4,  6,  5,    4,  7,  6,    // Back face
     8,  9, 10,    8, 10, 11,    // Left face
    12, 13, 14,   12, 14, 15,    // Right face
    16, 17, 18,   16, 18, 19,    // Top face
    20, 22, 21,   20, 23, 22     // Bottom face
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  pwgl.CUBE_VERTEX_INDEX_BUF_ITEM_SIZE = 1;
  pwgl.CUBE_VERTEX_INDEX_BUF_NUM_ITEMS = 36;

  // Setup buffer with texture coordinates
  pwgl.cubeVertexTextureCoordinateBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexTextureCoordinateBuffer);

  // Think about how the coordinates are asigned. Ref. vertex coords.
  var textureCoodinates = [
    // Front face
    0.0, 0.0, //v0
    1.0, 0.0, //v1
    1.0, 1.0, //v2
    0.0, 1.0, //v3

    // Back face
    0.0, 1.0, //v4
    1.0, 1.0, //v5
    1.0, 0.0, //v6
    0.0, 0.0, //v7

    // Left face
    0.0, 1.0, //v1
    1.0, 1.0, //v5
    1.0, 0.0, //v6
    0.0, 0.0, //v2

    // Right face
    0.0, 1.0, //v0
    1.0, 1.0, //v3
    1.0, 0.0, //v7
    0.0, 0.0, //v4

    // Top face
    0.0, 1.0, //v0
    1.0, 1.0, //v4
    1.0, 0.0, //v5
    0.0, 0.0, //v1

    // Bottom face
    0.0, 1.0, //v3
    1.0, 1.0, //v7
    1.0, 0.0, //v6
    0.0, 0.0  //v2
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoodinates), gl.STATIC_DRAW);
  pwgl.CUBE_VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;
  pwgl.CUBE_VERTEX_TEX_COORD_BUF_NUM_ITEMS = 24;
}

function setupTextures() {
  // Texture for the table
  pwgl.woodTexture = gl.createTexture();
  loadImageForTexture("textures/wood_128x128.jpg", pwgl.woodTexture);

  // Texture for the floor
  pwgl.groundTexture = gl.createTexture();
  loadImageForTexture("textures/wood_floor_256.jpg", pwgl.groundTexture);

  // Texture for the floor on the table
  pwgl.boxTexture = gl.createTexture();
  loadImageForTexture("textures/wicker_256.jpg", pwgl.boxTexture);
}

function loadImageForTexture(url, texture) {
  var image = new Image();
  image.onload = function () {
    pwgl.ongoingImageLoads.splice(pwgl.ongoingImageLoads.indexOf(image), 1);
  // The splice() method adds/removes items to/from an array, and returns
  // the removed item(s)
  // Syntax: array.splice(index, howMany, item1, ..., itemX)
  textureFinishedLoading(image, texture);
  }
  pwgl.ongoingImageLoads.push(image);
  image.src = url;
}

function textureFinishedLoading(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.generateMipmap(gl.TEXTURE_2D);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function setupBuffers() {
  setupFloorBuffers();
  setupCubeBuffers();
}

function uploadModelViewMatrixToShader() {
  gl.uniformMatrix4fv(pwgl.uniformMVMatrixLoc, false, pwgl.modelViewMatrix);
}

function uploadProjectionMatrixToShader() {
  gl.uniformMatrix4fv(pwgl.uniformProjMatrixLoc, false, pwgl.projectionMatrix);
}

function drawFloor() {
  // Draw the floor
  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexPositionBuffer);
  gl.vertexAttribPointer(pwgl.vertexPositionAttributeLoc,
                         pwgl.FLOOR_VERTEX_POS_BUF_ITEM_SIZE,
                         gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexTextureCoordinateBuffer);
  gl.vertexAttribPointer(pwgl.vertexTextureAttributeLoc,
                         pwgl.FLOOR_VERTEX_TEX_COORD_BUF_ITEM_SIZE,
                         gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, pwgl.groundTexture);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.floorVertexIndexBuffer);
  gl.drawElements(gl.TRIANGLE_FAN, pwgl.FLOOR_VERTEX_INDEX_BUF_NUM_ITEMS,
    gl.UNSIGNED_SHORT, 0);
}

function drawCube(texture) {
  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexPositionBuffer);
  gl.vertexAttribPointer(pwgl.vertexPositionAttributeLoc,
                         pwgl.CUBE_VERTEX_POS_BUF_ITEM_SIZE,
                         gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexTextureCoordinateBuffer);
  gl.vertexAttribPointer(pwgl.vertexTextureAttributeLoc,
                         pwgl.CUBE_VERTEX_TEX_COORD_BUF_ITEM_SIZE,
                         gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.cubeVertexIndexBuffer);
  gl.drawElements(gl.TRIANGLES, pwgl.CUBE_VERTEX_INDEX_BUF_NUM_ITEMS,
    gl.UNSIGNED_SHORT, 0);
}

function drawTable() {
  // Draw table top
  pushModelViewMatrix();
  mat4.translate(pwgl.modelViewMatrix, [0.0, 1.0, 0.0], pwgl.modelViewMatrix);
  mat4.scale(pwgl.modelViewMatrix, [2.0, 0.1, 2.0], pwgl.modelViewMatrix);
  uploadModelViewMatrixToShader();
  // Draw the actual cube (now scaled to a cuboid) with woodTexture
  drawCube(pwgl.woodTexture);
  popModelViewMatrix();

  // Draw the table legs
  for (var i = -1; i <= 1; i+=2) {
    for (var j = -1; j <= 1; j+=2) {
      pushModelViewMatrix();
      mat4.translate(pwgl.modelViewMatrix, [i*1.9, -0.1, j*1.9], pwgl.modelViewMatrix);
      mat4.scale(pwgl.modelViewMatrix, [0.1, 1.0, 0.1], pwgl.modelViewMatrix);
      uploadModelViewMatrixToShader();
      drawCube(pwgl.woodTexture);
      popModelViewMatrix();
    }
  }
}

function init() {
  // Initialization that is performed during first startup and when the
  // event webglcontextrestored is received is concluded in this function
  setupShaders();
  setupBuffers();
  setupTextures();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize some variables for the moving box
  pwgl.x = 0.0;
  pwgl.y = 2.7;
  pwgl.z = 0.0;
  pwgl.circleRadius = 4.0;

  // Initialize some variables related to the animation
  pwgl.animationStartTime = undefined;
  pwgl.nbrOfFramesForFPS = 0;
  pwgl.previousFrameTimeStamp = Date.now();

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(60, gl.viewportWidth/gl.viewportHeight, 1, 100.0, pwgl.projectionMatrix);
  mat4.identity(pwgl.modelViewMatrix);
  mat4.lookAt([8, 12, 8], [0, 0, 0], [0, 1, 0], pwgl.modelViewMatrix);
}

function draw() {
  pwgl.requestId = requestAnimFrame(draw);

  var currentTime = Date.now();

  handlePressedDownKeys();

  // Update FPS if a second or more has passed since the last FPS update
  if(currentTime - pwgl.previousFrameTimeStamp >= 1000) {
    pwgl.fpsCounter.innerHTML = pwgl.nbrOfFramesForFPS;
    pwgl.nbrOfFramesForFPS = 0;
    pwgl.previousFrameTimeStamp = currentTime;
  }

  // console.log("1   xRot= " + xRot + "   yRot= " + yRot + "   t= " + transl);
  mat4.translate(pwgl.modelViewMatrix, [0.0, transY, transZ],  pwgl.modelViewMatrix);
  mat4.rotateX(pwgl.modelViewMatrix, xRot/50, pwgl.modelViewMatrix);
  mat4.rotateY(pwgl.modelViewMatrix, yRot/50, pwgl.modelViewMatrix);
  // mat4.rotateZ(pwgl.modelViewMatrix, zRot/50, pwgl.modelViewMatrix);
  yRot = xRot = zRot = transY = transZ = 0;

  uploadModelViewMatrixToShader();
  uploadProjectionMatrixToShader();
  // Note: in uniform1i next line "1" is "one" not "L"!! Check WebGL for
  // unifrorm2i, 2v, 3i, 3v
  gl.uniform1i(pwgl.uniformSamplerLoc, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw floor
  drawFloor();

  // Draw table
  pushModelViewMatrix();
  mat4.translate(pwgl.modelViewMatrix, [0.0, 1.1, 0.0], pwgl.modelViewMatrix);
  uploadModelViewMatrixToShader();
  drawTable();
  popModelViewMatrix();

  // Draw box.
  //  Calculate the position for the box that is initially
  //  on top of the table but will then be moved during animation
  pushModelViewMatrix();
  if (currentTime === undefined) {
    currentTime = Date.now();
  }
  if (pwgl.animationStartTime === undefined) {
    pwgl.animationStartTime = currentTime;
  }

  // Update the position of the box
  if (pwgl.y < 5) {
    // Firts move the box vertically from its original position on
    // top of the table (where y = 2.7) to 5 units above the
    // floor (y = 5). Let this movement take 3 seconds
    pwgl.y = 2.7 + (currentTime - pwgl.animationStartTime)/3000 * (5.0 - 2.7);
  } else {
    // Then move the box in a circle where one revolution takes 2 seconds
    pwgl.angle = (currentTime - pwgl.animationStartTime)/2000*2*Math.PI % (2*Math.PI);
    pwgl.x = Math.cos(pwgl.angle) * pwgl.circleRadius;
    pwgl.z = Math.sin(pwgl.angle) * pwgl.circleRadius;
  }
  mat4.translate(pwgl.modelViewMatrix, [pwgl.x, pwgl.y, pwgl.z], pwgl.modelViewMatrix);
  mat4.scale(pwgl.modelViewMatrix, [0.5, 0.5, 0.5], pwgl.modelViewMatrix);
  uploadModelViewMatrixToShader();
  drawCube(pwgl.boxTexture);
  popModelViewMatrix();

  pwgl.nbrOfFramesForFPS++;
}

function handleKeyDown(event) {
  pwgl.listOffPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  pwgl.listOffPressedKeys[event.keyCode] = false;
}

function handlePressedDownKeys() {
  if (pwgl.listOffPressedKeys[38]) {
    // Arrow up, increase radius of circle
    pwgl.circleRadius += 0.1;
  }
  if (pwgl.listOffPressedKeys[40]) {
    // Arrow down, decrease radius of circle
    pwgl.circleRadius -= 0.1;
    if (pwgl.circleRadius < 0) {
      pwgl.circleRadius = 0;
    }
  }
}

function mymousedown(ev) {
  drag = 1;
  xOffs = ev.clientX;
  yOffs = ev.clientY;
}

function mymouseup(ev) {
  drag = 0;
}

function mymousemove(ev) {
  if (drag == 0) return;
  if (ev.shiftKey) {
    transZ = (ev.clientY - yOffs)/10;
    // zRot = (xOffs - ev.clientX)*.3;
  } else if (ev.altKey) {
    transY = -(ev.clientY - yOffs)/10;
  } else {
    yRot = (- xOffs + ev.clientX)/10;
    xRot = (- yOffs + ev.clientY)/10;
    // console.log("xOffs= "+xOffs+"   yOffs"+yOffs);
  }
}

function wheelHandler(ev) {
  if (ev.altKey) transY = -ev.detail/10;
  else transZ = ev.detail/10;
  // console.log("delta = "+ev.detail);
  ev.preventDefault();
}

// This function is the entry point of this webgl application
// It is the firts function to be loaded when the html doc is loaded into
function startup() {
  // retrieve html canvas
  canvas = document.getElementById("canvas-web-gl-week-8");
  canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas);
  canvas.addEventListener('webglcontextlost', handleContextLost, false);
  canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  document.addEventListener('keydown', handleKeyDown, false);
  document.addEventListener('keyup', handleKeyUp, false);
  canvas.addEventListener('mousemove', mymousemove, false);
  canvas.addEventListener('mousedown', mymousedown, false);
  canvas.addEventListener('mouseup', mymouseup, false);
  canvas.addEventListener('mousewheel', wheelHandler, false);
  canvas.addEventListener('DOMMouseScroll', wheelHandler, false);

  gl = createGLContext(canvas);

  init();

  pwgl.fpsCounter = document.getElementById("fps-week-8");
  // Draw the complete scene
  draw();
}

function handleContextLost(event) {
  event.preventDefault();
  cancelRequestAnimFrame(pwgl.requestId);

  // Ignore all onging image loads by removing their onload handler
  for (var i = 0; i < pwgl.ongoingImageLoads.length; i++) {
    pwgl.ongoingImageLoads[i].onload = undefined;
  }
  pwgl.ongoingImageLoads = [];
}

function handleContextRestored(event) {
  init();
  pwgl.requestId = requestAnimFrame(draw, canvas);
}

function main(){
  startup();
}

window.addEventListener('load', main)