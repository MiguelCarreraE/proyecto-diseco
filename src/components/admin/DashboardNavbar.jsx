import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "react-router-dom";
export const DashboardNavbar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="border-b-2">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <a href="/dashboard" className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-4">
            {/* Tabs Navigation */}
            <Tabs.Root
              defaultValue="menu"
              className="w-full max-w-md border-b border-gray-300"
            >
              <Tabs.List
                className="flex space-x-4 px-4 py-2 bg-white"
                aria-label="Tabs navigation"
              >
                <Tabs.Trigger
                  value="menu"
                  className="px-4 py-2 font-medium text-sm text-gray-700 hover:bg-orange-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onClick={() => navigate("/menu")}
                >
                  Menú
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tables"
                  className="px-4 py-2 font-medium text-sm text-gray-700 hover:bg-orange-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onClick={() => navigate("/tables")}
                >
                  Mesas
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            {/* Logout button */}
            <Button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md font-semibold hover:bg-red-600"
            >
              Cerrar sesión
            </Button>

            {/* Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User avatar"
              />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};