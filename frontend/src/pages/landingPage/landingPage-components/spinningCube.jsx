import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function SpinningCube() {
  const mountRef = useRef(null);
  let frameId;

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Cube (slightly bigger and vibrant color)
    const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.5, metalness: 0.6 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(-2, 1.5, 0);
    scene.add(cube);

    // Tetrahedron
    const tetraGeo = new THREE.TetrahedronGeometry(1.8);
    const tetraMat = new THREE.MeshStandardMaterial({ color: 0x00bcd4, roughness: 0.5, metalness: 0.5 });
    const tetra = new THREE.Mesh(tetraGeo, tetraMat);
    tetra.position.set(2, 1.5, 0);
    scene.add(tetra);

    // Cone
    const coneGeo = new THREE.ConeGeometry(1.2, 2.4, 32);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.5, metalness: 0.5 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, -2, 0);
    scene.add(cone);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Animate (slightly slower)
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      cube.rotation.x += 0.005;
      cube.rotation.y += 0.004;

      tetra.rotation.x += 0.0045;
      tetra.rotation.y += 0.0035;

      cone.rotation.y += 0.007;
      cone.rotation.x += 0.003;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
