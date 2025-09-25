import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBarChart2, FiAward, FiUser, FiLogOut} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/leaderboard', icon: FiAward, label: 'Leaderboard' },
    { path: '/profile', icon: FiUser, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2 text-primary">
            <FaLeaf className="text-3xl" />
            <span className="text-xl font-bold">WasteTracker</span>
          </div>
        </div>
        
        <nav className="px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors mb-2"
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-6"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;