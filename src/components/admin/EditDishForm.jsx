import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { editMenuItem } from "@/services/crud";

export const EditDishForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Datos iniciales del platillo a editar (pasados desde `state`)
    const dishData = location.state?.dish || {};
    const [originalName] = useState(dishData.name || "");
    const [name, setName] = useState(dishData.name || "");
    const [price, setPrice] = useState(dishData.price || "");
    const [description, setDescription] = useState(dishData.description || "");
    const [category, setCategory] = useState(dishData.category || "");
    const [available, setAvailable] = useState(dishData.available ? "true" : "false");
    const [image, setImage] = useState(dishData.image || "");

    const handleSubmit = async (e) => {
      e.preventDefault();

      const updatedItem = {
          name,
          price: parseFloat(price),
          description,
          available: available === "true",
          image,
      };

      try {
          // Llama a la función `editMenuItem` para actualizar en Firebase
          await editMenuItem(
              "MnCNlud7XLsGfgnIWyCz", // ID del menú principal
              category, // Categoría del platillo
              dishData.documentId, // ID del documento
              updatedItem,
              originalName // Usa el nombre original para encontrar el platillo
          );

          alert("Platillo editado exitosamente");
          navigate("/menu"); // Redirige al usuario al menú principal
      } catch (error) {
          alert("Hubo un error al editar el platillo.");
      }
  };

    return (
        <div className="container mx-auto max-w-4xl p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/menu")}
                    className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Regresar al Dashboard
                </button>
            </div>
            <h2 className="text-4xl font-extrabold text-orange-500 mb-8 text-center">
                Editar Platillo
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
                        placeholder="Nombre del platillo"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                            Precio
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                            placeholder="Precio del platillo"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Entradas">Entradas</option>
                            <option value="Platos_fuertes">Platos fuertes</option>
                            <option value="Postres">Postres</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                        placeholder="Descripción del platillo"
                        rows="4"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                            Disponible
                        </label>
                        <select
                            value={available}
                            onChange={(e) => setAvailable(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                        >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                            Imagen
                        </label>
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                            placeholder="URL de la imagen"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};