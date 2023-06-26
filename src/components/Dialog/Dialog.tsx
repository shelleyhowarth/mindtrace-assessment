import React, { useState } from "react";

const Dialog = ({isOpen}:any) => {
  return (
    <div className="container">
      <div>{isOpen && <input></input>}</div>
    </div>
  );
};

export default Dialog;
