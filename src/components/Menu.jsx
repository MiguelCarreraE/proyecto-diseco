import React, { useState, useEffect } from "react";
import { Item } from "./Item";

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api-menu-9b5g.onrender.com/menu")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
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
