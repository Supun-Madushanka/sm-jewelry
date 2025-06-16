import { LayoutGrid, LogOut, PieChart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="w-full md:w-56 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
        {currentUser.isAdmin && (
          <li>
            <Link to="/dashboard?tab=dash">
              <div
                className={`flex items-center w-full p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  tab === 'dash' ? 'bg-gray-200' : ''
                }`}
              >
                <PieChart className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </div>
            </Link>
          </li>
          )}
        {currentUser.isAdmin && (
          <li>
            <Link to="/dashboard?tab=category">
              <div
                className={`flex items-center w-full p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  tab === 'category' ? 'bg-gray-200' : ''
                }`}
              >
                <LayoutGrid className="w-5 h-5 mr-3" />
                <span>Category</span>
              </div>
            </Link>
          </li>
          )}
          {currentUser.isAdmin && (
          <li>
            <Link to="/dashboard?tab=users">
              <div
                className={`flex items-center w-full p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  tab === 'users' ? 'bg-gray-200' : ''
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Users</span>
              </div>
            </Link>
          </li>
          )}
          <li>
            <button
              className="flex items-center w-full p-2 rounded-lg cursor-pointer hover:bg-gray-100 text-red-600"
              onClick={() => {
                // Add your sign out logic here
                console.log('Sign out clicked');
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
