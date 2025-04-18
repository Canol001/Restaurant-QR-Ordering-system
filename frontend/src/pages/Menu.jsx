import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import Cart from '../components/Cart';
import MenuItem from '../components/MenuItem';

const ITEMS_PER_PAGE = 6;

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const tableId = new URLSearchParams(location.search).get('table') || 'Unknown';

  useEffect(() => {
    api
      .get('/api/menu')
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(menu.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = menu.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu (Table {tableId})</h1>

      {menu.length === 0 ? (
        <p className="text-gray-500">No menu items available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <MenuItem key={item._id} item={item} onAddToCart={addToCart} />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <Cart cart={cart} setCart={setCart} tableId={tableId} />
    </div>
  );
};

export default Menu;
