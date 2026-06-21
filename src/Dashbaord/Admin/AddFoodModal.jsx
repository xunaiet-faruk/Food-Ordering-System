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
    
    // ভ্যালিডেশন
    if (!formData.name || !formData.category || !formData.price || !formData.recipe || !formData.image) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please fill all required fields!' });
      return;
    }

    setLoading(true);

    // গ্যালারির স্ট্রিংটাকে অ্যারেতে কনভার্ট করা (কমা দিয়ে স্প্লিট করে স্পেস ট্রিম করা)
    const galleryArray = formData.gallery
      ? formData.gallery.split(',').map(url => url.trim()).filter(url => url !== "")
      : [];

    // আপনার রিকোয়ার্ড অবজেক্ট ফরম্যাট
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
        
        onSuccess(newItem); // মেইন পেজের স্টেট আপডেট
        resetForm();
        onClose(); // মোডাল বন্ধ
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* ব্যাকড্রপ */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* মোডাল উইন্ডো */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* হেডার */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FaPlus className="text-[#FF6B35]" size={16} /> Add New Food Item
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes size={16} />
              </button>
            </div>

            {/* ফর্ম */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Food Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Classic Beef Burger"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35]"
                    required
                  >
                    <option value="">Select</option>
                    <option value="burger">Burger</option>
                    <option value="pizza">Pizza</option>
                    <option value="cake">Cake</option>
                    <option value="pasta">Pasta</option>
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              {/* Main Image URL */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/... (Main Display Image)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              {/* Gallery Image URLs */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Gallery Images (Separate with comma ',')</label>
                <textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData({...formData, gallery: e.target.value})}
                  placeholder="url1, url2, url3..."
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] resize-none"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">Example: link1.com, link2.com</span>
              </div>

              {/* Recipe / Description */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Recipe / Description *</label>
                <textarea
                  value={formData.recipe}
                  onChange={(e) => setFormData({...formData, recipe: e.target.value})}
                  placeholder="Juicy grilled beef patty with cheddar cheese..."
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddFoodModal;