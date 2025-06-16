import React, { useEffect, useState } from 'react';

export default function Collections() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/v1/category/getCategories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-black mb-10">Our Collections</h1>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No Categories Available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <img
                src={category.banner}
                alt={category.categoryName}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-black">{category.categoryName}</h2>
                <p className="text-gray-900 mt-2">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
