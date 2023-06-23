import React, {useRef, useEffect} from "react";
import "./Rectangle.css";
import * as THREE from 'three';

const Rectangle = () => {

  const boxRef = useRef<THREE.Mesh | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<THREE.Mesh | null>(null);

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event: any) => {
    event.stopPropagation();
    if (isDragging && boxRef.current) {
      const delta = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };
      boxRef.current.position.x += delta.x / 100;
      boxRef.current.position.y -= delta.y / 100;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    divRef.current?.appendChild(renderer.domElement);

    // Create the box geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Create the material
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Create the box mesh
    const boxMesh = new THREE.Mesh(geometry, material);
    boxRef.current = boxMesh;
    

    // Add the box mesh to the scene
    scene.add(boxMesh);

     // Create the rectangle geometry
     const rectGeometry = new THREE.PlaneGeometry(2, 1.5);

     // Create the rectangle material
     const rectMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 });
 
     // Create the rectangle mesh
     const rectMesh = new THREE.Mesh(rectGeometry, rectMaterial);
     rectMesh.position.set(0, 0, -2); // Adjust the position to be behind the box
     rectRef.current = rectMesh;
 
     // Add the rectangle mesh to the scene
     scene.add(rectMesh);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      boxMesh.rotation.x += 0.01;
      boxMesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      divRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={divRef}
      style={{ width: '100vw', height: '100vh', position: 'absolute' }}
      onPointerDown={handlePointerDown}
    />
  );};

export default Rectangle;
