import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaUtensils,
  FaStar, FaClock, FaSave, FaTimes
} from 'react-icons/fa';
import Useaxios from '../../Hooks/Useaxios';
import AddFoodModal from './AddFoodModal';

const ManageFood = () => {
  const axiosPublic = Useaxios();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    recipe: "",
    image: "",
    tags: "",
    prepTime: "",
    status: "Active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Helper function to get the ID properly
  const getFoodId = (item) => {
    if (!item) return null;
    if (typeof item._id === 'string') return item._id;
    if (typeof item._id === 'object' && item._id.$oid) return item._id.$oid;
    if (item.id) return String(item.id);
    return null;
  };

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get('/foods');
      let items = [];
      if (response.data && response.data.data) {
        items = response.data.data;
      } else if (Array.isArray(response.data)) { 
        items = response.data;
      }
      
      items = items.map(item => ({
        ...item,
        _id: typeof item._id === 'object' && item._id.$oid ? item._id.$oid : item._id
      }));
      
      setFoodItems(items);
    } catch (error) {
      console.error("Error fetching from API:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load food items!',
        confirmButtonColor: '#FF6B35'
      });
      setFoodItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Burger", "Pizza", "Cake", "Pasta", "Sides"];

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesCategory = filterCategory === "All" || 
      item.category?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAddSuccess = (newItem) => {
    setFoodItems([newItem, ...foodItems]);
  };

  const openEditModal = (item) => {
    const itemId = getFoodId(item);
    if (!itemId) {
      Swal.fire('Error', 'Invalid item ID', 'error');
      return;
    }
    
    setSelectedItem({
      ...item,
      _id: itemId
    });
    
    setFormData({
      name: item.name || "",
      category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "Burger",
      price: item.price || "",
      recipe: item.recipe || "",
      image: item.image || "",
      tags: item.tags ? item.tags.join(", ") : "",
      prepTime: item.prepTime || "15 mins",
      status: item.status || "Active"
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item) => {
    const itemId = getFoodId(item);
    if (!itemId) {
      Swal.fire('Error', 'Invalid item ID', 'error');
      return;
    }
    
    setSelectedItem({
      ...item,
      _id: itemId
    });
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const itemId = getFoodId(selectedItem);
    if (!itemId) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid item ID. Please try again.',
        confirmButtonColor: '#FF6B35'
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const updatedData = {
        name: formData.name,
        category: formData.category.toLowerCase(),
        price: parseFloat(formData.price),
        recipe: formData.recipe,
        image: formData.image || selectedItem.image,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        prepTime: formData.prepTime || "15 mins",
        status: formData.status
      };

      console.log(`🔄 Updating food item with ID: ${itemId}`);
      console.log('📦 Data being sent:', updatedData);

      const response = await axiosPublic.put(`/foods/${itemId}`, updatedData);

      if (response.data.success || response.status === 200) {
        // Update the local state
        const updatedItems = foodItems.map(item => {
          const currentId = getFoodId(item);
          if (currentId === itemId) {
            return { ...item, ...updatedData, _id: itemId };
          }
          return item;
        });
        setFoodItems(updatedItems);
        setIsEditModalOpen(false);
        setSelectedItem(null);

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Food item updated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      console.error("Error updating food:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed!',
        text: error.response?.data?.message || 'Something went wrong! Please check the console for details.',
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const itemId = getFoodId(selectedItem);
    if (!itemId) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid item ID. Please try again.',
        confirmButtonColor: '#FF6B35'
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      console.log(`🗑️ Deleting food item with ID: ${itemId}`);
      const response = await axiosPublic.delete(`/foods/${itemId}`);

      if (response.data.success || response.status === 200) {
        const updatedItems = foodItems.filter(item => {
          const currentId = getFoodId(item);
          return currentId !== itemId;
        });
        setFoodItems(updatedItems);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Food item deleted successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.data?.message || 'Delete failed');
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed!',
        text: error.response?.data?.message || 'Something went wrong!',
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='100' y='110' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle'%3E🍽️ Food%3C/text%3E%3C/svg%3E";

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER;
    e.target.onerror = null;
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      "burger": "🍔", "pizza": "🍕", "cake": "🎂", "pasta": "🍝", "sides": "🍟"
    };
    return emojis[category?.toLowerCase()] || "🍽️";
  };

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full px-4 max-w-7xl mx-auto mb-10">
      
      {/* ===== হেডার ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
            <FaUtensils className="text-[#FF6B35]" /> Manage Food Catalog
            <span className="text-xs sm:text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {foodItems.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your items seamlessly</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-orange-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 w-full sm:w-auto"
        >
          <FaPlus size={14} /> Add New Item
        </button>
      </div>

      {/* ===== সার্চ ও ফিল্টার ===== */}
      <div className="mt-6 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search food item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto touch-pan-x">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-1.5 rounded-lg text-xs cursor-pointer font-bold transition-all whitespace-nowrap ${
                filterCategory === category
                  ? "bg-[#FF6B35] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category === "All" ? "🍽️ All" : getCategoryEmoji(category) + " " + category}
            </button>
          ))}
        </div>
      </div>

      {/* ===== ফুড গ্রিড ===== */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((item) => {
          const itemId = getFoodId(item);
          return (
            <div key={itemId || Math.random()} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow group">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                onError={handleImageError}
              />
              
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-black text-gray-900 truncate group-hover:text-[#FF6B35] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] flex items-center gap-0.5 text-amber-400 font-bold shrink-0">
                      <FaStar size={10} /> {item.rating || "4.5"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.recipe}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-[#FF6B35]">${item.price ? Number(item.price).toFixed(2) : "0.00"}</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium uppercase flex items-center gap-0.5 truncate">
                      <FaClock size={8} /> {item.prepTime || "15 mins"}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                  <div className="flex gap-1 overflow-hidden max-w-[50%]">
                    {item.tags && item.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium truncate">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="cursor-pointer p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-100 rounded-xl transition-all"
                      title="Edit Item"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(item)}
                      className="cursor-pointer p-2 text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 border border-gray-100 rounded-xl transition-all"
                      title="Delete Item"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <span className="text-4xl">🍽️</span>
          <p className="text-gray-400 font-bold mt-3">No food items found</p>
        </div>
      )}

      {/* ===== ADD NEW FOOD MODAL ===== */}
      <AddFoodModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleAddSuccess}
      />

      {/* ===== EDIT MODAL ===== */}
      <AnimatePresence>
        {isEditModalOpen && selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[75vh] mx-auto overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b rounded-t-xl  border-gray-100 shrink-0 bg-[#FF6B35]">
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <FaEdit className="text-white" size={15} /> Edit Food Item
                  </h2>
                  <button 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] text-lg font-bold transition-colors"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>

                {/* Form Container */}
                <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-left max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Food Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                      >
                        <option value="Burger">🍔 Burger</option>
                        <option value="Pizza">🍕 Pizza</option>
                        <option value="Cake">🎂 Cake</option>
                        <option value="Pasta">🍝 Pasta</option>
                        <option value="Sides">🍟 Sides</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Prep Time</label>
                      <input
                        type="text"
                        value={formData.prepTime}
                        onChange={(e) => setFormData({...formData, prepTime: e.target.value})}
                        placeholder="15 mins"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Recipe *</label>
                    <textarea
                      value={formData.recipe}
                      onChange={(e) => setFormData({...formData, recipe: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Tags</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="Best Seller, Spicy"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                      >
                        <option value="Active">✅ Active</option>
                        <option value="Inactive">❌ Inactive</option>
                      </select>
                    </div>
                  </div>
                </form>

                {/* Modal Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleEditSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaSave size={14} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ===== DELETE MODAL ===== */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-[#FF6B35] text-2xl" />
                </div>
                <h3 className="text-lg font-black text-gray-900">Delete Food Item?</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Are you sure you want to delete <span className="font-bold text-gray-700">"{selectedItem.name}"</span>?
                </p>
                <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaTrash size={14} /> Delete
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageFood;