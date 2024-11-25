import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createTable } from "@/services/crud"; // Ajusta la ruta si es necesario

export const CreateTableForm = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Disponible");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const tableId = await createTable(name); // Pasa el nombre de la mesa
            alert(`Mesa creada exitosamente con ID: ${tableId}`);
            setName(""); // Resetea el campo de nombre
            navigate("/tables"); // Redirige al panel de mesas
        } catch (error) {
            alert("Hubo un error al crear la mesa.");
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Regresar 
                </button>
            </div>
            <h2 className="text-4xl font-extrabold text-orange-500 mb-8 text-center">
                Crear Mesa
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                        placeholder="Nombre de la mesa"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Estado
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    >
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupada">Ocupada</option>
                    </select>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Crear Mesa
                    </button>
                </div>
            </form>
        </div>
    );
};