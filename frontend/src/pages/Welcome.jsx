import { BrowserQRCodeReader } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import Cart from '../components/Cart';
import MenuItem from '../components/MenuItem';

const Welcome = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [scanError, setScanError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  // Extract tableId from URL
  const tableId = new URLSearchParams(location.search).get('table') || null;

  // Fetch menu items if tableId is present
  useEffect(() => {
    if (!tableId) {
      setLoading(false);
      return;
    }

    api
      .get('/menu')
      .then((res) => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load menu. Please try again later.');
        setLoading(false);
        console.error(err);
      });
  }, [tableId]);

  // Setup QR code scanner
  useEffect(() => {
    if (tableId || !videoRef.current) return;

    codeReaderRef.current = new BrowserQRCodeReader();
    codeReaderRef.current
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          try {
            const url = new URL(result.getText());
            const scannedTableId = new URLSearchParams(url.search).get('table');
            if (url.pathname === '/welcome' && scannedTableId) {
              navigate(`/welcome?table=${scannedTableId}`);
            } else {
              setScanError('Invalid QR code. Please scan a valid table QR code.');
            }
          } catch (err) {
            setScanError('Error reading QR code. Please try again.');
          }
        }
        if (err && err.name !== 'NotFoundException') {
          setScanError('Unable to access camera. Please check permissions or try another device.');
          console.error(err);
        }
      })
      .catch((err) => {
        setScanError('Failed to initialize QR scanner. Please try another device.');
        console.error(err);
      });

    // Cleanup on unmount
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
    };
  }, [tableId, navigate]);

  // Add item to cart with requirements
  const addToCart = (item) => {
    const newItem = {
      ...item,
      quantity: 1,
      requirements: requirements || 'None',
    };
    const existingItem = cart.find(
      (cartItem) =>
        cartItem._id === item._id && cartItem.requirements === newItem.requirements
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id && cartItem.requirements === newItem.requirements
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, newItem]);
    }

    setSelectedItem(null);
    setRequirements('');
  };

  // Handle item selection for requirements
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setRequirements('');
  };

  // Close requirements modal
  const closeModal = () => {
    setSelectedItem(null);
    setRequirements('');
  };

  // Navigate to cart
  const goToCart = () => {
    navigate('/cart', { state: { cart, tableId } });
  };

  // Render QR scanner if no tableId
  if (!tableId) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Scan Table QR Code</h1>
        <p className="text-gray-600 mb-6">Please scan the QR code on your table to view the menu.</p>
        <div className="max-w-md mx-auto relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg shadow-lg"
            style={{ maxHeight: '400px' }}
          />
          {/* Scanning Overlay */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-b-blue-500 animate-pulse pointer-events-none" />
        </div>
        {scanError && <p className="text-red-500 mt-4">{scanError}</p>}
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">{error}</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Render welcome page with menu
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Table {tableId}!</h1>
      <p className="text-gray-600 mb-6">Browse our menu and customize your order below.</p>

      {/* Menu Items */}
      {menu.length === 0 ? (
        <p className="text-gray-500">No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {menu.map((item) => (
            <div key={item._id} className="relative">
              <MenuItem item={item} onAddToCart={() => handleSelectItem(item)} />
            </div>
          ))}
        </div>
      )}

      {/* Requirements Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Customize {selectedItem.name}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addToCart(selectedItem);
              }}
            >
              <label className="block mb-2">Special Requirements</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="E.g., No onions, extra cheese"
                className="w-full p-2 border rounded mb-4"
                rows="4"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cart Preview */}
      <Cart cart={cart} setCart={setCart} tableId={tableId} />

      {/* Proceed to Cart */}
      {cart.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={goToCart}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          >
            Proceed to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Welcome;