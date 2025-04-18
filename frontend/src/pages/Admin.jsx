import { useEffect, useState } from 'react';
import api from '../api';
import placeholderImage from '../assets/placehoder.jpg';
import OrderForm from '../components/OrderForm';

const Admin = () => {
  const [menu, setMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editItem, setEditItem] = useState(null); // ✅ Track the item being edited

  const itemsPerPage = 6;
  const totalPages = Math.ceil(menu.length / itemsPerPage);
  const paginatedMenu = menu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    api
      .get('/api/menu')
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));
  };

  const addMenuItem = (item) => {
    if (editItem) {
      // Editing existing item
      api
        .put(`/api/menu/${editItem._id}`, item)
        .then((res) => {
          setMenu((prev) =>
            prev.map((m) => (m._id === editItem._id ? res.data : m))
          );
          setEditItem(null);
          setShowModal(false);
        })
        .catch((err) => console.error(err));
    } else {
      // Adding new item
      api
        .post('/api/menu', item)
        .then((res) => {
          setMenu([...menu, res.data]);
          setShowModal(false);
        })
        .catch((err) => console.error(err));
    }
  };

  const deleteMenuItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      api
        .delete(`/api/menu/${id}`)
        .then(() => {
          setMenu((prev) => prev.filter((item) => item._id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setEditItem(null);
          setShowModal(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700 z-50"
        title="Add New Item"
      >
        +
      </button>

      {/* Modal with OrderForm */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <OrderForm onAdd={addMenuItem} initialData={editItem} />
            <button
              onClick={() => {
                setShowModal(false);
                setEditItem(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">Menu Items</h2>
      {menu.length === 0 ? (
        <p className="text-gray-500">No menu items added yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedMenu.map((item) => (
              <div key={item._id} className="border p-4 rounded shadow relative">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-lg font-semibold">Ksh. {item.price}</p>
                <p className="text-sm text-gray-500">
                  Category: {item.category || 'None'}
                </p>
                <img
                  src={item.image || placeholderImage}
                  alt={item.name}
                  onError={handleImageError}
                  className="w-full h-40 object-cover mt-2 rounded"
                />

                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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
    </div>
  );
};

export default Admin;
