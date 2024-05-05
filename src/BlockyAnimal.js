// HelloPoint2.js
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix; 
    uniform mat4 u_GlobalRotationMatrix; 
    uniform mat4 u_ProjectionMatrix; 
    uniform mat4 u_ViewMatrix; 
    void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform int u_TexSelect;
    varying vec2 v_UV;
    void main() {
      if (u_TexSelect == -2) {
        gl_FragColor = u_FragColor;
      }
      else if (u_TexSelect == -1) {
        gl_FragColor = vec4(v_UV,1.0,1.0);
      }
      else if (u_TexSelect == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);
      }
      else if (u_TexSelect == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      }
    }`


// Global Variables
let canvas;
let gl;
let ANIM_1 = 1;
let ANIM_2 = 2;
let ONE_COLOR = -2;
let INTERP_COLOR = -1;
let TEX_0 = 0;
let TEX_1 = 1;
let TEX_2 = 2;


let u_TexSelect;
let a_Position;
let a_UV;
let u_FragColor;
let u_Sampler0, u_Sampler1;
let u_ModelMatrix;
let u_GlobalRotationMatrix;

var g_texImage1, g_texImage2;
var g_objList = [];
var g_globalAngleX = 0;
var g_globalAngleY = 0;
var g_animDisabled = false;
var g_j1Angle = 0;
var g_j2Angle = 1;
var g_startTime = performance.now()/1000.0;
var g_secondsPassed = performance.now()/1000.0 - g_startTime;
var g_fps;
var g_oldFrameCount = 0, g_frameCount = 0;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setupHTMLElements();
    
    canvas.onmousedown = function(ev){ clickRotate(ev) }
    //canvas.onmousemove = function(ev){ click(ev) }
    initTextures(gl,0);
    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //var snake = new Snake();
    //g_objList.push(snake);
    var cube = new Cube(-1);
    cube.matrix.setTranslate(.5,-.4,0);
    cube.matrix.scale(.5,.5,.5);
    g_objList.push(cube);
    
    cube = new Cube(1);
    cube.matrix.setTranslate(-.5,-.4,0);
    cube.matrix.scale(.5,.5,.5);
    g_objList.push(cube);

    cube = new Cube(-2);
    cube.color = [0.0, 0.8, 1.0, 1.0];
    cube.matrix.setTranslate(-40,-40,-40);
    cube.matrix.scale(80,80,80);
    g_objList.push(cube);

    cube = new Cube(0);
    cube.matrix.setTranslate(-25,-.5,-25);
    cube.matrix.scale(50,.1,50);
    g_objList.push(cube);
    requestAnimationFrame(tick);
}

let sec = 0;
function tick()
{
    if (Math.round(g_secondsPassed) != sec)
    {
        sec = Math.round(g_secondsPassed);
        g_fps = (g_frameCount + g_oldFrameCount) / 2
        g_oldFrameCount = g_frameCount;
        g_frameCount = 0;
        console.log("FPS: " + g_fps);
    }
    
    g_secondsPassed = performance.now()/1000.0 - g_startTime;

    renderAllObjects();
    updateAllObjects();
    g_frameCount++;
    requestAnimationFrame(tick);
    
}


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }
    
    // Get the storage location of attribute variable
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    u_TexSelect = gl.getUniformLocation(gl.program, 'u_TexSelect');
    if (!u_TexSelect) {
        console.log('Failed to get the storage location of u_TexSelect');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
    if (!u_GlobalRotationMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotationMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) 
    {
        console.log('Failed to get storage location of u_Sampler0');
        return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) 
    {
        console.log('Failed to get storage location of u_Sampler1');
        return false;
    }
}

function setupHTMLElements() {
    const camSlider = document.getElementById("camSlider");
    if (!camSlider) {
        console.log('Failed to retrieve the camSlider element');
        return;
    }
    camSlider.addEventListener("mousemove", function() {g_globalAngleX = this.value; });

    const j1Slider = document.getElementById("j1Slider");
    if (!j1Slider) {
        console.log('Failed to retrieve the j1Slider element');
        return;
    }
    j1Slider.addEventListener("mousemove", function() {g_j1Angle = this.value; });

    const j2Slider = document.getElementById("j2Slider");
    if (!j2Slider) {
        console.log('Failed to retrieve the j2Slider element');
        return;
    }
    j2Slider.addEventListener("mousemove", function() {g_j2Angle = this.value; });

    const toggleButton = document.getElementById("toggleButton");
    if (!toggleButton) {
        console.log('Failed to retrieve the toggleButton element');
        return;
    }
    toggleButton.addEventListener("click", function() {g_animDisabled = !(g_animDisabled); });

}

function clickRotate(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_globalAngleX = 90 * x;
    g_globalAngleY = 90 * y;
}


function renderAllObjects() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var len = g_objList.length;
    //console.log("Num Shapes " + len);
    for (var i = 0; i < len; i++)  {
        g_objList[i].render();
    }
} 

function initTextures()
{
    var texImage0 = new Image();
    if(!texImage0)
    {
        console.log('Failed to create the image object');
        return false;
    }

    texImage0.onload = function(){ loadTexture(texImage0, u_Sampler0, 0); };
    texImage0.src = 'tiles.jpg';

    var texImage1 = new Image();
    if(!texImage1)
    {
        console.log('Failed to create the image object');
        return false;
    }

    texImage1.onload = function(){ loadTexture(texImage1, u_Sampler1, 1); };
    texImage1.src = 'diamond.jpg';

    return true;
}

function loadTexture(image, sampler, n)
{
    var texture = gl.createTexture();
    if (!texture) 
    {
        console.log('Failed to create Texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    if (n == 0)
    {
        gl.activeTexture(gl.TEXTURE0);
    }
    else if (n == 1)
    {
        gl.activeTexture(gl.TEXTURE1);
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(sampler, n);

    console.log('Texture Loaded');
}


function updateAllObjects() {
    var grm = new Matrix4().rotate(-g_globalAngleX,0,1,0);
    grm.rotate(g_globalAngleY,1,0,0);
    gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, grm.elements);

    var projMat = new Matrix4();
    projMat.setPerspective(90, canvas.width/canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(0,0,-1, 0,0,0, 0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    
    var len = g_objList.length;
    //console.log("Num Shapes " + len);
    for (var i = 0; i < len; i++)  {
        g_objList[i].update();
    }  
} 
