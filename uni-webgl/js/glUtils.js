export function loadShader(gl, shaderScript, shaderType) {
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
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        alert("Compiler!!!!!!!!");
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
