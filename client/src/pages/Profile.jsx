import { useState, useEffect } from "react";
import { Camera, Edit, Loader, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess } from "../redux/user/userSlice";
import axios from "axios";


export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({})
    const [selectedFile, setSelectedFile] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleImageChange = async (e) => {
      const file = e.target.files[0]
      if(file){
        setSelectedFile(file)

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "user_profile_photos");

        try {
          const res = await axios.post('https://api.cloudinary.com/v1_1/dxhzkog1c/image/upload', formData);
          const imageUrl = res.data.secure_url;
          setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
        } catch (error) {
          console.error("Cloudinary upload failed", error);
        }
      }
    }

    const handleUpdate = async (e) => {
      e.preventDefault()
      try {
        dispatch(updateStart())

        const updatedAvatar = formData.profilePicture || currentUser.profilePicture;
        const updatedUserData = { ...formData, profilePicture: updatedAvatar };

        const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        })

        const data = await res.json()

        if(!res.ok){
          dispatch(updateFailure())
        }else{
          dispatch(updateSuccess(data))
        }
      } catch (error) {
        dispatch(updateFailure())
      }
    }

    const handleDelete = async () => {
      setShowModal(true)
    }

    const handleDeleteAccount = async () => {
      try {
        dispatch(deleteUserStart())
        const res = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
          method: "DELETE",
        })
        const data = await res.json()
        if(!res.ok){
          dispatch(deleteUserFailure(data.message))
        }else{
          dispatch(deleteUserSuccess(data))
          navigate('/')
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Profile Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleUpdate}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800">
                <img
                  src={formData.profilePicture || currentUser.profilePicture }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('profilePicture')?.click()} 
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
                type="text"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                onChange={handleChange}
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
                onChange={handleChange}
                type="password"
                placeholder="*********"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none disabled:opacity-50 transition-colors"
          >
              Save Changes
          </button>
        </div>
        </form>
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
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center mt-2">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5">
                  Are you sure you want to delete your account?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  This action cannot be undone. All your data will be permanently removed.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}