class TriPrism {
    constructor(){
        this.type='tPrism';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }
    update() {
        this.matrix.setScale(.1,.1,.1);
    }
    render()
    {
        var color = this.color;
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // Front
        drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);


        // Back
        drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);

        gl.uniform4f(u_FragColor, color[0] * .9, color[1] * .9, color[2] * .9, color[3]);
        // Left Side
        drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
        drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);

        gl.uniform4f(u_FragColor, color[0] * .8, color[1] * .8, color[2] * .8, color[3]);

        // Top
        drawTriangle3D([1,1,0, 1,1,1, 0,0,0]);
        drawTriangle3D([1,1,1, 0,0,1, 0,0,0]);

        // Bottom
        drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
        drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);  
    }
}



