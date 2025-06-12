import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import Cart from '../components/Cart';
import MenuItem from '../components/MenuItem';

const ITEMS_PER_PAGE = 6;

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const tableId = new URLSearchParams(location.search).get('table');

  // 🛑 Redirect if no table ID
  useEffect(() => {
    if (!tableId) {
      navigate('/welcome', {
        replace: true,
        state: { error: 'Please scan your table QR to continue.' }
      });
    }
  }, [tableId, navigate]);

  // ✅ Fetch menu
  useEffect(() => {
    if (tableId) {
      api
        .get('/api/menu')
        .then((res) => setMenu(res.data))
        .catch((err) => console.error(err));
    }
  }, [tableId]);

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

  const totalPages = Math.ceil(menu.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = menu.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 🔐 Fallback display (just in case)
  if (!tableId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">You must scan your table QR code to view the menu.</p>
      </div>
    );
  }

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
          <div className="flex justify-center items-center space-x-4 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      <Cart cart={cart} setCart={setCart} tableId={tableId} />
    </div>
  );
};

export default Menu;
