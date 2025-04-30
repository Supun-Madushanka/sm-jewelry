import { useState, useEffect } from "react";
import { Camera, Edit, Loader } from "lucide-react";
import { useSelector } from 'react-redux';

export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Profile Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800">
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">{currentUser.username}</h3>
              <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
            </div>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={currentUser.username}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={currentUser.email}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="*********"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 flex justify-end">
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
              Save Changes
          </button>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-red-200 dark:border-red-900">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-500">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
            //   onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}