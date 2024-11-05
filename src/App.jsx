import { useState } from "react";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <>
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <div className="container mx-auto px-4">
        {isAdmin ? <h1 className="text-3xl font-bold">Admin</h1> : <Menu />}
      </div>
    </>
  );
}

export default App;
