// Original here https://twitter.com/etiennejcb/status/1092882184321548289
// Original Code: https://gist.github.com/Bleuje/094d45a8cb11d16ce002d014ba761559
class ThreeBasic {
  constructor(withControls = false) {
    this.hasControls = withControls;
    this.useControls = false;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.controls = null;
  }
  init() {
    const VIEW_ANGLE = 45,
      ASPECT = window.innerWidth / window.innerHeight,
      NEAR = 0.1,
      FAR = 10000;
    const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 30;
    if (this.hasControls) {
      this.controls = new THREE.OrbitControls(camera);
    }

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    document.body.appendChild(renderer.domElement);

    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.onResize();
  }
  add(mesh) {
    this.scene.add(mesh);
  }
  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // uniforms.u_res.value.x = renderer.domElement.width;
    // uniforms.u_res.value.y = renderer.domElement.height;
    this.camera.aspect = window.innerWidth / window.innerHeight;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
const App = new ThreeBasic(true);
App.init();

const config = {
  innerSize: 10,
  ringSize: 0.5,
  outerSize: 10.5,
  segments: 164,
};
const getShaders = (name, options) => {
  const shaders = {
    fragmentShader: (
      document.getElementById(name + "-fragment") ||
      document.getElementById("fragment")
    ).textContent,
    vertexShader: (
      document.getElementById(name + "-vertex") ||
      document.getElementById("vertex")
    ).textContent,
  };
  if (options) {
    if (options.noise === true) {
      const noise = document.getElementById("noise");
      if (noise) {
        shaders.fragmentShader = noise.textContent + shaders.fragmentShader;
        shaders.vertexShader = noise.textContent + shaders.vertexShader;
      } else {
        console.error("NOISE NOT FOUND");
      }
    }
  }

  return shaders;
};
// CODE GOES HERE
const uniforms = {
  u_time: { type: "f", value: 0 },
  u_innerSize: { type: "f", value: config.baseSize },
  u_outerSize: { type: "f", value: config.outer },
  u_segments: { type: "f", value: config.segments },
  u_middleSize: { type: "f", value: config.innerSize + config.ringSize / 2 },
};
let squareGeo = new THREE.RingBufferGeometry(
  config.innerSize,
  config.outerSize,
  config.segments
);
const squareMat = new THREE.ShaderMaterial({
  uniforms,
  ...getShaders("s", { noise: true }),
});
const squareMesh = new THREE.Points(squareGeo, squareMat);
const createGeo = (innerSize, outerSize, segments) => {
  var geometry = new THREE.BufferGeometry();
  var vertices = [];
  var vertex = new THREE.Vector3();
  const slice = (Math.PI * 2) / segments;
  for (var i = 0; i < segments; i++) {
    vertex.x = Math.cos(slice * i);
    vertex.y = Math.sin(slice * i);
    vertex.z = 0;
    vertices.push(vertex.x * innerSize, vertex.y * innerSize, vertex.z);
    vertices.push(vertex.x * outerSize, vertex.y * outerSize, vertex.z);
  }
  geometry.addAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  return geometry;
};
let lineRingGeometry = createGeo(
  config.innerSize,
  config.outerSize,
  config.segments
);
let lineRingMaterial = new THREE.ShaderMaterial({
  uniforms,
  ...getShaders("line", { noise: true }),
});
const lineRingMesh = new THREE.LineSegments(lineRingGeometry, lineRingMaterial);

const ringSize = 0.1;
let ringGeometry = new THREE.RingBufferGeometry(
  config.outerSize - ringSize / 2,
  config.outerSize + ringSize / 2,
  config.segments
);
const ringMaterial = new THREE.ShaderMaterial({
  uniforms,
  ...getShaders("ring", { noise: true }),
});
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

const smallRingSize = 0.05;
let smallRingGeometry = new THREE.RingBufferGeometry(
  config.innerSize + config.ringSize / 2 - smallRingSize / 2,
  config.innerSize + config.ringSize / 2 + smallRingSize / 2,
  config.segments
);
const smallRingMaterial = new THREE.ShaderMaterial({
  uniforms,
  ...getShaders("small", { noise: true }),
});
const smallRingMesh = new THREE.Mesh(smallRingGeometry, smallRingMaterial);
// Adding materials
App.add(squareMesh);
App.add(lineRingMesh);
App.add(ringMesh);
App.add(smallRingMesh);

//
let stats = new Stats();
stats.showPanel(0);
stats.domElement.className = "stats";
document.body.appendChild(stats.domElement);
/*
pow(
  (1 + noise.eval(
   4 * SEED + scl * pos.x/2,
   scl * pos.y / 2 + mr * cos(TWO_PI*t),
   scl * pos.z / 2 + mr * sin(TWO_PI*t))
  )/2,
  4.0);
*/
const gui = new dat.GUI();
// Gui controls go here

const update = () => {
  uniforms.u_time.value += 0.005;
};
function draw() {
  stats.begin();
  App.render();
  stats.end();
  update();

  requestAnimationFrame(draw);
}
function init() {
  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  App.onResize();
});
window.addEventListener("mousemove", (e) => {
  // uniforms.u_mouse.value.x = e.clientX/window.innerWidth;
  // uniforms.u_mouse.value.y = e.clientY/window.innerHeight;
});

init();
