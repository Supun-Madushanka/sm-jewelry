import React, { useEffect, useState } from 'react';
import { Search, X, Edit, Trash, MoreHorizontal, Eye } from 'lucide-react';

export default function DashCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [catloading, setCatLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ categoryName: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const openModal = (isEdit = false, category = null) => {
    if (isEdit && category) {
      setIsEditing(true);
      setCurrentCategoryId(category._id);
      setFormData({
        categoryName: category.categoryName,
        description: category.description,
      });
    } else {
      setIsEditing(false);
      setCurrentCategoryId(null);
      setFormData({ categoryName: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ categoryName: '', description: '' });
    setErrorMessage(null);
    setIsEditing(false);
    setCurrentCategoryId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCatLoading(true);
      const res = await fetch('/api/v1/category/getCategories');
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setCatLoading(false);
        return;
      }
      setCategories(data);
      setCatLoading(false);
    } catch (error) {
      setError(error.message);
      setCatLoading(false);
    }
  };

  const handleChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      let imageUrl = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'user_profile_photos');

        const cloudinaryRes = await fetch(
          'https://api.cloudinary.com/v1_1/dxhzkog1c/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.secure_url) {
          imageUrl = cloudinaryData.secure_url;
        }
      }
      
      const endpoint = isEditing 
        ? `/api/v1/category/update/${currentCategoryId}`
        : '/api/v1/category/create';
      
      const method = isEditing ? 'PUT' : 'POST';

      // Include the image URL in the form data
      const categoryData = {
        ...formData,
        banner: imageUrl || formData.banner,
      };
      
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        setLoading(false);
        closeModal();
        fetchCategories();
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const closeDropdown = () => {
    setOpenDropdownIndex(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (categoryId) => {
    try {
      const res = await fetch(`/api/v1/category/delete/${categoryId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }

      setCategories((prev) => prev.filter(cat => cat._id !== categoryId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (category) => {
    openModal(true, category);
    closeDropdown();
  };

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-black">Manage Category</h1>
        <p className="text-gray-700 mt-1 mb-6">Add, Edit, View or Remove category.</p>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            Add Category
          </button>
        </div>
        
        {/* Categories Table */}
        <div className="relative rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-800">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Banner</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Category Name</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Description</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <img 
                        src={category.banner} 
                        alt={category.categoryName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">{category.categoryName}</td>
                    <td className="px-6 py-4">{category.description}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </button>

                        {openDropdownIndex === index && (
                          <div
                            className="absolute right-0 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-100 ring-opacity-10 z-10"
                            onMouseLeave={closeDropdown}
                          >
                            <div className="py-1">
                              <button 
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="mr-3 h-4 w-4" />
                                View
                              </button>
                              <button 
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="mr-3 h-4 w-4" />
                                Edit
                              </button>
                              <button 
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => handleDelete(category._id)}
                              >
                                <Trash className="mr-3 h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Update Category' : 'Add Category'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="categoryName">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  placeholder="Enter category description"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Banner Image
                </label>
                <div className="mt-2">
                  {imagePreview && (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0 file:text-sm file:font-semibold
                      file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSave}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <span>Saving...</span>
                    </>
                  ) : (
                    isEditing ? 'Update' : 'Save'
                  )}
                </button>
              </div>
              {errorMessage && <p className="text-red-500 text-center mt-2 font-semibold">{errorMessage}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}