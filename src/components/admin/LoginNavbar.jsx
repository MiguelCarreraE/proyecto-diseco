import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export const LoginNavbar = ({ user, handleMyOrdersClick, handleAdminClick, handleLogout, cart, setIsCartOpen }) => {
  return (
    <header className="border-b-2">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
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

        {/* Right content */}
        <div className="ml-auto flex items-center space-x-5">
          <Separator
            orientation="vertical"
            className="h-6 border-l-1 bg-orange-500"
          />
        </div>
      </div>
    </header>
  );
};