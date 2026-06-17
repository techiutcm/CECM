"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ROCKET_TEXTURE_PATH = "/admission-rocket.png";

const COLORS = {
  flameCore: 0xffc400,
  flameMid: 0xff8f00,
  flameTip: 0xff5c33,
};

interface FlameLayer {
  mesh: THREE.Mesh;
  baseOpacity: number;
  phase: number;
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

function createFlameGroup() {
  const flameGroup = new THREE.Group();
  flameGroup.position.y = -0.92;

  const flameSpecs = [
    { color: COLORS.flameCore, radius: 0.22, height: 0.48, opacity: 0.98, phase: 0, additive: false },
    { color: COLORS.flameMid, radius: 0.17, height: 0.68, opacity: 0.82, phase: 1.3, additive: true },
    { color: COLORS.flameTip, radius: 0.11, height: 0.9, opacity: 0.62, phase: 2.1, additive: true },
  ];

  const flameLayers: FlameLayer[] = flameSpecs.map((spec) => {
    const material = new THREE.MeshBasicMaterial({
      color: spec.color,
      transparent: true,
      opacity: spec.opacity,
      depthWrite: false,
      blending: spec.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(spec.radius, spec.height, 20, 1, true),
      material,
    );
    mesh.rotation.x = Math.PI;
    flameGroup.add(mesh);

    return {
      mesh,
      baseOpacity: spec.opacity,
      phase: spec.phase,
    };
  });

  const nozzleGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffb300,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
    }),
  );
  nozzleGlow.position.y = 0.02;
  flameGroup.add(nozzleGlow);

  return { flameGroup, flameLayers, nozzleGlow };
}

export function AdmissionRocketScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.05, 3.8);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const rocket = new THREE.Group();
    const { flameGroup, flameLayers, nozzleGlow } = createFlameGroup();

    const textureLoader = new THREE.TextureLoader();
    const rocketTexture = textureLoader.load(ROCKET_TEXTURE_PATH);
    rocketTexture.colorSpace = THREE.SRGBColorSpace;

    const rocketPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 2.15),
      new THREE.MeshBasicMaterial({
        map: rocketTexture,
        transparent: true,
        alphaTest: 0.08,
        depthWrite: false,
      }),
    );
    rocketPlane.position.y = 0.12;
    rocket.add(rocketPlane);
    rocket.add(flameGroup);

    rocket.rotation.z = -0.1;
    scene.add(rocket);

    const warmLight = new THREE.PointLight(0xffa020, 0.35, 6);
    warmLight.position.set(0, -0.8, 1.2);
    scene.add(warmLight);

    const clock = new THREE.Clock();
    let frameId = 0;

    function animate() {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      rocket.position.y = Math.sin(elapsed * 2.1) * 0.05;
      rocket.position.x = Math.sin(elapsed * 1.4) * 0.02;
      rocket.rotation.z = -0.1 + Math.sin(elapsed * 1.6) * 0.02;

      flameLayers.forEach((layer, index) => {
        const flicker =
          1 +
          Math.sin(elapsed * 14 + layer.phase) * 0.14 +
          Math.sin(elapsed * 21 + index) * 0.08;
        layer.mesh.scale.set(1 + Math.sin(elapsed * 11 + index) * 0.06, flicker, 1);

        const material = layer.mesh.material as THREE.MeshBasicMaterial;
        material.opacity =
          layer.baseOpacity * (0.82 + Math.sin(elapsed * 12 + layer.phase) * 0.14);
      });

      flameGroup.scale.x = 1 + Math.sin(elapsed * 16) * 0.05;
      nozzleGlow.scale.setScalar(0.95 + Math.sin(elapsed * 18) * 0.12);

      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      const nextWidth = container!.clientWidth;
      const nextHeight = container!.clientHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      rocketTexture.dispose();
      disposeObject(rocket);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden />;
}
