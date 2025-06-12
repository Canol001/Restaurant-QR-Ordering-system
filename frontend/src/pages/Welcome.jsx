import { BrowserQRCodeReader } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import Cart from '../components/Cart';
import MenuItem from '../components/MenuItem';
import { getSessionId, getTableId, setTableId } from '../utils/session';

const ITEMS_PER_PAGE = 6;

const Welcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const cartRef = useRef(null); // Add ref for cart section

  const queryTableId = new URLSearchParams(location.search).get('table');
  const [tableId, setTableIdState] = useState(queryTableId || localStorage.getItem('tableId') || null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [scanError, setScanError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tableId) {
      setLoading(false);
      return;
    }

    api.get('/api/menu')
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

  useEffect(() => {
    if (tableId || !videoRef.current) return;

    const codeReader = new BrowserQRCodeReader();
    codeReaderRef.current = codeReader;

    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result) {
        try {
          const url = new URL(result.getText());
          const scannedTableId = new URLSearchParams(url.search).get('table');

          if (url.pathname === '/welcome' && scannedTableId) {
            setTableIdState(scannedTableId);
            setTableId(scannedTableId);
            navigate(`/welcome?table=${scannedTableId}`);
          } else {
            setScanError('Invalid QR code. Please scan a valid table QR code.');
          }
        } catch {
          setScanError('Error reading QR code. Please try again.');
        }
      }

      if (err && err.name !== 'NotFoundException') {
        console.error(err);
        setScanError('Ensure your camera is able to scan the code!');
      }
    }).catch((err) => {
      console.error(err);
      setScanError('Failed to initialize QR scanner. Please try another device.');
    });

    return () => {
      codeReader.reset();
      codeReaderRef.current = null;
    };
  }, [tableId, navigate]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setRequirements('');
  };

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
      setCart(cart.map((cartItem) =>
        cartItem._id === item._id && cartItem.requirements === newItem.requirements
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, newItem]);
    }

    setSelectedItem(null);
    setRequirements('');
  };

  const handleSubmitOrder = async () => {
    const savedTableId = getTableId();
    if (!cart.length || !savedTableId) return;

    setSubmitting(true);
    try {
      await api.post('/api/orders', {
        tableId: savedTableId,
        sessionId: getSessionId(),
        items: cart,
      });

      setCart([]);
      alert('Order submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Scroll to cart section
  const scrollToCart = () => {
    cartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPages = Math.ceil(menu.length / ITEMS_PER_PAGE);
  const paginatedMenu = menu.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (!tableId) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Scan Table QR Code</h1>
        <p className="text-gray-600 mb-6">Please scan the QR code on your table to view the menu.</p>
        <div className="max-w-md mx-auto relative">
          <video ref={videoRef} className="w-full rounded-lg shadow-lg" style={{ maxHeight: '400px' }} />
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-b-blue-500 animate-pulse pointer-events-none" />
        </div>
        {scanError && <p className="text-red-500 mt-4">{scanError}</p>}
        <button onClick={() => navigate('/')} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">{error}</h1>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Table {tableId}!</h1>
      <p className="text-green-600 mb-6">Browse our menu and scroll bottom to cart.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {paginatedMenu.map((item) => (
          <MenuItem key={item._id} item={item} onAddToCart={() => handleSelectItem(item)} />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Prev
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>

      {cart.length > 0 && (
        <div ref={cartRef} className="mt-8">
          <Cart cart={cart} setCart={setCart} tableId={tableId} onSubmitOrder={handleSubmitOrder} />
        </div>
      )}

      {cart.length > 0 && (
        <button
          onClick={scrollToCart}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          View Cart
        </button>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            {selectedItem.image && (
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover rounded mb-4" />
            )}
            <h2 className="text-xl font-bold mb-2">Customize {selectedItem.name}</h2>
            {selectedItem.description && <p className="text-gray-600 mb-4">{selectedItem.description}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addToCart(selectedItem);
              }}
            >
              <label className="block mb-2">Special Requirements</label>
              <textarea
                className="w-full p-2 border rounded mb-4"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;