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

export function addCubeVertexPositionBuffers(gl) {
    const cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

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

    return {
        vertexPositionBuffer: cubeVertexPositionBuffer,
        VERTEX_POS_BUF_ITEM_SIZE: 3,
        VERTEX_POS_BUF_NUM_ITEMS: 24
    };
}