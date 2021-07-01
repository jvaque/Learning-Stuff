// Define global variables
var gl;
var canvas;
var shaderProgram;
var vertexBuffer;
var triangleVertexBuffer;
var triangleVertexColorBuffer;

// Import shaders
import vertexShaderGLSL from '../shaders/vertex-shader-unknown-v4.glsl.js';
import fragmentShaderGLSL from '../shaders/fragment-shader-basic-v3.glsl.js';

// This function is the entry point of this webgl application
// It is the firts function to be loaded when the html doc is loaded into
function startup() {
  // retrieve html canvas
  canvas = document.getElementById("canvas-web-gl-week-4-ex1");
  // Create webgl contex. Here, the debuggin context is created by calling
  // a functin in the library (createGLContext(canvas))
  gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
  setupShaders();
  setupBuffers();
  // Set the colour to draw width
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
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
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // For the triangle we want to use per vertex color so
  // the vertexColorAttribute, aVertexColor, in the vertex shader
  // is enabled
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

// Buffers are places for data. All data, e.g., vertex coordinates,
// texture coordinates, indices, colours must be stored in their
// buffers. Here, the buffer is for the vertex coordinates of a triangle
function setupBuffers() {
  // triangle vertices
  triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  var triangleVertices = [
    0.0, 0.5, 0.0,    //v0
    -0.5, -0.5, 0.0,  //v1
    0.5, -0.5, 0.0    //v2
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  triangleVertexBuffer.itemSize = 3;      //3 coordinates for each vertex
  triangleVertexBuffer.numberOfItems = 3; //3 vertices in all in this buffer

  // Triangle vertex Colors
  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  var colors = [
    1.0, 0.0, 0.0, 1.0, //v0
    0.0, 1.0, 0.0, 1.0, //v1
    0.0, 0.0, 1.0, 1.0, //v2
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4;
  triangleVertexColorBuffer.numberOfItems = 3;
}

function draw() {
  // Setup a viewport that is the same as the canvas using
  // function viewport(int x, int y, sizei w, sizei h)
  // where x and y give the x and y window coordinates of the viewport's width
  // and height
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Make vertex buffer "triangleVertexBuffer" the current buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);

  // Link the current buffer, to the attribute "aVertexPosition" in
  // the vertex shader
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
     triangleVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Make color buffer "triangleVertexColorBuffer" the current buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  // Link the current buffer to the attribute "aVertexColor" in
  // the vertex shader
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
     triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexBuffer.numberOfItems);
}

function main(){
  startup();
}

window.addEventListener('load', main)