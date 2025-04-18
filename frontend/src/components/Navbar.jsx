import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold">
          Restaurant QR
        </NavLink>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden focus:outline-none"
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

        {/* Menu Links */}
        <div
          className={`md:flex md:items-center md:space-x-4 ${
            isOpen ? 'block' : 'hidden'
          } w-full md:w-auto`}
        >
          <ul className="md:flex md:space-x-4 flex-col md:flex-row mt-4 md:mt-0">
            <li>
              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  `block py-2 px-4 hover:bg-gray-700 rounded ${
                    isActive ? 'bg-gray-700' : ''
                  }`
                }
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              >
                Orders
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;