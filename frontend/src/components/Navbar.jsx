import { ShoppingCart } from 'lucide-react'; // Ensure lucide-react is installed
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white relative">
      {/* Top navbar section */}
      <div className="container mx-auto flex justify-between items-center p-4 relative z-30">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold">
          Restaurant QR
        </NavLink>

        {/* Orders Icon (only on small screens) */}
        <NavLink
          to="/orders"
          className="md:hidden absolute left-4 top-4"
          title="Orders"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
        </NavLink>

        {/* Hamburger Menu */}
        <button
          className="md:hidden focus:outline-none z-20"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
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
        <ul className="hidden md:flex md:space-x-4 items-center">
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `block py-2 px-4 hover:bg-gray-700 rounded ${
                  isActive ? 'bg-gray-700' : ''
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
                `block py-2 px-4 hover:bg-gray-700 rounded ${
                  isActive ? 'bg-gray-700' : ''
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
                `block py-2 px-4 hover:bg-gray-700 rounded ${
                  isActive ? 'bg-gray-700' : ''
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
                `block py-2 px-4 hover:bg-gray-700 rounded ${
                  isActive ? 'bg-gray-700' : ''
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
        <div className="md:hidden bg-gray-800 px-4 py-2 space-y-2 absolute top-full left-0 w-full z-20">
          <NavLink
            to="/menu"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-2 px-4 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-2 px-4 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            Admin
          </NavLink>
          <NavLink
            to="/welcome"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-2 px-4 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
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
