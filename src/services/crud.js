import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    arrayUnion,
    query,
    where
  } from "firebase/firestore";
  import { db } from "./firebaseConfig";
  
  export const getMenuItemsFromSubcollections = async () => {
    try {
      const menuDocId = "MnCNlud7XLsGfgnIWyCz"; // ID del documento principal
      const subcollections = ["Entradas", "Platos_fuertes", "Postres"];
      let allItems = [];
  
      for (const subcollection of subcollections) {
        const subcollectionRef = collection(db, `Menu/${menuDocId}/${subcollection}`);
        const querySnapshot = await getDocs(subcollectionRef);
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.items) {
            // Agrega la categoría y el ID del documento a cada ítem
            const itemsWithMetadata = data.items.map((item) => ({
              ...item,
              category: subcollection, // Categoría
              documentId: doc.id, // ID del documento
            }));
            allItems = [...allItems, ...itemsWithMetadata];
          }
        });
      }
  
      return allItems;
    } catch (error) {
      console.error("Error al obtener los items:", error);
      return [];
    }
  };
  export const createMenuItem = async (menuDocId, category, newItem) => {
    try {

  
      if (!menuDocId || !category) {
        throw new Error("El ID del menú o la categoría no son válidos.");
      }
  
      const subcollectionDocRef = doc(db, `Menu/${menuDocId}/${category}/data`);
  
      // Verificar si el documento ya existe
      const subcollectionSnapshot = await getDoc(subcollectionDocRef);
  
      if (subcollectionSnapshot.exists()) {
        await updateDoc(subcollectionDocRef, {
          items: arrayUnion(newItem),
        });
      } else {
        await setDoc(subcollectionDocRef, {
          items: [newItem],
        });
      }
  

      return true;
    } catch (error) {
      console.error("Error al crear el platillo:", error);
      return false;
    }
  };
  export const createOrder = async (orderData) => {
    try {
      // Crear la orden en la colección `Orders`
      const ordersRef = collection(db, "Orders");
      const orderDoc = await addDoc(ordersRef, orderData);
  

  
      // Actualizar el `order_history` del usuario
      const userDocRef = doc(db, orderData.user); // `orderData.user` es la referencia al usuario
      await updateDoc(userDocRef, {
        order_history: arrayUnion(`/Orders/${orderDoc.id}`), // Añadimos el ID de la orden
      });
  

      return orderDoc.id;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      throw new Error("Error al crear la orden");
    }
  };
  
  export const createUser = async (name) => {
    try {
      const usersCollectionRef = collection(db, "Users");
      const querySnapshot = await getDocs(usersCollectionRef);
  
      let userId = null;
  
      // Verificar si el usuario ya existe
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name === name) {
          userId = doc.id; // Si el usuario existe, obtener el ID
        }
      });
  
      // Si no existe, crearlo
      if (!userId) {
        const newUserRef = doc(usersCollectionRef); // Crea una referencia para un nuevo documento
        await setDoc(newUserRef, {
          name,
          order_history: [], // Inicializar con un historial de órdenes vacío
        });
        userId = newUserRef.id; // Obtener el ID del nuevo documento
      }
  
      return userId;
    } catch (error) {
      console.error("Error al crear o recuperar el usuario:", error);
      throw new Error("Error al crear o recuperar el usuario");
    }
  };
  export const getOrders = async (userName) => {
    try {

  
      // Buscar el usuario por nombre
      const usersRef = collection(db, "Users");
      const userQuery = query(usersRef, where("name", "==", userName));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        console.error("No se encontró un usuario con ese nombre.");
        throw new Error("No se encontró un usuario con ese nombre.");
      }
  
      // Obtener los datos del usuario
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

  
      // Verificar si el usuario tiene un historial de órdenes
      if (!userData.order_history || userData.order_history.length === 0) {
        console.warn("El usuario no tiene órdenes en su historial.");
        return [];
      }
  

  
      // Extraer las IDs de las órdenes
      const orderIds = userData.order_history.map((ref) => ref.split("/")[2]);

  
      // Buscar las órdenes en Firestore
      const ordersRef = collection(db, "Orders");
      const ordersSnapshot = await getDocs(query(ordersRef, where("__name__", "in", orderIds)));
  
      const orders = ordersSnapshot.docs.map((doc) => {
        const orderData = doc.data();

  
        // Obtener los ítems directamente del campo `items`
        const items = orderData.items || []; // Validar si `items` existe y no es nulo
  
        return {
          id: doc.id,
          ...orderData,
          items, // Agregar los ítems directamente del campo
        };
      });
  

  
      if (orders.length === 0) {
        console.warn("No se encontraron órdenes para este usuario.");
      }
  
      return orders;
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      throw new Error("Error al obtener las órdenes.");
    }
  };

export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, "Orders");
    const querySnapshot = await getDocs(ordersRef);

    const orders = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const orderData = docSnapshot.data();
        
        // Procesar el campo `user` para obtener el ID del usuario
        const userId = orderData.user.split("/").pop(); // Extraer el ID del usuario
        let userName = "Desconocido"; // Valor predeterminado

        try {
          const userRef = doc(db, "Users", userId); // Obtener referencia al usuario
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userName = userSnap.data().name || "Desconocido";
          }
        } catch (error) {
          console.error(`Error al obtener el usuario ${userId}:`, error);
        }

        return {
          id: docSnapshot.id,
          ...orderData,
          userName,
        };
      })
    );

    return orders;
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    throw new Error("No se pudieron cargar las órdenes.");
  }
};
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "Orders", orderId);
    await updateDoc(orderRef, { status: newStatus });

  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    throw new Error("Error al actualizar el estado de la orden.");
  }
};
export const createTable = async (name) => {
  try {
    const tableRef = collection(db, "Tables");
    const newTable = {
      name,
      status: "Disponible", // Estado inicial
      user: null, // Sin usuario asignado
    };
    const tableDoc = await addDoc(tableRef, newTable);
    return tableDoc.id; // ID de la mesa creada
  } catch (error) {
    console.error("Error al crear la mesa:", error);
    throw new Error("Error al crear la mesa.");
  }
};
export const assignTableToUser = async (tableId, userId) => {
  try {
    const tableRef = doc(db, "Tables", tableId);
    await updateDoc(tableRef, {
      status: "Ocupada",
      user: `/Users/${userId}`, // Asigna la mesa al usuario
    });

  } catch (error) {
    console.error("Error al asignar la mesa:", error);
    throw new Error("Error al asignar la mesa.");
  }
};
export const updateTableStatus = async (tableId, status) => {
  try {
    const tableRef = doc(db, "Tables", tableId);
    await updateDoc(tableRef, { status });

  } catch (error) {
    console.error("Error al actualizar el estado de la mesa:", error);
    throw new Error("Error al actualizar el estado de la mesa.");
  }
};
export const getAllTables = async () => {
  try {
    const tableRef = collection(db, "Tables");
    const snapshot = await getDocs(tableRef);
    const tables = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return tables;
  } catch (error) {
    console.error("Error al obtener las mesas:", error);
    throw new Error("Error al obtener las mesas.");
  }
};
export const getAvailableTables = async () => {
  try {
    const tablesRef = collection(db, "Tables");
    const querySnapshot = await getDocs(tablesRef);

    const availableTables = [];
    querySnapshot.forEach((doc) => {
      const tableData = doc.data();
      if (tableData.status === "Disponible") {
        availableTables.push({ id: doc.id, ...tableData });
      }
    });

    return availableTables;
  } catch (error) {
    console.error("Error al obtener las mesas disponibles:", error);
    throw new Error("Error al obtener las mesas disponibles.");
  }
};
export const getOrdersWithTableInfo = async () => {
  try {
    const ordersRef = collection(db, "Orders");
    const querySnapshot = await getDocs(ordersRef);

    const orders = await Promise.all(
      querySnapshot.docs
        .filter((orderDoc) => {
          const orderData = orderDoc.data();
          // Excluir órdenes con estado "Liberada"
          return orderData.status !== "Liberada";
        })
        .map(async (orderDoc) => {
          const orderData = orderDoc.data();

          let userName = "Usuario no encontrado";
          let tableName = "Mesa sin asignar";

          // Obtener información del usuario si la referencia existe
          if (orderData.user) {
            try {
              const userRef = doc(db, orderData.user.replace("/Users/", "Users/")); // Aseguramos la ruta correcta
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                userName = userSnap.data().name || "Usuario sin nombre";
              }
            } catch (userError) {
              console.error(`Error al obtener el usuario (${orderData.user}):`, userError);
            }
          }

          // Obtener información de la mesa si la referencia existe
          if (orderData.table) {
            try {
              const tableRef = doc(db, orderData.table.replace("/Tables/", "Tables/")); // Aseguramos la ruta correcta
              const tableSnap = await getDoc(tableRef);
              if (tableSnap.exists()) {
                tableName = tableSnap.data().name || "Mesa sin nombre";
              }
            } catch (tableError) {
              console.error(`Error al obtener la mesa (${orderData.table}):`, tableError);
            }
          }

          return {
            id: orderDoc.id,
            ...orderData,
            userName,
            tableName,
          };
        })
    );

    return orders;
  } catch (error) {
    console.error("Error al obtener las órdenes con información de mesa:", error);
    throw new Error("Error al obtener las órdenes.");
  }
};

export const releaseTableAndOrder = async (orderId, tableId) => {
  try {
    // Actualizar el estado de la orden
    const orderRef = doc(db, "Orders", orderId);
    await updateDoc(orderRef, {
      status: "Liberada", // O el estado que quieras asignar
    });

    // Actualizar la mesa asociada
    const tableRef = doc(db, "Tables", tableId);
    await updateDoc(tableRef, {
      status: "Disponible",
      user: "", // Liberar al usuario asociado
    });


  } catch (error) {
    console.error("Error al liberar la mesa y actualizar la orden:", error);
    throw new Error("No se pudo liberar la mesa y actualizar la orden.");
  }
};
export const deleteMenuItem = async (menuDocId, category, documentId, itemName) => {
  try {
    // Referencia al documento dentro de la categoría
    const documentRef = doc(db, `Menu/${menuDocId}/${category}/${documentId}`);
    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("El documento no existe.");
    }

    // Obtener el array de items
    const data = documentSnapshot.data();
    const items = data.items || [];

    // Filtrar el ítem que deseas eliminar
    const updatedItems = items.filter((item) => item.name !== itemName);

    // Actualizar el documento con el array actualizado
    await updateDoc(documentRef, { items: updatedItems });


  } catch (error) {
    console.error("Error al eliminar el platillo:", error);
    throw error;
  }
};
export const editMenuItem = async (menuDocId, category, documentId, updatedItem, originalName) => {
  try {
    // Referencia al documento dentro de la categoría
    const documentRef = doc(db, `Menu/${menuDocId}/${category}/${documentId}`);
    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("El documento no existe.");
    }

    // Obtener el array de items
    const data = documentSnapshot.data();
    const items = data.items || [];



    // Encontrar el platillo usando `originalName`
    const itemIndex = items.findIndex(
      (item) => item.name.trim().toLowerCase() === originalName.trim().toLowerCase()
    );

    if (itemIndex === -1) {
      throw new Error("El platillo no existe en el array.");
    }

    // Actualizar el ítem correspondiente
    items[itemIndex] = { ...items[itemIndex], ...updatedItem };



    // Actualizar el documento con el array modificado
    await updateDoc(documentRef, { items });


  } catch (error) {
    console.error("Error al editar el platillo:", error);
    throw error;
  }
};
export const editMenuItemAvailability = async (menuDocId, category, documentId, itemName, newAvailability) => {
  try {
    // Referencia al documento dentro de la categoría
    const documentRef = doc(db, `Menu/${menuDocId}/${category}/${documentId}`);
    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("El documento no existe.");
    }

    // Obtener el array de items
    const data = documentSnapshot.data();
    const items = data.items || [];



    // Encontrar el ítem por su nombre
    const itemIndex = items.findIndex(
      (item) => item.name.trim().toLowerCase() === itemName.trim().toLowerCase()
    );

    if (itemIndex === -1) {
      throw new Error("El platillo no existe en el array.");
    }

    // Actualizar solo la disponibilidad del ítem
    items[itemIndex].available = newAvailability;



    // Actualizar en Firestore
    await updateDoc(documentRef, { items });


  } catch (error) {
    console.error("Error al actualizar disponibilidad:", error);
    throw error;
  }
};