// Define global variables
var gl;
var canvas;
var shaderProgram;

var floorVertexPositionBuffer;
var floorVertexIndexBuffer;
var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;

var modelViewMatrix;
var projectionMatrix;
var modelViewMatrixStack;

// Import shaders
import vertexShaderGLSL from '../shaders/vertex-shader-unknown-v3.glsl.js';
import fragmentShaderGLSL from '../shaders/fragment-shader-basic-v3.glsl.js';

// This function is the entry point of this webgl application
// It is the firts function to be loaded when the html doc is loaded into
function startup() {
  // retrieve html canvas
  canvas = document.getElementById("canvas-web-gl-week-6");
  // Create webgl contex. Here, the debuggin context is created by calling
  // a functin in the library (createGLContext(canvas))
  gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
  setupShaders();
  setupBuffers();
  // Set the colour to draw width
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  draw();
}

// Create WebGL context. Recall that we have us getContext("2D")
// to create a 2D contex for drawing 2D graphics
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

// Load shaders from DOM (document object model). This function will be
// called in setupShaders(). The parameters for argument id will be
// "shader-vs" and "shader-fs"
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
    // Call WebGL function createShader() to create fragment shader object
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderType == "x-shader/x-vertex") {
    // Call WebGL function createShader() to create vertex shader object
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  // Load the shader source code (shaderSource) to the shader object
  gl.shaderSource(shader, shaderScript);
  // Compile the shader
  gl.compileShader(shader);

  // Check compiling status
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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
  shaderProgram = gl.createProgram();

  // Load the shaders to the program object
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);

  // Link shaders and check linking COMPILE_STATUS
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  // Activate program
  gl.useProgram(shaderProgram);

  // Add a property to the shader program object. The property is the
  // attribute in the vertex shader, which has beel loaded to the program
  // object. Function getAttribLocation() finds the pointer to this attribute
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

  shaderProgram.uniformMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.uniformProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // Initialise the matrices
  modelViewMatrix = mat4.create();
  projectionMatrix = mat4.create();
  modelViewMatrixStack = [];

  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}

function pushModelViewMatrix() {
  var copyToPush = mat4.create(modelViewMatrix);
  modelViewMatrixStack.push(copyToPush);
}

function popModelViewMatrix() {
  if (modelViewMatrixStack.length == 0) {
    throw "Error popModelViewMatrix() - Stack was empty";
  }
  modelViewMatrix = modelViewMatrixStack.pop();
}

function setupFloorBuffers() {
  floorVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);

  var floorVertexPosition = [
    // Plane in y=0
     5.0,  0.0,  5.0, //v0
     5.0,  0.0, -5.0, //v1
    -5.0,  0.0, -5.0, //v2
    -5.0,  0.0,  5.0  //v3
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexPosition), gl.STATIC_DRAW);
  floorVertexPositionBuffer.itemSize = 3;
  floorVertexPositionBuffer.numberOfItems = 4;

  floorVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndexBuffer);

  var floorVertexIndices = [0, 1, 2, 3];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(floorVertexIndices), gl.STATIC_DRAW);
  floorVertexIndexBuffer.itemSize = 1;
  floorVertexIndexBuffer. numberOfItems = 4;
}

function setupCubeBuffers() {
  cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

  var cubeVertexPosition = [
     1.0,  1.0,  1.0, //v0
    -1.0,  1.0,  1.0, //v1
    -1.0, -1.0,  1.0, //v2
     1.0, -1.0,  1.0, //v3
     1.0,  1.0, -1.0, //v4
    -1.0,  1.0, -1.0, //v5
    -1.0, -1.0, -1.0, //v6
     1.0, -1.0, -1.0  //v7
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition), gl.STATIC_DRAW);

  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numberOfItems = 8;

  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

  // For simplicity, each face will be drawn as gl.TRIANGLES, therefore
  // the indices for each triangle are specified.
  var cubeVertexIndices = [
    0, 1, 3,    0, 2, 3,    // Front face
    4, 6, 5,    4, 7, 6,    // Back face
    1, 5, 6,    1, 6, 2,    // Left
    0, 3, 7,    0, 7, 4,    // Right
    0, 5, 1,    0, 4, 5,    // Top
    3, 2, 6,    3, 6, 7     // Bottom
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;
  cubeVertexIndexBuffer.numberOfItems = 36;
}

// Buffers are places for data. All data, e.g., vertex coordinates,
// texture coordinates, indices, colours must be stored in their
// buffers. Here, the buffer is for the vertex coordinates of a triangle
function setupBuffers() {
  setupFloorBuffers();
  setupCubeBuffers();
}

function uploadModelViewMatrixToShader() {
  gl.uniformMatrix4fv(shaderProgram.uniformMVMatrix, false, modelViewMatrix);
}

function uploadProjectionMatrixToShader() {
  gl.uniformMatrix4fv(shaderProgram.uniformProjMatrix, false, projectionMatrix);
}

function drawFloor(r,g,b,a) {
  // Disable vertex attrib array and use constant color for the floor.
  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
  // Set colour
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, r, g, b, a);

  // Draw the floor
  gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    floorVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndexBuffer);
  gl.drawElements(gl.TRIANGLE_FAN, floorVertexIndexBuffer.numberOfItems,
    gl.UNSIGNED_SHORT, 0);
}

function drawCube(r,g,b,a) {
  // Disable vertex attrib array and use constant color for the cube.
  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
  // Set colour
  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, r, g, b, a);

  // Draw the floor
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numberOfItems,
    gl.UNSIGNED_SHORT, 0);
}

function drawTable() {
  // Draw table top
  pushModelViewMatrix();
  mat4.translate(modelViewMatrix, [0.0, 1.0, 0.0], modelViewMatrix);
  mat4.scale(modelViewMatrix, [2.0, 0.1, 2.0], modelViewMatrix);
  uploadModelViewMatrixToShader();
  // Draw the scaled cube
  drawCube(0.72, 0.53, 0.04, 1.0); // brown color
  popModelViewMatrix();

  // Draw the table legs
  for (var i = -1; i <= 1; i+=2) {
    for (var j = -1; j <= 1; j+=2) {
      pushModelViewMatrix();
      mat4.translate(modelViewMatrix, [i*1.9, -0.1, j*1.9], modelViewMatrix);
      mat4.scale(modelViewMatrix, [0.1, 1.0, 0.1], modelViewMatrix);
      uploadModelViewMatrixToShader();
      drawCube(0.72, 0.53, 0.04, 1.0); // brown color
      popModelViewMatrix();
    }
  }
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(60, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0, projectionMatrix);
  mat4.identity(modelViewMatrix);
  mat4.lookAt([8, 5, -10], [0, 0, 0], [0, 1, 0], modelViewMatrix);
  uploadModelViewMatrixToShader();
  uploadProjectionMatrixToShader();

  // Draw floor in red color
  drawFloor(1.0, 0.0, 0.0, 1.0);

  // Draw table
  pushModelViewMatrix();
  mat4.translate(modelViewMatrix, [0.0, 1.1, 0.0], modelViewMatrix);
  uploadModelViewMatrixToShader();
  drawTable();
  popModelViewMatrix();

  // Draw box on top of the table
  pushModelViewMatrix();
  mat4.translate(modelViewMatrix, [0.0, 2.7, 0.0], modelViewMatrix);
  mat4.scale(modelViewMatrix, [0.5, 0.5, 0.5], modelViewMatrix);
  uploadModelViewMatrixToShader();
  drawCube(0.0, 0.0, 1.0, 1.0);
  popModelViewMatrix();
}

function main(){
  startup();
}

window.addEventListener('load', main)