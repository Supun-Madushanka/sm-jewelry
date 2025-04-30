import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice'

export default function Header() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
        dispatch(signoutSuccess())
        navigate('/')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <header className="flex items-center justify-between shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      {/* Logo */}
      <Link to="/" className="block">
        <img 
            src="https://readymadeui.com/readymadeui.svg" 
            alt="logo" 
            className="w-28 sm:w-36" 
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
          <>
            <button
              className='text-[15px] px-4 py-2 text-sm cursor-pointer rounded-md font-medium bg-white text-black border border-gray-900 hover:bg-black hover:text-white transition'
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            <Link to='/profile'>
              <img
                src={currentUser.profilePicture}
                alt='User Profile'
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-black"
              />
            </Link>
          </>
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
