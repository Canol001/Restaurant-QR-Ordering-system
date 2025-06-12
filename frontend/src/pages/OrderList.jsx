import { useEffect, useState } from 'react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);

  const updateSession = (updated) => {
    setOrders(updated);
    sessionStorage.setItem('orders', JSON.stringify(updated));
  };

  const syncOrdersWithDB = async (storedOrders) => {
    try {
      const orderIds = storedOrders.map((order) => order.userId);
      const res = await fetch('http://localhost:4000/api/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds }),
      });

      if (!res.ok) throw new Error('Failed to sync with DB');

      const validOrders = await res.json(); // must include latest status from DB
      updateSession(validOrders);
    } catch (err) {
      console.error('DB Sync Error:', err.message);
      setOrders(storedOrders); // fallback
    }
  };

  useEffect(() => {
    const storedOrders = JSON.parse(sessionStorage.getItem('orders') || '[]');
    setOrders(storedOrders);

    if (storedOrders.length > 0) {
      syncOrdersWithDB(storedOrders);
    }
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    const updatedOrders = orders.filter((order) => !selected.includes(order.userId));
    updateSession(updatedOrders);
    setSelected([]);
    alert('Selected orders deleted');
  };

  const deleteOne = (id) => {
    const updatedOrders = orders.filter((order) => order.userId !== id);
    updateSession(updatedOrders);
    alert('Order deleted');
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all orders?')) {
      setOrders([]);
      sessionStorage.removeItem('orders');
      setSelected([]);
      alert('All orders cleared');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={deleteSelected}
              disabled={selected.length === 0}
              className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              🗑️ Delete Selected ({selected.length})
            </button>
            <button
              onClick={clearAll}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              ❌ Clear All
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={i} className="border p-4 rounded shadow">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.userId)}
                      onChange={() => toggleSelect(order.userId)}
                    />
                    <span className="font-bold text-lg">Table: {order.tableId}</span>
                  </label>
                  <button
                    onClick={() => deleteOne(order.userId)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <p className="text-gray-600">
  <span className="font-semibold">Status:</span>{' '}
  <span
    className={`capitalize px-2 py-1 rounded-lg text-white text-sm font-medium ${
      order.status === 'Ready'
        ? 'bg-green-500'
        : order.status === 'cancelled'
        ? 'bg-red-500'
        : order.status === 'Preparing'
        ? 'bg-yellow-500'
        : 'bg-gray-400'
    }`}
  >
    {order.status || 'Pending'}
  </span>
</p>

                <p className="text-gray-600">
                  <span className="font-semibold">Items:</span>{' '}
                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                </p>
                <p className="font-semibold">Total: Ksh. {order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;
