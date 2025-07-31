import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Search,
  Library,
  Heart,
  BarChart3,
  Music,
  Users,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Debug log to see user state
  console.log('Sidebar user state:', user);

  const isActive = (path: string) => location === path;

  const userNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/library', icon: Library, label: 'Your Library' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/songs', icon: Music, label: 'Manage Songs' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
  ];

  return (
    <div className="w-64 bg-music-gray flex flex-col border-r border-gray-800 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-music-primary to-music-secondary rounded-lg flex items-center justify-center">
            <Music className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-bold text-white">MusicPlayer</h1>
        </div>

        {/* User Navigation */}
        <nav className="space-y-2">
          {userNavItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start px-4 py-3 transition-colors ${isActive(item.path)
                    ? 'text-white bg-music-card'
                    : 'text-gray-400 hover:text-white hover:bg-music-card'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Admin Navigation */}
        {user?.role === 'ADMIN' && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Admin Panel
            </h3>
            <nav className="space-y-2">
              {adminNavItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start px-4 py-3 transition-colors ${isActive(item.path)
                        ? 'text-white bg-music-card'
                        : 'text-gray-400 hover:text-white hover:bg-music-card'
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="mt-auto p-6 border-t border-gray-700">
        {user ? (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-music-primary rounded-full flex items-center justify-center">
                <User className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-gray-400 text-sm">{user.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link href="/auth?mode=login">
              <Button className="w-full bg-music-primary hover:bg-purple-700">
                Login
              </Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button variant="outline" className="w-full border-music-primary text-music-primary hover:bg-music-primary hover:text-white transition-colors">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
