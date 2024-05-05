class Cube {
    constructor(texValue = -2){
        this.type='cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.texValue = texValue;
    }
    update() {}
    render()
    {
        //console.log("" + this.texValue);
        gl.uniform1i(u_TexSelect, this.texValue);
        var color = this.color;
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        var vertices = [];
        var uv = [];
        // Front
        vertices.push(0,0,0, 1,1,0, 1,0,0);
        uv.push(1,0, 0,1, 1,1);
        vertices.push(0,0,0, 0,1,0, 1,1,0);
        uv.push(1,0, 0,0, 0,1);

        //drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
        //drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

        // Back
        vertices.push(0,0,1, 1,0,1, 1,1,1);
        uv.push(0,0, 0,1, 1,1);
        vertices.push(0,0,1, 1,1,1, 0,1,1);
        uv.push(0,0, 1,1, 1,0);

        //drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
        //drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);

        //gl.uniform4f(u_FragColor, color[0] * .9, color[1] * .9, color[2] * .9, color[3]);
        // Right Side
        vertices.push(1,0,0, 1,0,1, 1,1,1);
        uv.push(0,0, 1,0, 1,1);

        vertices.push(1,0,0, 1,1,0, 1,1,1);
        uv.push(0,0, 0,1, 1,1);

        //drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
        //drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);

        // Left Side
        vertices.push(0,0,0, 0,0,1, 0,1,1);
        uv.push(0,0, 0,1, 1,1);

        vertices.push(0,0,0, 0,1,0, 0,1,1);
        uv.push(0,0, 1,0, 1,1);

        //drawTriangle3D([0,1,0, 0,1,1, 0,0,1]);
        //drawTriangle3D([0,1,0, 0,0,1, 0,0,0]);

        //gl.uniform4f(u_FragColor, color[0] * .8, color[1] * .8, color[2] * .8, color[3]);

        // Top
        vertices.push(1,1,0, 1,1,1, 0,1,0);
        uv.push(0,0, 1,0, 0,1);

        vertices.push(1,1,1, 0,1,1, 0,1,0);
        uv.push(1,0, 1,1, 0,1);

        //drawTriangle3D([1,1,0, 1,1,1, 0,1,0]);
        //drawTriangle3D([1,1,1, 0,1,1, 0,1,0]);

        // Bottom
        vertices.push(0,0,0, 0,0,1, 1,0,1);
        uv.push(1,0, 1,1, 0,1);

        vertices.push(0,0,0, 1,0,0, 1,0,1);
        uv.push(1,0, 0,0, 0,1);

        //drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
        //drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);  
        //console.log("Drawing a Cube");
        drawTriangle3DUV(vertices, uv);
    }
}


function drawTriangle3DUV(vertices, uv) {
    var vBuffer = gl.createBuffer();
    if (!vBuffer)   {
        console.log('Failed to create triangle buffer');
        return -1;
    }

    var uvBuffer = gl.createBuffer();
    if (!uvBuffer)   {
        console.log('Failed to create uv buffer');
        return -1;
    }

    // Vertex Buffer Init
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position); 

    // UV Buffer Init
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);



    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}

function drawTriangle3D(vertices) {
    var vBuffer = gl.createBuffer();
    if (!vBuffer)   {
        console.log('Failed to create triangle buffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position); 

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}
