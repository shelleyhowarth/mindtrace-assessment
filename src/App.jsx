import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "react-use-gesture";
import Modal from "react-modal";

import "./App.css";

function App() {
  const sidePanelRef = useRef(null);
  const mainPanelRef = useRef(null);
  const rectangleRef = useRef(null);
  const circleRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas element
  const [showModal, setShowModal] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState("");
  const [rectangles, setRectangles] = useState([]);
  const [rectanglePosition, setRectanglePosition] = useState([-5.5, 0, 0]); // Declare position state here

  const handleDimensionSubmit = () => {
    const { width, height } = dimensions;
    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);

    inputValidation(parsedWidth, parsedHeight);
    console.log(setError);
    if (error === "") {
      const newRectangle = {
        width: parsedWidth / 10,
        height: parsedHeight / 10,
        position: rectanglePosition,
      };

      setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
      setRectanglePosition([-5.5, 0, 0]);
      setDimensions({ width: 0, height: 0 });
      setShowModal(false);
      setError("");
      console.log("Dimensions:", rectangles);
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
    }
  };

  const Circle = () => {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const [position, setPosition] = useState([-4.5, 2, 1]); // Declare position state here

    const bind = useDrag(({ offset: [x, y] }) => {
      setPosition([x / aspect, -y / aspect, 1]);
    });

    return (
      <mesh
        position={position}
        {...bind()}
        ref={circleRef}
        onClick={(e) => console.log("click")}
      >
        <circleGeometry attach="geometry" args={[0.5, 32]} />
        <meshBasicMaterial attach="material" color="blue" />
      </mesh>
    );
  };

  const CustomRectangle = ({ width, height, position }) => {
    return (
      <mesh position={position}>
        <planeGeometry attach="geometry" args={[width, height]} />
        <meshBasicMaterial attach="material" color="green" />
      </mesh>
    );
  };

  const Rectangle = () => {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const [rectanglePosition, setRectanglePosition] = useState([-5.5, 0, 0]); // Declare position state here

    const bind = useDrag(({ offset: [x, y] }) => {
      setRectanglePosition([x / aspect, -y / aspect, 0]);
      console.log(rectanglePosition);
    });

    return (
      <mesh
        position={rectanglePosition}
        {...bind()}
        ref={rectangleRef}
        onClick={() => setShowModal(true)}
      >
        <planeGeometry attach="geometry" args={[1.5, 1.0]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
    );
  };

  const SidePanel = () => {
    useFrame(() => {
      if (sidePanelRef.current) {
        sidePanelRef.current.position.set(-8, 0, -2); // Adjust the position here
      }
    });
    return (
      <mesh
        ref={sidePanelRef}
        onClick={(e) => console.log("click")}
        onPointerOver={(e) => console.log("hover")}
        onPointerOut={(e) => console.log("unhover")}
      >
        <planeGeometry attach="geometry" args={[3.5, 15]} />
        <meshBasicMaterial attach="material" color="gray" />
      </mesh>
    );
  };

  const MainPanel = () => {
    useFrame(() => {
      if (mainPanelRef.current) {
        mainPanelRef.current.position.set(2, 0, -2); // Adjust the position here
      }
    });
    return (
      <mesh
        ref={mainPanelRef}
        onClick={(e) => console.log("click")}
        onPointerOver={(e) => console.log("hover")}
        onPointerOut={(e) => console.log("unhover")}
      >
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
          />
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
