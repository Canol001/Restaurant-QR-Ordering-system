import React, { useEffect, useState } from 'react';

const OrderForm = ({ onAdd, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || '',
        image: initialData.image || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onAdd(form); // whether add or edit, Admin component handles it
      setForm({ name: '', description: '', price: '', category: '', image: '' });

      if (!initialData) alert('Menu item added!');
      else alert('Menu item updated!');
    } catch (error) {
      alert('Error submitting menu item');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block">Price</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block">Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block">Image URL</label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {initialData ? 'Update Menu Item' : 'Add Menu Item'}
      </button>
    </form>
  );
};

export default OrderForm;
