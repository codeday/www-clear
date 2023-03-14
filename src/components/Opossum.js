import * as THREE from 'three';
import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Opossum({ height, width }) {
  // const [renderer, setRenderer] = useState();
  // const [camera, setCamera] = useState();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / (window.innerHeight / 2),
      0.1,
      1000,
    );

    const renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector('#bg'),
      alpha: true,
    });

    renderer.setClearColor(0x000000, 0);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight / 2);

    camera.position.set(10, 2, 0);
    renderer.render(scene, camera);

    // setRenderer(renderer);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);

    scene.add(dirLight);

    const light = new THREE.AmbientLight(0xffffff, 0.4);
    light.castShadow = true;
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();

    let opossumObj;

    loader.load('/Low_poly_opossum.glb', (gltf) => {
      gltf.scene.traverse((node) => {
        if (!node.isMesh) return;
        node.material.wireframe = true;
        node.material.color.set(0xff686b);
      });
      scene.add(gltf.scene);
      opossumObj = gltf.scene;
      opossumObj.scale.set(1.5, 1.5, 1.5);
    });

    const resizeWindow = () => {
      renderer.setSize(window.innerWidth, window.innerHeight / 2);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.aspect = window.innerWidth / (window.innerHeight / 2);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', resizeWindow);

    function animate() {
      requestAnimationFrame(animate);

      controls.enablePan = false;
      controls.enableRotate = false;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 5.0;

      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <canvas id="bg" />;
}

export default Opossum;
