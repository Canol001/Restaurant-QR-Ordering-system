import { ShoppingCart } from 'lucide-react'; // Ensure lucide-react is installed
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg relative">
      {/* Top navbar section */}
      <div className="container mx-auto flex justify-between items-center p-4 sm:p-6 relative z-30">
        {/* Logo */}
        <NavLink to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Restaurant QR
        </NavLink>

        {/* Orders Icon (only on small screens) */}
        <NavLink
          to="/orders"
          className="md:hidden absolute left-4 top-4 sm:top-6"
          title="Orders"
          aria-label="View Orders"
        >
          <ShoppingCart className="w-7 h-7 text-white hover:text-green-400 transition-colors duration-200" />
        </NavLink>

        {/* Hamburger Menu */}
        <button
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-green-400 rounded p-2 z-20"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Menu Links for md and above */}
        <ul className="hidden md:flex md:space-x-6 items-center">
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `block py-2 px-4 text-lg font-medium hover:bg-gray-700 hover:text-green-400 rounded transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-green-400' : ''
                }`
              }
            >
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block py-2 px-4 text-lg font-medium hover:bg-gray-700 hover:text-green-400 rounded transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-green-400' : ''
                }`
              }
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `block py-2 px-4 text-lg font-medium hover:bg-gray-700 hover:text-green-400 rounded transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-green-400' : ''
                }`
              }
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/welcome"
              className={({ isActive }) =>
                `block py-2 px-4 text-lg font-medium hover:bg-gray-700 hover:text-green-400 rounded transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-green-400' : ''
                }`
              }
            >
              Scan
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Dropdown (separate block) */}
      {isOpen && (
        <div
          className={`md:hidden bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-4 space-y-3 absolute top-full left-0 w-full z-20 transform transition-all duration-300 ease-in-out ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <NavLink
            to="/menu"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-3 px-4 text-lg font-medium rounded hover:bg-gray-700 hover:text-green-400 transition-colors duration-200 ${
                isActive ? 'bg-gray-700 text-green-400' : ''
              }`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-3 px-4 text-lg font-medium rounded hover:bg-gray-700 hover:text-green-400 transition-colors duration-200 ${
                isActive ? 'bg-gray-700 text-green-400' : ''
              }`
            }
          >
            Admin
          </NavLink>
          <NavLink
            to="/welcome"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-3 px-4 text-lg font-medium rounded hover:bg-gray-700 hover:text-green-400 transition-colors duration-200 ${
                isActive ? 'bg-gray-700 text-green-400' : ''
              }`
            }
          >
            Scan
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;