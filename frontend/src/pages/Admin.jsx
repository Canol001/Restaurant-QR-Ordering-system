import jsPDF from 'jspdf';
import { QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import api from '../api';
import placeholderImage from '../assets/placehoder.jpg';
import OrderForm from '../components/OrderForm';
import { useNavigate } from 'react-router-dom';
import OrderSidebar from '../components/OrderSidebar';



const Admin = () => {
  const [menu, setMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [tableCount, setTableCount] = useState(1);
  const [qrCodes, setQrCodes] = useState([]);
  const [showOrders, setShowOrders] = useState(false);


  const itemsPerPage = 6;
  const totalPages = Math.ceil(menu.length / itemsPerPage);
  const paginatedMenu = menu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Adjust if you're using a different key
    navigate('/login');
  };

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

  const downloadPDF = () => {
    const qrElements = document.querySelectorAll('#qrGrid canvas');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const margin = 40;
    const qrSize = 120;
    const padding = 20;
    const columns = 4;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let x = margin;
    let y = margin;
    let count = 0;

    qrElements.forEach((canvas, index) => {
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

      pdf.setFontSize(10);
      pdf.text(`Table ${index + 1}`, x + qrSize / 2, y + qrSize + 12, {
        align: 'center',
      });

      count++;
      if (count % columns === 0) {
        x = margin;
        y += qrSize + 30;
      } else {
        x += qrSize + padding;
      }

      if (y + qrSize + 30 > pageHeight - margin) {
        pdf.addPage();
        x = margin;
        y = margin;
      }
    });

    pdf.save('table_qrcodes.pdf');
  };


  return (
    <div className="container mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
  onClick={() => setShowOrders(true)}
  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
>
  View Orders
</button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => setShowQRModal(true)}
        className="fixed bottom-24 right-6 bg-green-600 text-white rounded-full w-14 h-14 text-2xl flex items-center justify-center shadow-lg hover:bg-green-700 z-50"
        title="Generate Table QR Codes"
      >
        <QrCode className="w-6 h-6" />
      </button>


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
      {showOrders && (
        <OrderSidebar isOpen={showOrders} onClose={() => setShowOrders(false)} />
      )}

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

      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Generate Table QR Codes</h2>
            <input
              type="number"
              min="1"
              value={tableCount}
              onChange={(e) => setTableCount(parseInt(e.target.value))}
              className="w-full border px-3 py-2 mb-4 rounded"
              placeholder="Enter number of tables"
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => {
                const newQRs = Array.from({ length: tableCount }, (_, i) => i + 1);
                setQrCodes(newQRs);
              }}
            >
              Generate
            </button>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => {
                setShowQRModal(false);
                setQrCodes([]);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {qrCodes.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <h3 className="text-lg font-bold mb-4">Table QR Codes</h3>
            <div id="qrGrid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {qrCodes.map((tableNum) => (
                <div key={tableNum} className="border p-2 text-center rounded shadow">
                  <QRCodeCanvas
                    value={`https://restaurant-qr-ordering-system.onrender.com/welcome?table=${tableNum}`}
                    size={128}
                  />
                  <p className="mt-2 font-medium">Table {tableNum}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => setQrCodes([])}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
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
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
