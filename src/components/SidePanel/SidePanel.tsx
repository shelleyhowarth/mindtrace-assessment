import React from "react";
import Rectangle from "../Rectangle/Rectangle";
import Circle from "../Circle/Circle";
import "./SidePanel.css";

const SidePanel = () => {
  return (
    <div className="panel">
      <div className="shape-container">
        <Circle></Circle>
        <Rectangle></Rectangle>
      </div>
    </div>
  );
};

export default SidePanel;
