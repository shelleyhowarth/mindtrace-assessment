import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as THREE from "three";
import MainPanel from "./components/MainPanel/MainPanel";
import SidePanel from "./components/SidePanel/SidePanel";
import { AppContextInterface } from "./interfaces/interfaces";

function App() {
  const [appState, setAppState] = useState({ dialog: true });
  const AppContext = React.createContext<AppContextInterface>({} as AppContextInterface);

  return (
    // <AppContext.Provider value={{ appState, setAppState }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <SidePanel></SidePanel>
        <MainPanel></MainPanel>
      </div>
    // </AppContext.Provider>
  );
}

export default App;
