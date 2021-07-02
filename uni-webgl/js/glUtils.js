export function loadShader(gl, shaderScript, shaderType) {
    // If the function is called without passing in a shader script we do an 
    // early exit
    if (!shaderScript) {
        return null;
    }

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

    // Load the shader source code (shaderScript) to the shader object
    gl.shaderSource(shader, shaderScript);
    // Compile the shader
    gl.compileShader(shader);

    // Check compiling status
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        alert("Error while attempting to load shaders!!");
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
