'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, Heart, User, Home, Info } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { totalItems } = useCart();
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  /*
  SEARCH HANDLER
  */

  const handleSearch = () => {

    if (!searchQuery.trim()) return;

    router.push(`/?search=${searchQuery}`);

    setSearchQuery("");

  };

  const handleAdminClick = () => {

    if (!user) router.push("/signin");

    else if (user.role.toLowerCase() === "admin") router.push("/admin");

    else router.push("/profile");

  };

  const firstInitial = user?.firstName ? user.firstName.charAt(0) : "";
  const lastInitial = user?.lastName ? user.lastName.charAt(0) : "";

  return (

    <nav className="sticky top-0 z-50 bg-white shadow-lg">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}

          <Link href="/" className="flex items-center gap-3">

            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FC</span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              FictileCore
            </span>

          </Link>


          {/* DESKTOP NAV */}

          <div className="hidden md:flex items-center gap-8">

            <Link
              href="/"
              className={`font-medium flex items-center gap-1 ${
                isActive("/") ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              <Home className="h-4 w-4"/>
              Home
            </Link>

            <Link
              href="/about"
              className={`font-medium flex items-center gap-1 ${
                isActive("/about") ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              <Info className="h-4 w-4"/>
              About
            </Link>

            <Link
              href="/contact"
              className={`font-medium ${
                isActive("/contact") ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              Contact
            </Link>

            {/* CATEGORY DROPDOWN */}

            <div className="relative group">

              <button className="text-gray-700 hover:text-primary font-medium">
                Categories
              </button>

              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border">

                <Link
                  href="/category/toys"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  🧸 Kids Toys
                </Link>

                <Link
                  href="/category/appliances"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  🏠 Home Appliances
                </Link>

              </div>

            </div>

          </div>


          {/* SEARCH */}

          <div className="hidden md:flex items-center w-full max-w-md mx-6">

            <div className="relative w-full">

              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                onKeyDown={(e)=>e.key==="Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-primary outline-none"
              />

              <Search
                onClick={handleSearch}
                className="absolute left-4 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
              />

            </div>

          </div>


          {/* RIGHT ICONS */}

          <div className="flex items-center gap-3">

            <Link
              href="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className="h-6 w-6"/>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-6 w-6"/>

              {totalItems>0 && (

                <motion.span
                  initial={{scale:0}}
                  animate={{scale:1}}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>

              )}

            </Link>

            {/* USER */}

            {user ? (

              <button
                onClick={handleAdminClick}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100"
              >

                <User className="h-5 w-5"/>

                <span className="hidden md:block text-sm">
                  {user.firstName}
                </span>

                <span className="md:hidden uppercase text-xs">
                  {firstInitial}{lastInitial}
                </span>

              </button>

            ) : (

              <button
                onClick={()=>router.push("/signin")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <User className="h-6 w-6"/>
              </button>

            )}

            {/* MOBILE MENU BUTTON */}

            <button
              onClick={()=>setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X/> : <Menu/>}
            </button>

          </div>

        </div>


        {/* MOBILE SEARCH */}

        <div className="md:hidden pb-3">

          <div className="relative">

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              onKeyDown={(e)=>e.key==="Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-3 border rounded-full"
            />

            <Search
              onClick={handleSearch}
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
            />

          </div>

        </div>

      </div>


      {/* MOBILE MENU */}

      <AnimatePresence>

        {isMenuOpen && (

          <motion.div
            initial={{opacity:0,height:0}}
            animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}
            className="md:hidden bg-white border-t"
          >

            <div className="px-4 py-4 space-y-3">

              <Link href="/" onClick={()=>setIsMenuOpen(false)}>
                🏠 Home
              </Link>

              <Link href="/about" onClick={()=>setIsMenuOpen(false)}>
                ℹ️ About
              </Link>

              <Link href="/contact" onClick={()=>setIsMenuOpen(false)}>
                📞 Contact
              </Link>

              <Link href="/category/toys" onClick={()=>setIsMenuOpen(false)}>
                🧸 Toys
              </Link>

              <Link href="/category/appliances" onClick={()=>setIsMenuOpen(false)}>
                🏠 Appliances
              </Link>

              <Link href="/wishlist" onClick={()=>setIsMenuOpen(false)}>
                ❤️ Wishlist
              </Link>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>

  );

};

export default Navbar;