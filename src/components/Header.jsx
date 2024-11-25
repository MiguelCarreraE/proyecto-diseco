import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { DashboardNavbar } from "../components/admin/DashboardNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {LoginNavbar} from "../components/admin/LoginNavbar"

export const Header = ({ cart, setCart }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar visibilidad del carrito

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handleAdminClick = () => {
    if (!user) {
      navigate("/login"); // Redirige al login si no está autenticado
    } else {
      navigate("/dashboard"); // Redirige al dashboard si está autenticado
    }
  };

  const handleMyOrdersClick = () => {
    navigate("/orders"); // Redirige a la página de "Mis Pedidos"
  };

  // Renderiza una Navbar diferente según la ruta actual
  if (location.pathname.startsWith("/dashboard")) {
    return (
      <DashboardNavbar
        navigate={navigate} 
        handleLogout={handleLogout} 
        user={user} 
    />
    );
  }
  if (location.pathname.startsWith("/menu")) {
    return (
      <DashboardNavbar
        navigate={navigate} 
        handleLogout={handleLogout} 
        user={user} 
    />
    );
  }
  if (location.pathname.startsWith("/login")) {
    return (
      <LoginNavbar
        handleLogout={handleLogout} // Solo necesita la función logout
      />
    );
  }

  return (
    <Navbar
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
      cart={cart}
      setCart={setCart}
      user={user}
      handleLogout={handleLogout}
      handleAdminClick={handleAdminClick}
      handleMyOrdersClick={handleMyOrdersClick}
  />
  );
};