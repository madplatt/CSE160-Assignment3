class Snake {
    constructor(idleIsRunning=true){
        this.activeIsRunning = false;
        this.idleIsRunning = idleIsRunning;
        this.type='snake';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.shapes = [];
        this.wiggleValue = 2;
        this.joint1Angle = g_j1Angle;
        this.numSegments = 20;
        this.buildSnake();
    }
    initializeA1() {
        this.a1IsRunning = true;
        varA1 = this.a1Variables;
    }
    initializeA2() {
        this.a2IsRunning = true;
        varA2 = this.a2Variables;
    }
    render() {
        var shapes = this.shapes;
        var len = shapes.length;
        for (var i = 0; i < len; i++)  {
            shapes[i].render();
        }
    }
    update() {
        var shapes = this.shapes;
        var len = this.shapes.length;
        
        var lastSegment;
        var headBase;
        for (var i = 0; i < len; i++)
        {
            var currentShape = shapes[i];
            if(!g_animDisabled)
            {
                if(currentShape.type === "b")
                {
                    if (i != 0)
                    {
                        var prevShape = shapes[i - 1];
                        currentShape.matrix = new Matrix4(prevShape.matrix);
                        currentShape.matrix.translate(0, .6, 0);
                        currentShape.matrix.translate(Math.sin(g_secondsPassed) * .2 / g_j2Angle, Math.abs(Math.sin(g_secondsPassed)) * .2 / g_j2Angle, 0);
                        
                        currentShape.matrix.rotate(g_j1Angle * -.2,1,0,0);
                        //taperCoeff = ((2 * len) - i) / (2 * len)
                        //currentShape.matrix.scale(.1 * taperCoeff,.08,.1 * taperCoeff);
                        lastSegment = currentShape;
                    }
                }
                else if(currentShape.type === "hb")
                {
                    var prevShape = shapes[i - 1];
                    currentShape.matrix = new Matrix4(prevShape.matrix);
                    currentShape.matrix.translate(0, .75, -g_j1Angle * .01 + .1);
                    currentShape.matrix.translate(Math.sin(g_secondsPassed) * .2 / g_j2Angle, Math.abs(Math.sin(g_secondsPassed)) * .2 / g_j2Angle, 0);
                    currentShape.matrix.rotate(4 * g_j1Angle,1,0,0);
                    
                    currentShape.matrix.scale(1.2, 1.2, -1);
                    currentShape.matrix.scale(1.5, 1.5, 1.5);
                    headBase = currentShape;
                }
                else if(currentShape.type === "h1")
                {
                    
                    currentShape.matrix = new Matrix4(headBase.matrix);
                    currentShape.matrix.rotate(180, 0, 1, 0 );
                    currentShape.matrix.translate(0, 0, 0 );
                    //currentShape.matrix.scale(1, .5, 1);
                    headBase = currentShape;
                }
                else if(currentShape.type === "h2")
                {
                    
                    currentShape.matrix = new Matrix4(headBase.matrix);
                    currentShape.matrix.translate(0, 0, -1 );
                    currentShape.matrix.scale(.5, .5, -.3);
                    headBase = currentShape;
                }
                else if(currentShape.type === "e")
                {
                    
                    currentShape.matrix = new Matrix4(headBase.matrix);
                    currentShape.matrix.translate(-1, 0, -1.1);
                    currentShape.matrix.scale(2, 1, 1);

                    headBase = currentShape;
                }
            }
            if (this.activeIsRunning)
            {
                if(currentShape.type == "t")
                {
                    var prevShape = shapes[i - 1];
                    currentShape.matrix = new Matrix4(prevShape.matrix);
                    currentShape.matrix.translate(0, .75, -g_j1Angle * .01 + .1);
                    currentShape.matrix.translate(Math.sin(g_secondsPassed) * .2, Math.abs(Math.sin(g_secondsPassed)) * .2, 0);
                    currentShape.matrix.rotate(4 * g_j1Angle,1,0,0);
                    
                    currentShape.matrix.scale(1.2, 1.2, -2);
                    currentShape.matrix.scale(1.5, 1.5, 1.5);
                }
            }
        }
    }
    updateIdle(shape) {
        if (this.wiggleValue < 0) { 
            this.wiggleValue += .01;
        }
        else {
            this.wiggleValue -= .01;
        }
        if (shape.type == "b") {
            //shape.matrix.rotate(.2,1,0,1);
        }
    }
    toggleAnimation()
    {
        this.idleIsRunning = !this.idleIsRunning;
    }

    updateA2() {

    }
    buildSnake() {
        var startPoint = new Matrix4();
        startPoint.translate(0, -.5, 0);
        var taperCoeff;
        var len = this.numSegments;
        for (var i = 0; i < len; i++)
        {
            var bodySeg = new Cube();
            //var bodySeg = new Cylinder(8);
            bodySeg.type = "b";
            bodySeg.color = [0, (len + i) / (len * 2 + 50),0,1];
            bodySeg.matrix = new Matrix4(startPoint);
            bodySeg.matrix.translate(0, .05, .5);
            bodySeg.matrix.rotate(g_j1Angle * -.2,1,0,0);
            startPoint = new Matrix4(bodySeg.matrix);
            taperCoeff = ((2 * len) - i) / (2 * len)
            bodySeg.matrix.scale(.1 * taperCoeff,.08,.1 * taperCoeff);
            this.shapes.push(bodySeg);
        }
        var head = new ConeFrustum(15, 2, 1);
        head.type = "hb";
        head.color = [0,.5,0,1];
        head.matrix = new Matrix4(startPoint);
        head.matrix.translate(-.06, .1, -.06);
        head.matrix.translate(0, .1 * g_j1Angle * .1, 0);
        head.matrix.rotate(g_j1Angle * 1.8,1,0,0);
        head.matrix.scale(.2, .2, -.2);
        this.shapes.push(head);
        
        var head = new ConeFrustum(15, 4, 1);
        head.type = "h1";
        head.color = [0,.5,0,1];
        head.matrix = new Matrix4(startPoint);
        head.matrix.translate(-.06, .1, -.06);
        head.matrix.translate(0, .1 * g_j1Angle * .1, 0);
        head.matrix.rotate(g_j1Angle * 1.8,1,0,0);
        head.matrix.scale(.2, .2, -.2);
        this.shapes.push(head);

        var head = new ConeFrustum(15, 4, 1);
        head.type = "h2";
        head.color = [0,.5,0,1];
        head.matrix = new Matrix4(startPoint);
        head.matrix.translate(-.06, .1, -.06);
        head.matrix.translate(0, .1 * g_j1Angle * .1, 0);
        head.matrix.rotate(g_j1Angle * 1.8,1,0,0);
        head.matrix.scale(.2, .2, .2);
        this.shapes.push(head);
        
        var eyes = new Cube();
        eyes.type = "e";
        eyes.color = [1,0,0,1];
        eyes.matrix = new Matrix4(startPoint);
        eyes.matrix.translate(-.06, .1, -.06);
        eyes.matrix.translate(0, .1 * g_j1Angle * .1, 0);
        eyes.matrix.rotate(g_j1Angle * 1.8,1,0,0);
        eyes.matrix.scale(.2, .2, .2);
        this.shapes.push(eyes);
        
        var pot = new ConeFrustum(15, 2, 1);
        pot.type = "p";
        pot.color = [.2,.2,.2,1];
        pot.matrix.translate(.05,-.4,.55);
        pot.matrix.rotate(90,1,0,0);
        pot.matrix.scale(.3, .3, .5);
        this.shapes.push(pot);
        
        var potLid = new Cylinder(15);
        potLid.type = "p";
        potLid.color = [.2,.2,.2,1];
        potLid.matrix.translate(.05,-.4,.55);
        potLid.matrix.rotate(90,1,0,0);
        potLid.matrix.scale(.3, .3, .1);
        this.shapes.push(potLid);




    }
}
