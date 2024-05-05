class Cylinder {
    constructor(seg){
        this.type='cylinder';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.segments = seg;
    }
    update() {
        this.matrix.setScale(.1,.1,.1);
    }
    render()
    {
        var color = this.color;
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        var drawSize = 1;
        var segments = this.segments;
        let alpha = 2 * Math.PI / segments;
        var vertices = [];
        for (var angle = 0; angle < 2 * Math.PI; angle = angle + alpha)
        {
            let angle1 = angle;
            let angle2 = angle + alpha;
            let pt1 = [Math.cos(angle1) * drawSize, Math.sin(angle1) * drawSize];
            let pt2 = [Math.cos(angle2) * drawSize, Math.sin(angle2) * drawSize];
            vertices.push(0,0,0,  pt1[0],pt1[1],0,  pt2[0],pt2[1],0);
            vertices.push(0,0,1,  pt1[0],pt1[1],1,  pt2[0],pt2[1],1);
            //drawTriangle3D([0,0,0,  pt1[0],pt1[1],0,  pt2[0],pt2[1],0]);
            //drawTriangle3D([0,0,1,  pt1[0],pt1[1],1,  pt2[0],pt2[1],1]);

            vertices.push(pt1[0],pt1[1],0,  pt1[0],pt1[1],1, pt2[0],pt2[1],0);
            vertices.push(pt1[0],pt1[1],1,  pt2[0],pt2[1],1, pt2[0],pt2[1],0);
            //drawTriangle3D([pt1[0],pt1[1],0,  pt1[0],pt1[1],1, pt2[0],pt2[1],0]);
            //drawTriangle3D([pt1[0],pt1[1],1,  pt2[0],pt2[1],1, pt2[0],pt2[1],0]);
        }
        drawTriangle3D(vertices);
    }
}

function drawTriangle3D(vertices) {
    var vBuffer = gl.createBuffer();
    if (!vBuffer)   {
        console.log('Failed to create triangle buffer');
        return -1;
    }
    //console.log(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position); 

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}