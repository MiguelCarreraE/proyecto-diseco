import React, { useState, useEffect } from "react";
import { createUser, createOrder, getAvailableTables, assignTableToUser } from "@/services/crud";
import { useNavigate } from "react-router-dom";

export const PaymentForm = ({ total, cart, onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Cargar número de mesas disponibles
  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const tables = await getAvailableTables();
        setAvailableTables(tables.length);
      } catch (error) {
        console.error("Error al cargar las mesas disponibles:", error);
      }
    };
    fetchAvailableTables();
  }, []);
  
  const handlePayment = async (e) => {
    e.preventDefault();
    // Validar el formulario
    if (!cardNumber || !expiryDate || !cvv || !name) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      setError("Número de tarjeta inválido.");
      return;
    }

    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      setError("CVV inválido.");
      return;
    }

    if (!cart || cart.length === 0) {
      setError("El carrito está vacío.");
      return;
    }

    if (availableTables === 0) {
      setError("No hay mesas disponibles.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Verificar mesas disponibles
      const tables = await getAvailableTables();
      if (tables.length === 0) {
        setError("No hay mesas disponibles.");
        setLoading(false);
        return;
      }

      // Seleccionar la primera mesa disponible y asignarla al usuario
      const selectedTable = tables[0];
      await assignTableToUser(selectedTable.id, name);

      // Crear o recuperar el usuario en Firebase
      const userId = await createUser(name);
      const items = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      // Crear la orden en Firebase
      const orderData = {
        user: `/Users/${userId}`,
        table: `/Tables/${selectedTable.id}`,
        items,
        total,
        status: "En preparación",
        timestamp: new Date().toISOString(),
      };
      await createOrder(orderData);
      setOrderDetails(orderData);
      setPaymentSuccess(true);
      onPaymentSuccess(); // Limpia el carrito y cierra el formulario
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setError("Ocurrió un error al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadTicket = () => {
    if (!orderDetails) {
      console.error("No hay detalles de la orden para generar el ticket.");
      return;
    }
  
    const ticketData = `
      ¡Gracias por tu compra!
  
      Detalles del pedido:
      ---------------------
      Cliente: ${name}
      Total: $${orderDetails.total.toFixed(2)}
      Fecha: ${new Date(orderDetails.timestamp).toLocaleDateString()}
      Hora: ${new Date(orderDetails.timestamp).toLocaleTimeString()}
      
      Productos:
      ${orderDetails.items
        .map(
          (item) =>
            `- ${item.quantity || 1}x ${item.name} - $${(
              item.price * (item.quantity || 1)
            ).toFixed(2)}`
        )
        .join("\n")}
  
      ¡Esperamos que disfrutes tu comida!
    `;
  
    const blob = new Blob([ticketData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket_${new Date().getTime()}.txt`;
  
    link.click();
    URL.revokeObjectURL(url);
  };
  if (paymentSuccess) {
    
    return (
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">¡Gracias por tu compra!</h2>
        <p className="text-lg text-gray-700 mb-4">Tu pedido ha sido procesado exitosamente.</p>
        <p className="text-gray-600 mb-6">
          En breve, tu orden será preparada y enviada a tu mesa.
        </p>
        <button
          className="bg-orange-500 text-white py-2 px-4 rounded-md font-bold hover:bg-orange-600"
          onClick={handleDownloadTicket}
        >
          Descargar Ticket
        </button>
      </div>
    );
  }
  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Pago</h2>
      <p className="text-sm text-gray-600 mb-4">
        Mesas disponibles: <strong>{availableTables}</strong>
      </p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Nombre en la tarjeta</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded-md"
            placeholder="Miguel Carrera"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Número de tarjeta</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border p-2 rounded-md"
            placeholder="1234 5678 9101 1121"
            maxLength={16}
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Fecha de expiración</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="MM/AA"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CVV</label>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="123"
              maxLength={3}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Total: ${total}</span>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-bold rounded-md ${
            loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          }`}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Pagar"}
        </button>
      </form>
    </div>
  );
};