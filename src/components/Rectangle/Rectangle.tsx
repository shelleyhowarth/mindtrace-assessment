import React, {useRef, useEffect} from "react";
import "./Rectangle.css";
import * as THREE from 'three';

const Rectangle = () => {
  const rectRef = useRef<THREE.Mesh | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let draggedObject: THREE.Mesh | null = null;
  const raycaster = new THREE.Raycaster();
  const scene = new THREE.Scene();
  // Create the camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const handlePointerDown = (event: any) => {
    event.stopPropagation();

    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const targetMesh = intersects[0].object as THREE.Mesh;
      isDragging = true;
      draggedObject = targetMesh;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    }
  };

  const handlePointerMove = (event: any) => {
    event.stopPropagation();
    if (isDragging && draggedObject) {
      const delta = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };
      draggedObject.position.x += delta.x / 100;
      draggedObject.position.y -= delta.y / 100;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    isDragging = false;
    draggedObject = null;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  useEffect(() => {
    scene.clear()
    
    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    divRef.current?.appendChild(renderer.domElement);

    // Create the rectangle geometry
    const rectGeometry = new THREE.PlaneGeometry(2, 1.5);

    // Create the rectangle material
    const rectMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 });

    // Create the rectangle mesh
    const rectMesh = new THREE.Mesh(rectGeometry, rectMaterial);
    rectMesh.position.set(0, 0, -2); // Adjust the position to be behind the box
    rectRef.current = rectMesh;
    rectMesh.userData.mesh = rectMesh; // Assign userData


    // Add the rectangle mesh to the scene
    scene.add(rectMesh);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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
