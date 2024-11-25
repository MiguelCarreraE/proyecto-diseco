import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PaymentForm } from "./PaymentForm";

export const Navbar = ({
  user,
  handleMyOrdersClick,
  handleAdminClick,
  handleLogout,
  cart,
  setCart,
  setIsCartOpen,
  isCartOpen,
}) => {
  const handleRemoveItem = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, value) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, value || 1) } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const handlePaymentButtonClick = () => {
    setIsCartOpen(false); // Cierra el carrito
    setTimeout(() => setShowPaymentForm(true), 300); // Abre el formulario de pago después de un pequeño retraso
  };

  return (
    <>
      <header className="border-b-2">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">
            <a href="/" className="flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block text-orange-500">
                Miguel & Fer
              </span>
              <span className="hidden font-bold sm:inline-block text-black">
                Restaurant
              </span>
            </a>
          </h1>
          <div className="ml-auto flex items-center space-x-5">
            <Separator orientation="vertical" className="h-6 border-l-1 bg-orange-500" />
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMyOrdersClick}
                className="text-orange-500 hover:text-orange-600 underline font-medium"
              >
                Mis Pedidos
              </button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              {user ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Cerrar sesión
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAdminClick}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Admin
                </Button>
              )}
              <Toggle onClick={() => setIsCartOpen(true)}>
                <ShoppingCart />
                <span className="ml-1">{cart.length}</span>
              </Toggle>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-700">Carrito</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              Aquí puedes ver los productos seleccionados.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {cart.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            className="px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            onClick={() => handleRemoveItem(index)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) =>
                              handleQuantityChange(index, parseInt(e.target.value, 10))
                            }
                            className="w-12 text-center border rounded-md"
                          />
                          <span className="text-gray-700">x ${item.price}</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700">
                        ${item.price * (item.quantity || 1)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-6">
                  <h4 className="text-xl font-bold text-gray-700">Total:</h4>
                  <span className="text-xl font-bold text-gray-700">${calculateTotal()}</span>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handlePaymentButtonClick}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600"
                  >
                    Pagar
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No hay productos en el carrito.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPaymentForm(false)}
            >
              <X />
            </button>
            <PaymentForm
              total={calculateTotal()}
              cart={cart}
              onPaymentSuccess={() => {
                setCart([]); // Limpia el carrito
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};