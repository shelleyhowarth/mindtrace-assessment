import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "react-use-gesture";
import Modal from "react-modal";
import * as THREE from "three";

import "./App.css";

function App() {
  const sidePanelRef = useRef(null);
  const mainPanelRef = useRef(null);
  const rectangleRef = useRef(null);
  const circleRef = useRef(null);
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState("");
  const [circles, setCircles] = useState([]);
  const [rectangles, setRectangles] = useState([]);

  const positionRef = useRef([-5.5, 0, 0]);

  const handleDimensionSubmit = () => {
    const { width, height } = dimensions;
    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);

    inputValidation(parsedWidth, parsedHeight);

    if (error === "") {
      const newPosition = positionRef.current;
      const newRectangle = {
        width: parsedWidth / 10,
        height: parsedHeight / 10,
        position: newPosition,
        apples: 0,
      };

      const isOverlapping = rectangles.some((rectangle) => {
        const rectA = {
          x1: newPosition[0],
          y1: newPosition[1],
          x2: newPosition[0] + newRectangle.width,
          y2: newPosition[1] + newRectangle.height,
        };

        const rectB = {
          x1: rectangle.position[0],
          y1: rectangle.position[1],
          x2: rectangle.position[0] + rectangle.width,
          y2: rectangle.position[1] + rectangle.height,
        };

        return (
          rectA.x1 < rectB.x2 &&
          rectA.x2 > rectB.x1 &&
          rectA.y1 < rectB.y2 &&
          rectA.y2 > rectB.y1
        );
      });

      if (isOverlapping) {
        setError("The new rectangle overlaps with existing rectangles.");
      } else {
        setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
        positionRef.current = [-5.5, 0, 0];
        setDimensions({ width: 0, height: 0 });
        setShowModal(false);
        setError("");
      }
    }
  };

  const inputValidation = (width, height) => {
    if (isNaN(width) || isNaN(height)) {
      setError("Please enter numeric values for width and height.");
    } else if (width % 5 !== 0 || height % 5 !== 0) {
      setError("Width and height must be divisible by 5.");
    } else if (width < 10 || width > 70 || height < 10 || height > 70) {
      setError("Width and height must be between 10 and 70 (inclusive).");
    } else if (width === height) {
      setError("Width and height cannot be equal");
    } else {
      setError("");
    }
  };

  const onCircleDrop = (position) => {
    const newCircle = {
      position: position,
    };
    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  const Circle = () => {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const [position, setPosition] = useState([-4.5, 2, 1]);

    const bind = useDrag(({ offset: [x, y] }) => {
      const newPosition = [x / aspect, -y / aspect, 1];
      setPosition(newPosition);
    });

    useFrame(() => {
      if (circleRef.current) {
        circleRef.current.position.set(...position);
      }
    });

    return (
      <mesh
        position={position}
        {...bind()}
        ref={circleRef}
        onClick={(e) => onCircleDrop(position)}
      >
        <circleGeometry attach="geometry" args={[0.3, 32]} />
        <meshBasicMaterial attach="material" color="blue" />
      </mesh>
    );
  };

  const CustomRectangle = ({ width, height, position }) => {
    return (
      <mesh position={position}>
        <planeGeometry attach="geometry" args={[width, height]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
    );
  };

  const CustomCircle = ({ position }) => {
    return (
      <mesh position={position}>
        <circleGeometry attach="geometry" args={[0.3, 32]} />
        <meshBasicMaterial attach="material" color="blue" />
      </mesh>
    );
  };

  const Rectangle = () => {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    const bind = useDrag(({ offset: [x, y] }) => {
      const newPosition = [x / aspect, -y / aspect, 0];
      positionRef.current = newPosition;
    });

    useFrame(() => {
      if (rectangleRef.current) {
        rectangleRef.current.position.set(...positionRef.current);
      }
    });

    return (
      <mesh
        position={positionRef.current}
        {...bind()}
        ref={rectangleRef}
        onClick={() => {
          setShowModal(true);
        }}
      >
        <planeGeometry attach="geometry" args={[1.5, 1.0]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
    );
  };

  const SidePanel = () => {
    useFrame(() => {
      if (sidePanelRef.current) {
        sidePanelRef.current.position.set(-8, 0, -2);
      }
    });

    return (
      <>
        <mesh ref={sidePanelRef}>
          <planeGeometry attach="geometry" args={[3.5, 15]} />
          <meshBasicMaterial attach="material" color="gray" />
        </mesh>
      </>
    );
  };

  const MainPanel = () => {
    useFrame(() => {
      if (mainPanelRef.current) {
        mainPanelRef.current.position.set(2, 0, -2);
      }
    });

    return (
      <mesh ref={mainPanelRef}>
        <planeGeometry attach="geometry" args={[15.0, 15]} />
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
        {rectangles.map((rectangle, index) => (
          <CustomRectangle
            key={index}
            width={rectangle.width}
            height={rectangle.height}
            position={rectangle.position}
          />
        ))}
        {circles.map((circle, index) => (
          <CustomCircle key={index} position={circle.position} />
        ))}
      </Canvas>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Enter Dimensions"
      >
        <h3>Enter Dimensions</h3>
        <input
          type="number"
          placeholder="Width"
          value={dimensions.width}
          onChange={(e) =>
            setDimensions((prev) => ({ ...prev, width: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Height"
          value={dimensions.height}
          onChange={(e) =>
            setDimensions((prev) => ({ ...prev, height: e.target.value }))
          }
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleDimensionSubmit}>Submit</button>
      </Modal>
    </div>
  );
}

export default App;
