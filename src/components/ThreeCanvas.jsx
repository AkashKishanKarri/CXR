import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, ContactShadows, useGLTF, useAnimations, useFBX } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Standalone floating highly realistic Meta Quest headset instead of a character
const StandaloneVRHeadsetModel = () => {
  const scrollGroupRef = useRef();
  const pointerGroupRef = useRef();

  // Load the actual Meta Quest 3 model provided by the user
  const { scene: questScene } = useGLTF('/meta-quest-3/source/Quest3.glb');

  // Load the Quest 2 Controller FBX model provided by the user
  const controllerScene = useFBX('/quest-2-controller/source/Quest2Controller.fbx');

  // Mouse interaction for subtle look-around idle motion (applied to the entire model root wrapper)
  useFrame(({ pointer, clock }) => {
    const time = clock.getElapsedTime();
    if (pointerGroupRef.current) {
      // Parallax layout mapping pointing cursor coordinates to slight body twisting
      gsap.to(pointerGroupRef.current.rotation, {
        y: (pointer.x * Math.PI) / 6,
        x: (-pointer.y * Math.PI) / 8,
        duration: 2,
        ease: 'power2.out',
      });
    }
  });

  // Setup GSAP ScrollTrigger identical to before to maintain scrolling integrity
  useEffect(() => {
    if (!scrollGroupRef.current) return;

    const ctx = gsap.context(() => {
      // Hero section tween
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
      tl.to(scrollGroupRef.current.position, { z: 2, ease: "none" })
        .to(scrollGroupRef.current.rotation, { z: -Math.PI / 12, ease: "none" }, 0);

      // About section tween
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: '#about-section',
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        }
      });
      tl2.to(scrollGroupRef.current.position, { x: 1.5, z: -1, ease: 'none' })
        .to(scrollGroupRef.current.rotation, { y: Math.PI / 2.5, ease: 'none' }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <group ref={scrollGroupRef} position={[0, -0.5, 0]} scale={[1.8, 1.8, 1.8]}>
      <group ref={pointerGroupRef}>

        {/* Floating Element: Meta Quest 3 */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
          {/* The scale / rotation values act as tuning for standard `.glb` raw dimensions */}
          <primitive object={questScene} rotation={[0, 0, 0]} scale={[5, 5, 5]} position={[0, 0.5, 0]} />

          {/* Abstract distorted mesh hovering behind/in the lenses to signify VR magic */}
          <mesh position={[0, 0.6, 0.1]}>
            <boxGeometry args={[0.5, 0.2, 0.1]} />
            <MeshDistortMaterial color="#00ffd5" speed={3} roughness={0.2} metalness={1} distort={0.2} transparent opacity={0.4} />
          </mesh>
        </Float>

        {/* Floating Element: Meta Quest 2 Controller (positioned beneath headset) */}
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.8}>
          <primitive object={controllerScene} rotation={[0.4, 0, 0]} scale={[0.015, 0.015, 0.015]} position={[0, -0.6, 0]} />
        </Float>

        {/* Floating fine tech rings surrounding the headset */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.015, 16, 128]} />
          <meshStandardMaterial color="#00ffd5" emissive="#007367" emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.01, 16, 128]} />
          <meshStandardMaterial color="#00ffd5" emissive="#007367" emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>

      </group>
    </group>
  );
};

useGLTF.preload('/meta-quest-3/source/Quest3.glb');

const ThreeCanvas = () => {
  return (
    <div id="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-10, -10, -5]} color="#007367" intensity={2} />
        <Suspense fallback={null}>
          <StandaloneVRHeadsetModel />
        </Suspense>
        {/* Ground shadow for depth */}
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#007367" />

        <Environment preset="city" />

        {/* Controls optional, but user interaction is via mouse position tracked in useFrame */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;