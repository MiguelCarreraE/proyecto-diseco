import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createMenuItem } from "@/services/crud";


export const CreateDishForm = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Seleccionar una categoria");
    const [available, setAvailable] = useState("true");
    const [image, setImage] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newItem = {
          name,
          price: parseFloat(price),
          description,
          available: available === "true",
          image,
        };
      
        const success = await createMenuItem("MnCNlud7XLsGfgnIWyCz", category, newItem);
      
        if (success) {
          alert("Platillo creado exitosamente");
          setName("");
          setPrice("");
          setDescription("");
          setCategory("Postres");
          setAvailable("true");
          setImage("");
        } else {
          alert("Hubo un error al crear el platillo.");
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
          Crear Platillo
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
              required
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
                required
              />
            </div>
            <div>
            <label className="block text-gray-700 font-semibold mb-1">Categoría</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">Selecciona una categoría</option> {/* Valor vacío para prevenir errores */}
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
              required
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
                required
              />
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Crear Platillo
            </button>
          </div>
        </form>
      </div>
    );
  };