import { useState } from "react";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Login } from "./components/admin/Login";
import { AuthProvider } from "./components/context/AuthContext";
import { Dashboard } from "./components/admin/Dashboard";
import { PublicRoute } from "./components/admin/PublicRoute";
import { PrivateRoute } from "./components/admin/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Orders } from "./components/user/Orders";
import { CreateDishForm } from "./components/admin/CreateDishForm";
import {MenuAdmin}from "./components/admin/MenuAdmin"
import { EditDishForm } from "./components/admin/EditDishForm";
import { CreateTableForm } from "./components/admin/CreateTableForm";
function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.name === product.name);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <Router>
      <AuthProvider>
        {/* Header ajusta la Navbar automáticamente */}
        <Header cart={cart} setCart={setCart} />
        <Routes>
          <Route path="/" element={<Menu addToCart={addToCart} />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route path="/orders" element={<Orders />} />
          <Route 
            path="/menu" 
            element={
            <PrivateRoute>
                <MenuAdmin />
            </PrivateRoute>} />
          <Route 
            path="/tables" 
            element={
            <PrivateRoute>
                <CreateTableForm />
            </PrivateRoute>} />
          <Route
            path="/menu/agregar"
            element={
              <PrivateRoute>
                <CreateDishForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu/editar/:name"
            element={
              <PrivateRoute>
                <EditDishForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;