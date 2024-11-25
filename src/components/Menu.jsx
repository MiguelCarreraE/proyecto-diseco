import React, { useState, useEffect } from "react";
import { Item } from "./Item";
import { Search } from "lucide-react";
import { getAvailableTables, getMenuItemsFromSubcollections } from "@/services/crud";

export const Menu = ({ addToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTables, setAvailableTables] = useState(0);

  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const tables = await getAvailableTables();
        setAvailableTables(tables.length); // Actualiza el número de mesas disponibles
      } catch (error) {
        console.error("Error al obtener las mesas disponibles:", error);
      }
    };

    fetchAvailableTables();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const allItems = await getMenuItemsFromSubcollections();
        setItems(allItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-orange-500 mt-4">Menu</h1>

      <div className="flex justify-center mt-4">
        <div className="flex items-center border rounded-lg w-1/3">
          <Search className="ml-2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-5/6 border-none focus:outline-none"
          />
        </div>
        <div className=" flex bg-gray-100 text-gray-900 px-4 py-2 rounded-lg shadow-md ml-7">
          Mesas disponibles: <strong>{availableTables}</strong>
        </div>
      </div>

      {loading ? (
        <h3 className="text-xl">Loading...</h3>
      ) : (
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <Item
                key={index}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
                available={item.available}
                category={item.category} // Aseguramos que la categoría se pase correctamente
                addToCart={addToCart}
              />
            ))
          ) : (
            <p>No se encontraron platillos que coincidan con la búsqueda.</p>
          )}
        </div>
      )}
    </>
  );
};