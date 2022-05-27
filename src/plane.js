import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader } from "./shaders/fragment";
import { vertexShader } from "./shaders/vertex";
import bbAngel from "./img/bb-angel.jpg";

export default function ImagePlane() {
  const PLANE_SIZE = 4.0;
  const meshRef = useRef();
  const imgTexture = useLoader(THREE.TextureLoader, bbAngel);
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();

  let mouse = useRef(null);
  useEffect(() => {
    const update = (e) => {
      mouse.current = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", update);
    return () => {
      window.removeEventListener("pointermove", update);
    };
  }, []);

  useFrame(({ camera }) => {
    const elapsedTime = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = elapsedTime;
    }
    // get mouse pos
    if (mouse.current !== null) {
      raycaster.setFromCamera(mouse.current, camera);
      const intersects = raycaster.intersectObjects([meshRef.current]);
      if (intersects.length) {
        const point = new THREE.Vector2(intersects[0].uv.x, intersects[0].uv.y);
        meshRef.current.material.uniforms.uMousePos.value = point;
      }
    }
  });
  return (
    <mesh ref={meshRef}>
      <planeBufferGeometry args={[PLANE_SIZE, 5.0, 1, 1]} />
      <shaderMaterial
        uniforms={{
          uColor: { value: new THREE.Color("white") },
          uPlaneSize: { value: new THREE.Vector2(PLANE_SIZE, PLANE_SIZE) },
          uImageSize: { value: new THREE.Vector2("600px", "600px") },
          uTime: { value: 0.0 },
          uMouseRadius: { value: 0.0 },
          uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
          uTexture: { value: imgTexture },
          uSpikes: { value: 1.5 }, // adjust the waviness
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        // wireframe={true}
      />
    </mesh>
  );
}
