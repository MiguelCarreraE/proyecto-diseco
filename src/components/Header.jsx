import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"


export const Header = ({ isAdmin, setIsAdmin }) => {
  const handleUser = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <h1 className="text-2xl font-bold">
          <a href="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Restaurant</span>
          </a>
        </h1>

        <div className="ml-auto flex items-center space-x-4">
          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User avatar"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Button
              variant={isAdmin ? "destructive" : "default"}
              size="sm"
              onClick={handleUser}
            >
              {isAdmin ? "User Mode" : "Admin Mode"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
