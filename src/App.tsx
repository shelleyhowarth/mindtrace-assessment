import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as THREE from "three";
import Modal from "react-modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rectangleWidth, setRectangleWidth] = useState(0);
  const [rectangleHeight, setRectangleHeight] = useState(0);

  const rectangleRef = useRef<THREE.Mesh | null>(null);
  const circleRef = useRef<THREE.Mesh | null>(null);
  const sidePanelRef = useRef<THREE.Mesh | null>(null);
  const mainPanelRef = useRef<THREE.Mesh | null>(null);

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

      if (targetMesh.userData.draggable) {
        isDragging = true;
        draggedObject = targetMesh;
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
      }
    }
  };

  const handlePointerMove = (event: any) => {
    event.stopPropagation();
    if (isDragging && draggedObject) {
      const delta = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };
      draggedObject.position.x += delta.x / 50;
      draggedObject.position.y -= delta.y / 50;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  const handlePointerUp = (event: any) => {
    if (
      draggedObject &&
      (draggedObject as THREE.Mesh).userData?.shape === "rectangle"
    ) {
      setIsModalOpen(true);
    }

    event.stopPropagation();
    isDragging = false;
    draggedObject = null;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  const handleSubmitDimensions = () => {
    // Perform validation on the entered dimensions if needed
    const isValidWidth = rectangleWidth % 5 === 0 && rectangleWidth >= 10 && rectangleWidth <= 70;
    const isValidHeight = rectangleHeight % 5 === 0 && rectangleHeight >= 10 && rectangleHeight <= 70;
  
    if (!isValidWidth || !isValidHeight) {
      console.log("Invalid dimensions. Please enter values divisible by 5 and between 10 and 70 (inclusive).");
      return;
    }

    // Store the rectangle dimensions in state or perform any other desired action
    console.log("Rectangle Width:", rectangleWidth);
    console.log("Rectangle Height:", rectangleHeight);

    // Close the modal
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    scene.clear();

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    divRef.current?.appendChild(renderer.domElement);

    // Create the side panel geometry
    const sidePanelGeometry = new THREE.PlaneGeometry(10, 25);
    const sidePanelMaterial = new THREE.MeshBasicMaterial({ color: 0xcfbfbe });

    // Create the main panel geometry
    const mainPanelGeometry = new THREE.PlaneGeometry(30, 30);
    const mainPaneleMaterial = new THREE.MeshBasicMaterial({ color: 0xeef5fb });

    // Create the rectangle geometry
    const rectangleGeometry = new THREE.PlaneGeometry(5, 3.5);
    const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x964b00 });

    // Create the circle geometry
    const circleGeometry = new THREE.CircleGeometry(2.5, 32); //2.5 is the radius
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xcc0000 });

    // Create the rectangle mesh
    const rectangleMesh = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
    rectangleMesh.position.set(-10, -5, -10); // Adjust the position to be behind the box
    rectangleRef.current = rectangleMesh;
    rectangleMesh.userData.draggable = true;
    rectangleMesh.userData.shape = "rectangle";

    // Create the circle mesh
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.position.set(-10, 5, -10); // Adjust the position to be behind the box
    circleRef.current = circleMesh;
    circleMesh.userData.draggable = true;

    // Create the side panel mesh
    const sidePanelMesh = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
    sidePanelMesh.position.set(-15, 0, -15); // Adjust the position to be behind the box
    sidePanelRef.current = sidePanelMesh;
    sidePanelMesh.userData.draggable = false;

    // Create the main panel mesh
    const mainPanelMesh = new THREE.Mesh(mainPanelGeometry, mainPaneleMaterial);
    mainPanelMesh.position.set(10, 0, -15); // Adjust the position to be behind the box
    mainPanelRef.current = mainPanelMesh;
    mainPanelMesh.userData.draggable = false;

    // Add the shapes to the scene
    scene.add(rectangleMesh);
    scene.add(circleMesh);
    scene.add(sidePanelMesh);
    scene.add(mainPanelMesh);

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
      style={{ width: "100vw", height: "100vh", position: "absolute" }}
      onPointerDown={handlePointerDown}
    >
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <h2>Enter Rectangle Dimensions</h2>
        <label>
          Width:
          <input
            type="number"
            value={rectangleWidth}
            onChange={(e) => setRectangleWidth(parseInt(e.target.value))}
          />
        </label>
        <br />
        <label>
          Height:
          <input
            type="number"
            value={rectangleHeight}
            onChange={(e) => setRectangleHeight(parseInt(e.target.value))}
          />
        </label>
        <br />
        <button onClick={handleSubmitDimensions}>Submit</button>
      </Modal>
    </div>
  );
}

export default App;
