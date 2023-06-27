import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useDrag, useGesture } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";

import "./App.css";

function App() {
  const sidePanelRef = useRef(null);
  const mainPanelRef = useRef(null);
  const rectangleRef = useRef(null);
  const circleRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas element

  const Circle = () => {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const [position, setPosition] = useState([-6, 2, 0]); // Declare position state here

    const bind = useDrag(({ offset: [x, y] }) => {
      setPosition([x / aspect, -y / aspect, 0]);
    });

    return (
      <mesh
        position={position}
        {...bind()}
        ref={circleRef}
        onClick={(e) => console.log("click")}
      >
        <circleGeometry attach="geometry" args={[0.75, 32]} />
        <meshBasicMaterial attach="material" color="blue" />
      </mesh>
    );
  };

  const Rectangle = () => {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const [position, setPosition] = useState([-6, 0, 0]); // Declare position state here

    const bind = useDrag(({ offset: [x, y] }) => {
      setPosition([x / aspect, -y / aspect, 0]);
    });

    return (
      <mesh
        position={position}
        {...bind()}
        ref={rectangleRef}
        onClick={(e) => console.log("click")}
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