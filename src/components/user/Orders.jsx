import React, { useState } from "react";
import { getOrders } from "@/services/crud";

export const Orders = () => {
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setOrders([]);
    if (!name) {
      setError("Por favor, ingresa un nombre.");
      return;
    }

    try {

      const userOrders = await getOrders(name);

      if (userOrders.length === 0) {
        setError("No se encontraron órdenes para este usuario.");
      } else {
        // Ordenar las órdenes por timestamp de más reciente a más antigua
        const sortedOrders = userOrders.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error al buscar órdenes:", error);
      setError("Hubo un problema al buscar las órdenes. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Mis Órdenes</h1>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-64 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
          >
            Buscar Órdenes
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {orders.map((order) => (
          <div key={order.id} className="border p-6 rounded-lg mb-6 shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-orange-600">Orden ID: {order.id}</h2>
              <p className="text-sm text-gray-500">
                {new Date(order.timestamp).toLocaleString()}
              </p>
            </div>
            <p className="mb-2">
              <span className="font-semibold">Estado: </span>
              <span
                className={`font-bold ${
                  order.status === "En preparación" ? "text-yellow-600" : "text-green-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Total: </span>
              <span className="text-xl font-bold text-green-700">${order.total}</span>
            </p>
            <div className="mt-4">
              <h3 className="text-md font-bold text-gray-700 mb-2">Productos:</h3>
              {order.items && order.items.length > 0 ? (
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 rounded-md p-2"
                    >
                      <div>
                        <span className="font-semibold">{item.name}</span>
                        <p className="text-sm text-gray-600">
                          ${item.price} x {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-800">
                        ${item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay productos en esta orden.</p>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && !error && (
          <p className="text-gray-500 text-center">No hay órdenes para mostrar.</p>
        )}
      </div>
    </div>
  );
};