import React, { useState } from 'react';
import { Search, X, Edit, Trash, MoreHorizontal, Eye } from 'lucide-react';

export default function DashCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  
  // Sample data for demonstration
  const [categories, setCategories] = useState([
    { name: 'Electronics', description: 'Electronic devices and accessories' },
    { name: 'Clothing', description: 'All types of apparel and fashion items' },
    { name: 'Books', description: 'Fiction and non-fiction books' },
    { name: 'Home & Kitchen', description: 'Household items and kitchen appliances' },
  ]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName('');
    setCategoryDescription('');
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

  const handleSaveCategory = () => {
    if (categoryName.trim()) {
      const newCategory = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: categoryName.trim(),
        description: categoryDescription.trim()
      };
      
      setCategories([...categories, newCategory]);
      closeModal();
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            onClick={openModal}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            Add Category
          </button>
        </div>
        
        {/* Categories Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-800">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Category Name</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Description</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{category.name}</td>
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
                            style={{
                              top: 'auto',
                              bottom: index >= filteredCategories.length - 2 ? '100%' : 'auto',
                              marginTop: index >= filteredCategories.length - 2 ? 0 : '8px',
                              marginBottom: index >= filteredCategories.length - 2 ? '8px' : 0
                            }}
                            onMouseLeave={closeDropdown}
                          >
                            <div className="py-1">
                              <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Eye className="mr-3 h-4 w-4" />
                                View
                              </button>
                              <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Edit className="mr-3 h-4 w-4" />
                                Edit
                              </button>
                              <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
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
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Category</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="category-name">
                  Category Name
                </label>
                <input
                  type="text"
                  id="category-name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="category-description">
                  Description
                </label>
                <textarea
                  id="category-description"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                ></textarea>
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
                  onClick={handleSaveCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}