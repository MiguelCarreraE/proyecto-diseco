import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/">Restaurant</a>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              {/*  Bienvenido, {user?.email} */}
              Bienvenido, {user.email || "Invitado"}
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};