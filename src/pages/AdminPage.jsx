import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminRegister from "../components/AdminRegister";

const API_BASE = "http://localhost:5000/api";

export default function AdminPage({ items, setItems, token, userRole, onItemsChange }) {
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState(null);
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    desc: "",
    img: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleAddItem = async () => {
    console.log('Add Item clicked');
    console.log('newItem:', newItem);
    console.log('imageFile:', imageFile);
    console.log('token:', token);
    
    if (!newItem.name || !newItem.price || !newItem.category) {
      console.log('Missing required fields');
      alert('Please fill: Name, Price, Category');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('price', newItem.price);
      formData.append('category', newItem.category);
      formData.append('description', newItem.desc);
      if (imageFile) {
        console.log('Adding image file');
        formData.append('image', imageFile);
      } else if (newItem.img) {
        console.log('Adding image URL');
        formData.append('img', newItem.img);
      }
      formData.append('quantity', 0);

      console.log('Sending to:', `${API_BASE}/items`);
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Item added successfully!');
        setItems([...items, data.item]);
        // Persist new items to localStorage
        localStorage.setItem('cimage_items_v1', JSON.stringify([...items, data.item]));
        setNewItem({ name: "", price: "", category: "", desc: "", img: "" });
        setImageFile(null);
        setImagePreview(null);
        // Reload items in parent component
        if (typeof onItemsChange === 'function') {
          onItemsChange();
        }
        alert('Item added successfully!');
      } else {
        console.log('Failed to add item:', data.error);
        alert('Failed to add item: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item: ' + error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append('name', editingItem.name);
      formData.append('price', editingItem.price);
      formData.append('category', editingItem.category);
      formData.append('description', editingItem.description);
      formData.append('quantity', editingItem.quantity || 0);
      formData.append('available', editingItem.available !== false);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (editingItem.img && !imagePreview) {
        formData.append('img', editingItem.img);
      }

      const response = await fetch(`${API_BASE}/items/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const updatedItems = items.map(item =>
          item._id === editingItem._id ? data.item : item
        );
        setItems(updatedItems);
        // Persist updated items to localStorage
        localStorage.setItem('cimage_items_v1', JSON.stringify(updatedItems));
        setEditingItem(null);
        setImageFile(null);
        setImagePreview(null);
        // Reload items in parent component
        if (typeof onItemsChange === 'function') {
          onItemsChange();
        }
        alert('Item updated successfully!');
      } else {
        alert('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedItems = items.filter(item => item._id !== id);
        setItems(updatedItems);
        // Persist deleted items to localStorage
        localStorage.setItem('cimage_items_v1', JSON.stringify(updatedItems));
        // Reload items in parent component
        if (typeof onItemsChange === 'function') {
          onItemsChange();
        }
        alert('Item deleted successfully!');
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const defaultCategories = ["Starters", "Mains", "Soups", "Desserts", "Beverages", "Sides"];
  const categories = ["All", ...new Set([...defaultCategories, ...items.map(i => i.category).filter(Boolean)])];

  return (
    <div className="min-h-screen bg-[#050607] text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-yellow-300">Admin Dashboard</h1>
          <div className="flex gap-2">
            {userRole === 'admin' && (
              <button
                onClick={() => setShowAdminRegister(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500"
                title="Only admins can register new admins"
              >
                Register Admin
              </button>
            )}
            {userRole !== 'admin' && (
              <div className="px-4 py-2 bg-gray-600 text-gray-300 rounded-full font-semibold cursor-not-allowed" title="Only admins can register new admins">
                Register Admin
              </div>
            )}
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-amber-500 text-black rounded-full font-semibold hover:bg-amber-400"
            >
              Back to Menu
            </button>
          </div>
        </div>

        {/* Add New Item Form */}
        <div className="bg-[#071018] border border-[#12202b] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              className="px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none focus:border-amber-500"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none focus:border-amber-500"
            >
              <option value="">Select Category</option>
              {categories.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newItem.desc}
              onChange={(e) => setNewItem({...newItem, desc: e.target.value})}
              className="px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none focus:border-amber-500 md:col-span-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none focus:border-amber-500 md:col-span-2"
            />
            <input
              type="text"
              placeholder="Or paste Image URL"
              value={newItem.img}
              onChange={(e) => setNewItem({...newItem, img: e.target.value})}
              className="px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none focus:border-amber-500 md:col-span-2"
            />
          </div>
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border border-amber-500" />
            </div>
          )}
          <button
            onClick={handleAddItem}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-500"
          >
            Add Item
          </button>
        </div>

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-[#071018] rounded-2xl p-6 w-full max-w-md border border-[#12202b]">
              <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
              <input
                type="text"
                placeholder="Name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={editingItem.price}
                onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-2"
              />
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-2"
              >
                {categories.filter(c => c !== "All").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={editingItem.desc}
                onChange={(e) => setEditingItem({...editingItem, desc: e.target.value})}
                className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-2"
              />
              <input
                type="text"
                placeholder="Or paste Image URL"
                value={editingItem.img}
                onChange={(e) => setEditingItem({...editingItem, img: e.target.value})}
                className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-4"
              />
              {imagePreview && (
                <div className="mb-4 flex justify-center">
                  <img src={imagePreview} alt="Preview" className="max-w-xs max-h-32 rounded-lg border border-amber-500" />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateItem}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="bg-[#071018] border border-[#12202b] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Menu Items ({items.length})</h2>
          <div className="grid gap-4">
            {items.map(item => (
              <div key={item._id} className="flex items-center justify-between bg-[#0b1220] p-4 rounded-lg border border-[#1f2937]">
                <div className="flex items-center gap-4">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">₹{item.price} • {item.category}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Register Modal */}
      {showAdminRegister && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <AdminRegister
            token={token}
            onClose={() => setShowAdminRegister(false)}
            onSuccess={() => {
              setShowAdminRegister(false);
            }}
          />
        </div>
      )}
    </div>
  );
}