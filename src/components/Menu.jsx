import React, { useState, useEffect } from "react";
import { Item } from "./Item";
import { getMenu } from "../services/menuApi";

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold">Menu</h1>

      {loading ? (
        <h3 className="text-xl">Loading...</h3>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </div>
      )}
    </>
  );
};
