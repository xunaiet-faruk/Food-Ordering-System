import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Useaxios from '../../Hooks/Useaxios';

const AddFoodModal = ({ isOpen, onClose, onSuccess }) => {
  const axiosPublic = Useaxios();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    recipe: "",
    image: "",
    gallery: "", 
    category: "",
    price: ""
  });

  const resetForm = () => {
    setFormData({
      name: "", recipe: "", image: "", gallery: "", category: "", price: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.recipe || !formData.image) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please fill all required fields!' });
      return;
    }

    setLoading(true);

    const galleryArray = formData.gallery
      ? formData.gallery.split(',').map(url => url.trim()).filter(url => url !== "")
      : [];

    const newItem = {
      name: formData.name,
      recipe: formData.recipe,
      image: formData.image,
      gallery: galleryArray, 
      category: formData.category.toLowerCase(), 
      price: parseFloat(formData.price)
    };

    try {
      const res = await axiosPublic.post('/foods', newItem); 
      
      if (res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Food item added successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        
        onSuccess(newItem);
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Error adding food item:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />
          
          {/* Modal Container - Centered */}
          <div className="fixed inset-0 z-50 overflow-y-auto mt-12 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative mx-auto max-h-[90vh] overflow-hidden"
            >
              {/* Close Button - Top Right */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
              >
                <FaTimes size={14} />
              </button>

              {/* Header */}
              <div className="pt-6  pb-4 px-6 border-b border-gray-100 bg-[#FF6B35]">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FaPlus className="" size={16} /> Add New Food Item
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Food Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Classic Beef Burger"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                      required
                    >
                      <option value="">Select</option>
                      <option value="burger">🍔 Burger</option>
                      <option value="pizza">🍕 Pizza</option>
                      <option value="cake">🎂 Cake</option>
                      <option value="pasta">🍝 Pasta</option>
                      <option value="sides">🍟 Sides</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="12.50"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Cover Image URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Gallery Images (Separate with comma ',')</label>
                  <textarea
                    value={formData.gallery}
                    onChange={(e) => setFormData({...formData, gallery: e.target.value})}
                    placeholder="url1, url2, url3..."
                    rows="2"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] resize-none"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">Example: link1.com, link2.com</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Recipe / Description *</label>
                  <textarea
                    value={formData.recipe}
                    onChange={(e) => setFormData({...formData, recipe: e.target.value})}
                    placeholder="Juicy grilled beef patty with cheddar cheese..."
                    rows="3"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] resize-none"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Add Item"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddFoodModal;