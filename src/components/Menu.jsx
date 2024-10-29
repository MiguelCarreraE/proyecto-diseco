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
      <h1>Menu</h1>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        items.map((item) => (
          <Item
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
          />
        ))
      )}
    </>
  );
};
