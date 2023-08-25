import * as THREE from 'three';
import { useEffect } from 'react';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box } from '@codeday/topo/Atom';

function Opossum() {
  // const [renderer, setRenderer] = useState();
  // const [camera, setCamera] = useState();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector('#bg'),
      alpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

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
      gltf.scene.traverse((node: any) => {
        if (!node.isMesh) return;
        // eslint-disable-next-line no-param-reassign
        node.material.wireframe = true;
        node.material.color.set(0xff686b);
      });
      scene.add(gltf.scene);
      opossumObj = gltf.scene;
      opossumObj.scale.set(1.5, 1.5, 1.5);
    });

    const resizeWindow = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', resizeWindow);

    function animate() {
      requestAnimationFrame(animate);

      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.enableDamping = true;
      controls.autoRotateSpeed = 15.0;
      controls.dampingFactor = 0.1;
      controls.maxPolarAngle = 2;
      controls.minPolarAngle = 1;

      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return (
    <Box h="md">
      <Box h="100vh" w="100%" position="absolute" top="0" left="0" overflow="hidden">
        <canvas id="bg" />
      </Box>
    </Box>
  );
}

export default Opossum;
