class ConeFrustum {
    constructor(seg, r1, r2){
        this.type='frustum';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.topColor = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.segments = seg;
        if(r2 > r1)
        {
            var temp = r2;
            this.r2 = 1;
            this.r1 = r1 / temp
        }
        else
        {
            var temp = r1;
            this.r1 = 1;
            this.r2 = r2 / temp
        }
    }
    update() {
        this.matrix.setScale(1,1,1);
    }
    render()
    {
        var color = this.color;
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        var segments = this.segments;
        let alpha = 2 * Math.PI / segments;
        var circleVertices = [];
        var sideVertices = [];
        for (var angle = 0; angle < 2 * Math.PI; angle = angle + alpha)
        {
            let angle1 = angle;
            let angle2 = angle + alpha;
            let pt1A = [Math.cos(angle1) * this.r1, Math.sin(angle1) * this.r1];
            let pt2A = [Math.cos(angle2) * this.r1, Math.sin(angle2) * this.r1];

            let pt1B = [Math.cos(angle1) * this.r2, Math.sin(angle1) * this.r2];
            let pt2B = [Math.cos(angle2) * this.r2, Math.sin(angle2) * this.r2];

            circleVertices.push(0,0,0,  pt1A[0],pt1A[1],0,  pt2A[0],pt2A[1],0);
            circleVertices.push(0,0,1,  pt1B[0],pt1B[1],1,  pt2B[0],pt2B[1],1);
            //drawTriangle3D([0,0,0,  pt1A[0],pt1A[1],0,  pt2A[0],pt2A[1],0]);
            //drawTriangle3D([0,0,1,  pt1B[0],pt1B[1],1,  pt2B[0],pt2B[1],1]);

            gl.uniform4f(u_FragColor, color[0] * .9, color[1] * .9, color[2] * .9, color[3]);
            gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

            sideVertices.push(pt1A[0],pt1A[1],0,  pt1B[0],pt1B[1],1, pt2A[0],pt2A[1],0);
            sideVertices.push(pt1B[0],pt1B[1],1,  pt2B[0],pt2B[1],1, pt2A[0],pt2A[1],0);
            //drawTriangle3D([pt1A[0],pt1A[1],0,  pt1B[0],pt1B[1],1, pt2A[0],pt2A[1],0]);
            //drawTriangle3D([pt1B[0],pt1B[1],1,  pt2B[0],pt2B[1],1, pt2A[0],pt2A[1],0]);
        }
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        drawTriangle3D(circleVertices);
        gl.uniform4f(u_FragColor, color[0] * .9, color[1] * .9, color[2] * .9, color[3]);
        drawTriangle3D(sideVertices);
    }
}

function drawTriangle3D(vertices) {
    var n = 3;

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

    gl.drawArrays(gl.TRIANGLES, 0, n);
}