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
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export function createGLContext(canvas) {
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
        alert(`Failed to create WebGL context on ${canvas.id}!`);
    }

    return context;
}