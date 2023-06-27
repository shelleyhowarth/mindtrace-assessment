import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";

function App() {
  const sidePanelRef = useRef<THREE.Mesh | null>(null);
  const mainPanelRef = useRef<THREE.Mesh | null>(null);
  const rectangleRef = useRef<THREE.Mesh | null>(null);
  const circleRef = useRef<THREE.Mesh | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for the canvas element

  const [isDragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setDragging(true);

    const { clientX, clientY } = e;
    const canvasBounds = canvasRef.current?.getBoundingClientRect(); // Access the canvas bounds using the ref
    if (canvasBounds) {
      const offsetX = (clientX - canvasBounds.left) / canvasBounds.width * 2 - 1;
      const offsetY = (clientY - canvasBounds.top) / canvasBounds.height * -2 + 1;
      setOffset({ x: offsetX, y: offsetY });
    }
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      e.stopPropagation();
      const { clientX, clientY } = e;
      const canvasBounds = canvasRef.current?.getBoundingClientRect(); // Access the canvas bounds using the ref
      if (canvasBounds) {
        const offsetX = (clientX - canvasBounds.left) / canvasBounds.width * 2 - 1;
        const offsetY = (clientY - canvasBounds.top) / canvasBounds.height * -2 + 1;
        setOffset({ x: offsetX, y: offsetY });
      }
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const Circle = () => {
    useFrame(() => {
      if (circleRef.current) {
        circleRef.current.position.set(-6, 2, 0); // Adjust the position here
      }
    });

    return (
      <mesh
        ref={circleRef}
        onClick={(e) => console.log("click")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <circleGeometry attach="geometry" args={[0.75, 32]} />
        <meshBasicMaterial attach="material" color="blue" />
      </mesh>
    );
  };

  const Rectangle = () => {
    useFrame(() => {
      if (rectangleRef.current) {
        rectangleRef.current.position.set(-6, 0, 0); // Adjust the position here
      }
    });

    return (
      <mesh
        ref={rectangleRef}
        onClick={(e) => console.log("click")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry attach="geometry" args={[1.5, 1.0]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
    );
  };

  const SidePanel = () => {
    useFrame(() => {
      if (sidePanelRef.current) {
        sidePanelRef.current.position.set(-6, 0, 0); // Adjust the position here
      }
    });
    return (
      <mesh
        ref={sidePanelRef}
        onClick={(e) => console.log("click")}
        onPointerOver={(e) => console.log("hover")}
        onPointerOut={(e) => console.log("unhover")}
      >
        <planeGeometry attach="geometry" args={[2.0, 10]} />
        <meshBasicMaterial attach="material" color="gray" />
      </mesh>
    );
  };

  const MainPanel = () => {
    useFrame(() => {
      if (mainPanelRef.current) {
        mainPanelRef.current.position.set(2, 0, 0); // Adjust the position here
      }
    });
    return (
      <mesh
        ref={mainPanelRef}
        onClick={(e) => console.log("click")}
        onPointerOver={(e) => console.log("hover")}
        onPointerOut={(e) => console.log("unhover")}
      >
        <planeGeometry attach="geometry" args={[11.0, 10]} />
        <meshBasicMaterial attach="material" color="gray" />
      </mesh>
    );
  };

  return (
    <div className="canvas-container">
      <Canvas ref={canvasRef}>
        <SidePanel />
        <MainPanel />
        <Rectangle />
        <Circle />
      </Canvas>
    </div>
  );
}

export default App;
