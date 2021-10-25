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

/*
  Creates the WebGL context for the canvas, returning said context
*/
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
        Buffer: cubeVertexPositionBuffer,
        BUF_ITEM_SIZE: 3,
        BUF_NUM_ITEMS: 24
    };
}

export function addCubeVertexIndexBuffers(gl) {
    const cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

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

    return {
        Buffer: cubeVertexIndexBuffer,
        BUF_ITEM_SIZE: 1,
        BUF_NUM_ITEMS: 36,
    }
}

export function addCubeVertexTextureCoordinateBuffers(gl) {
    // Setup buffer with texture coordinates
    const cubeVertexTextureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordinateBuffer);

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

    return {
        Buffer: cubeVertexTextureCoordinateBuffer,
        BUF_ITEM_SIZE: 2,
        BUF_NUM_ITEMS: 24,
    }
}

export function addCubeVertexTextureCoordinateBuffersUniqueSides(gl) {
    // Setup buffer with texture coordinates
    const cubeVertexTextureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordinateBuffer);

    // Think about how the coordinates are asigned. Ref. vertex coords.
    var textureCoodinates = [
        // Front face
        0.0, 0.5, //v0
        1/3, 0.5, //v1
        1/3, 1.0, //v2
        0.0, 1.0, //v3

        // Back face
        1/3, 1.0, //v4
        2/3, 1.0, //v5
        2/3, 0.5, //v6
        1/3, 0.5, //v7

        // Left face
        2/3, 1.0, //v1
        1.0, 1.0, //v5
        1.0, 0.5, //v6
        2/3, 0.5, //v2

        // Right face
        0.0, 0.5, //v0
        1/3, 0.5, //v3
        1/3, 0.0, //v7
        0.0, 0.0, //v4

        // Top face
        1/3, 0.5, //v0
        2/3, 0.5, //v4
        2/3, 0.0, //v5
        1/3, 0.0, //v1

        // Bottom face
        2/3, 0.5, //v3
        1.0, 0.5, //v7
        1.0, 0.0, //v6
        2/3, 0.0  //v2
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoodinates), gl.STATIC_DRAW);

    return {
        Buffer: cubeVertexTextureCoordinateBuffer,
        BUF_ITEM_SIZE: 2,
        BUF_NUM_ITEMS: 24,
    }
}

export function addCubeVertexNormalBuffers(gl){
    // Setup normal buffer for lighting calculations
    const cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);

    var cubeVertexNormals = [
        // Front face
         0.0,  0.0,  1.0, //v0
         0.0,  0.0,  1.0, //v1
         0.0,  0.0,  1.0, //v2
         0.0,  0.0,  1.0, //v3

        // Back face
         0.0,  0.0, -1.0, //v4
         0.0,  0.0, -1.0, //v5
         0.0,  0.0, -1.0, //v6
         0.0,  0.0, -1.0, //v7

        // Left face
        -1.0,  0.0,  0.0, //v1
        -1.0,  0.0,  0.0, //v5
        -1.0,  0.0,  0.0, //v6
        -1.0,  0.0,  0.0, //v2

        // Right face
         1.0,  0.0,  0.0, //v0
         1.0,  0.0,  0.0, //v3
         1.0,  0.0,  0.0, //v7
         1.0,  0.0,  0.0, //v4

        // Top face
         0.0,  1.0,  0.0, //v0
         0.0,  1.0,  0.0, //v4
         0.0,  1.0,  0.0, //v5
         0.0,  1.0,  0.0, //v1

        // Bottom face
         0.0, -1.0,  0.0, //v3
         0.0, -1.0,  0.0, //v7
         0.0, -1.0,  0.0, //v6
         0.0, -1.0,  0.0, //v2
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexNormals), gl.STATIC_DRAW);

    return {
        Buffer: cubeVertexNormalBuffer,
        BUF_ITEM_SIZE: 3,
        BUF_NUM_ITEMS: 24,
    }
}
