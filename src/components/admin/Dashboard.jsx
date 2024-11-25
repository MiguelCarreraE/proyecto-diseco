import React, { useState, useEffect } from "react";
import { getOrdersWithTableInfo, updateOrderStatus,getAllOrders, releaseTableAndOrder } from "@/services/crud";
import { CheckCircle, Truck, XCircle } from "lucide-react";


export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  
  // Función para cargar y organizar las órdenes
  const fetchAndSortOrders = async () => {
    try {
      const fetchedOrders = await getOrdersWithTableInfo();

      // Ordenar por prioridad de estado y luego por fecha
      const sortedOrders = fetchedOrders.sort((a, b) => {
        const statusPriority = {
          "En preparación": 1,
          Listo: 2,
          Entregado: 3,
        };

        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }

        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error("Error al cargar las órdenes:", err);
      setError("No se pudieron cargar las órdenes. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    fetchAndSortOrders();
  }, []);

  // Función para cambiar el estado de la orden
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchAndSortOrders();
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      alert("No se pudo actualizar el estado de la orden.");
    }
  };

  // Función para "liberar" visualmente la orden
  const handleReleaseOrder = async (orderId, tablePath) => {
    try {
      if (!tablePath) {
        console.error(`La mesa no está asignada para la orden ${orderId}`);
        alert("Esta orden no tiene una mesa asignada.");
        return;
      }
  
      // Extraer el ID de la mesa desde la ruta completa
      const tableId = tablePath.split("/").pop(); // Extrae el ID de la mesa
  
      await releaseTableAndOrder(orderId, tableId); // Llama a la función para liberar mesa y orden
  
      // Actualizar la lista de órdenes localmente
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error al liberar la mesa:", err);
      alert("No se pudo liberar la mesa.");
    }
  };
  

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Órdenes</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-1">
              Mesa: {order.tableName || "Mesa sin asignar"}
            </p>
            <p className="text-sm text-gray-500 mb-1">Usuario: {order.userName || "Usuario no encontrado"}</p>
            <p className="font-bold text-gray-700 mb-1">
              Estado:{" "}
              <span
                className={`${
                  order.status === "En preparación"
                    ? "text-orange-500"
                    : order.status === "Listo"
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="font-bold text-gray-700 mb-1">Total: ${order.total}</p>
            <p className="text-sm text-gray-500 mb-2">{new Date(order.timestamp).toLocaleString()}</p>
            <div className="mb-2">
              <p className="font-bold mb-1">Productos:</p>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-600 bg-gray-100 p-2 rounded-md mb-1"
                >
                  <span>{item.name}</span>
                  <span>
                    ${item.price} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 justify-center mt-4">
              <button
                onClick={() => handleStatusChange(order.id, "Listo")}
                className="flex items-center  bg-green-100 text-green-600 px-2 py-2 rounded-md hover:bg-green-200"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Listo</span>
              </button>
              <button
                onClick={() => handleStatusChange(order.id, "Entregado")}
                className="flex items-center  bg-blue-100 text-blue-600 px-2 py-2 rounded-md hover:bg-blue-200"
              >
                <Truck className="w-4 h-4" />
                <span>Entregado</span>
              </button>
              {order.status === "Entregado" && (
                <button
                  onClick={() => handleReleaseOrder(order.id, order.table || null)}
                  className="flex items-center space-x-1 bg-orange-100 text-orange-600 px-3 py-2 rounded-md hover:bg-orange-200"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Liberar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
