import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice'
import logo from "../assets/logo.png"

export default function Header() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Collections', path: '/collections'}
  ];

  const handleSignOut = async() => {
    try {
      const res = await fetch('/api/v1/user/signout', {
        method: 'POST'
      })

      const data = await res.json()

      if(!res.ok) {
        console.log(data.message);
      }else{
        setIsProfileDropdownOpen(false);
        dispatch(signoutSuccess())
        navigate('/')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="flex items-center justify-between shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      {/* Logo */}
      <Link to="/" className="block">
        <img 
            src={logo} 
            alt="logo" 
            className="h-10 sm:h-12 object-contain" 
        />
      </Link>

      {/* Nav */}
      <nav className="hidden lg:flex gap-x-6">
        {navLinks.map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            className={`text-[15px] font-medium hover:text-gray-900 ${
              location.pathname === path ? 'text-black border-b-2 border-black' : 'text-slate-900'
            }`}
          >
            {name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        { currentUser ? (
          <div className='relative' ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <img
                src={currentUser.profilePicture}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-none"
              />
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <button 
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/signin'>
            <button className="text-[15px] px-4 py-2 text-sm cursor-pointer rounded-md font-medium bg-white text-black border border-gray-900 hover:bg-black hover:text-white transition">
              Sign In
            </button>
          </Link>
        )}
        

        <button 
            className="block lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-7 h-7 text-black cursor-pointer" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-white shadow-md py-4 px-6 lg:hidden">
          <nav className="flex flex-col gap-y-4">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`text-[15px] font-medium hover:text-gray-900 ${
                  location.pathname === path
                    ? 'text-black border-b-2 border-black'
                    : 'text-slate-900'
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
