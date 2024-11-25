import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardButton,
} from "@/components/ui/card";

export const Item = ({
  name,
  price,
  description,
  image,
  available,
  category,
  addToCart,
}) => {
  const handleAddToCart = () => {
    const product = { name, price, description, image, category };
    addToCart(product);
  };

  return (
    <Card>
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-t-lg"
      />

      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-gray-500 italic">
          {category || "Sin categoría"} {/* Mostrar categoría o un valor predeterminado */}
        </p>
      </CardHeader>

      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>

      <CardFooter
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="text-xl font-bold">${price}</p>
        {available && (
          <CardButton
            onClick={handleAddToCart}
            className="bg-orange-500 text-white hover:bg-orange-700 rounded-[12px]"
          >
            Agregar
          </CardButton>
        )}
      </CardFooter>
    </Card>
  );
};