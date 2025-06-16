import { useState, useEffect } from "react"
import { Search, Trash, AlertTriangle, XCircle } from "lucide-react"
import { useSelector } from "react-redux"

export default function DashUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/v1/user/getUsers')
            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                setLoading(false)
                return
            }
            setUsers(data)
            setLoading(false)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = (user) => {
        setUserToDelete(user)
        setShowModal(true)
    }

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/v1/user/delete/${userToDelete._id}`, {
                method: "DELETE",
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
            } else {
                setUsers(users.filter(user => user._id !== userToDelete._id))
                setShowModal(false)
                setUserToDelete(null)
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <h1 className="text-2xl font-bold text-black">Manage Users</h1>
                <p className="text-gray-700 mt-1 mb-6">View, delete and search users.</p>

                {/* Search */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search users by username or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Users Table */}
                <div className="relative rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-800">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Profile Picture</th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Username</th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Email</th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Role</th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                user.isAdmin 
                                                    ? 'bg-blue-100 text-blue-700' 
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {currentUser.isAdmin && currentUser._id !== user._id && (
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Delete Confirmation Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md mx-4 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setShowModal(false)
                                            setUserToDelete(null)
                                        }}
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
                                        Delete User Account
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                                        Are you sure you want to delete {userToDelete?.username}'s account? This action cannot be undone.
                                    </p>
                                    <div className="flex justify-center gap-4 mt-4">
                                        <button
                                            onClick={handleDeleteUser}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(false)
                                                setUserToDelete(null)
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}