import React from "react";
import logo from "../assets/logo.png"; // Make sure this path and filename are correct

const Header = () => {
  return (
    <header className="w-full bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
      
      {/* Logo and Title */}
      <div className="flex items-center mb-2 md:mb-0">
        <img
          src={logo}
          alt="College Logo"
          className="h-12 w-12 mr-3 object-contain"
        />
        <h1 className="text-xl font-bold">CImage Canteen</h1>
      </div>
      
      {/* Navigation */}
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:text-gray-200">
              Home
            </a>
          </li>
          <li>
            <a href="/menu" className="hover:text-gray-200">
              Menu
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-gray-200">
              Contact
            </a>
          </li>
        </ul>
      </nav>
      </div>
    </header>
  );
};

export default Header;
