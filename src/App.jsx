import { useState } from "react";
import "./App.css";
import { Menu } from "./components/Menu";
import { Orders } from "./components/Orders";


function App() {
  return (
    <>
      <Menu />
      <Orders />
    </>
  );
}

export default App;
