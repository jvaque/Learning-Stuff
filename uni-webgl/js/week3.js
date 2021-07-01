// Define global variables
var gl;
var canvas;
var shaderProgram;
var vertexBuffer;

// This function is the entry point of this webgl application
// It is the firts function to be loaded when the html doc is loaded into
function startup() {
  // retrieve html canvas
  canvas = document.getElementById("myGlCanvas");
  // Create webgl contex. Here, the debuggin context is created by calling
  // a functin in the library (createGLContext(canvas))
  gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
  setupShaders();
  setupBuffers();
  // Set the colour to draw width
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);

  // If there is no shader scripts, the function exists
  if (!shaderScript) {
    return null;
  }

  // Otherwise loop though the clildren for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) {
      // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild =currentChild.nextSibling;
  }

  // Create a WebGL shader object according to type of shader, i.e.,
  // vertex or fragment shader.
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    // Call WebGL function createShader() to create fragment
    // shader object
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    // Call WebGL function createShader() to create vertex
    // shader object
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  // Load the shader source code (shaderSource) to the shader object
  gl.shaderSource(shader, shaderSource);
  // Compile the shader
  gl.compileShader(shader);

  // Check compiling status
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function setupShaders() {
  // Create vertex and fragment shaders
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");

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
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}

// Buffers are places for data. All data, e.g., vertex coordinates,
// texture coordinates, indices, colours must be stored in their
// buffers. Here, the buffer is for the vertex coordinates of a triangle
function setupBuffers() {
  // A buffer object is first created by calling gl.createBuffer()
  vertexBuffer = gl.createBuffer();
  // Then bind the buffer to gl.ARRAY_BUFFER, which is the WebGL built in
  // buffer where the vertex shader will fetch data from
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Actual coordinates for the vertices
  var triangleVertices = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
  ];
  // Load the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  // Add properties to vertexBuffer object
  vertexBuffer.itemSize = 3;      //3 coordinates for each vertex
  vertexBuffer.numberOfItems = 3; //3 vertices in all in this buffer
}

function draw() {
  // Setup a viewport that is the same as the canvas using
  // function viewport(int x, int y, sizei w, sizei h)
  // where x and y give the x and y window coordinates of the viewport's width
  // and height
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  // Fill the canvas with solid colour. Default is black
  // If other colour is desirable using function gl.clearColor (r, g, b, a)
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Inform webgl pipeline with pinter of the attribute
  // "aVertexPosition". Still remember it?
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
     vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
}
