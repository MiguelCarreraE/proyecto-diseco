import React, { useState, useEffect } from "react";
import { ChevronLeft, Search, Edit, Trash2, Plus, Settings } from "lucide-react";
import { deleteMenuItem, editMenuItemAvailability, getMenuItemsFromSubcollections } from "@/services/crud";
import { useNavigate } from "react-router-dom";


export const MenuAdmin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    

    const handleDeleteItem = async (item) => {
        try {
            

            const category = item.category;
            const menuDocId = "MnCNlud7XLsGfgnIWyCz";
            const documentId = item.documentId;

            await deleteMenuItem(menuDocId, category, documentId, item.name);

            setItems((prevItems) =>
                prevItems.filter((menuItem) => menuItem.name !== item.name)
            );
        } catch (error) {
            console.error("Error al eliminar el platillo:", error);
        }
    };

    const handleAddDish = () => {
        navigate("/menu/agregar");
    };
    const handleNavegateEdit = (item) => {
        if (!item.name) {
            console.error("El platillo no tiene un nombre válido:", item);
            return;
        }
        navigate(`/menu/editar/${encodeURIComponent(item.name)}`, { state: { dish: item } });
    };
    
    
    

    const handleEditAvailability = async (item) => {
        try {

    
            // Lógica para alternar la disponibilidad
            const newAvailability = !item.available;
    
            // Actualizar en Firebase
            await editMenuItemAvailability(
                "MnCNlud7XLsGfgnIWyCz", // ID del menú
                item.category, // Categoría del platillo
                item.documentId, // ID del documento
                item.name, // Nombre del platillo
                newAvailability // Nueva disponibilidad
            );
    
            // Actualizar el estado local para reflejar el cambio
            setItems((prevItems) =>
                prevItems.map((menuItem) =>
                    menuItem.name === item.name
                        ? { ...menuItem, available: newAvailability }
                        : menuItem
                )
            );
        } catch (error) {
            console.error("Error al cambiar la disponibilidad:", error);
        }
    };

    const filteredItems = items.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>

            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex">
                    <button
                    onClick={handleGoBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-500"
                    >
                    <ChevronLeft className="w-6 h-6" />
                    <span className="text-lg">Volver</span>
                    </button>
                </div>

                {/* Título centrado */}
                <div className="flex-grow flex justify-center">
                    <h1 className="text-3xl font-bold text-orange-500">Menu</h1>
                </div>
            </div>

                <div className="flex justify-center items-center mt-4 px-4 gap-6">
                {/* Campo de búsqueda */}
                <div className="flex items-center border rounded-lg w-1/3">
                    <Search className="ml-2 text-gray-500" />
                    <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 w-full border-none focus:outline-none"
                    />
                </div>
            </div>
            <div className="flex justify-center  items-center px-4 py-2 w-1/3">
                 <button
                    onClick={handleAddDish}
                    className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-600"
                >
                    <Plus className="w-5 h-5" />
                    <span>Agregar Platillo</span>
                </button>
            </div>
            {loading ? (
                <h3 className="text-xl text-center mt-6">Cargando...</h3>
            ) : (
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={index}
                                className="border rounded-lg shadow-lg p-4 flex flex-col justify-between"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-32 w-full object-cover rounded-md"
                                />
                                <h3 className="text-lg font-bold mt-4 text-orange-600">{item.name}</h3>
                                <p className="text-gray-700 mt-2">{item.description}</p>
                                <p className="text-gray-800 font-semibold mt-2">
                                    Precio: ${item.price}
                                </p>
                                <div className="flex items-center mt-2">
                                    <p
                                        className={`${
                                            item.available ? "text-green-600" : "text-red-600"
                                        } font-semibold mr-2`}
                                    >
                                        {item.available ? "Disponible" : "No disponible"}
                                    </p>
                                    <button
                                        onClick={() => handleEditAvailability(item)}
                                        className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-200"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Cambiar</span>
                                    </button>
                                </div>
                                <div className="flex justify-center items-center space-x-2 mt-4">
                                    <button
                                        onClick={() => handleNavegateEdit(item)}
                                        className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-200"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item)}
                                        className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Borrar</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">
                            No se encontraron platillos que coincidan con la búsqueda.
                        </p>
                    )}
                </div>
            )}
        </>
    );
};