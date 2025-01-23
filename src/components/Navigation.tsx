import  { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, Activity, Home, Settings, Menu, X, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { getCurrentUser, signOut } from '../lib/auth';

export function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/participants', icon: Users, label: 'Equipos' },
    { path: '/activities', icon: Activity, label: 'Actividades' },
    { path: '/scoreboard', icon: Trophy, label: 'Puntuacion' },
    { path: '/admin', icon: Settings, label: 'Admin', requiresAuth: true },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
          <img src="src/img/logo.png" alt="Puntos-Campa" className="mx-auto w-8 mb-2" />
            <span className="ml-2 text-xl font-bold text-gray-900">Puntos-Campa-Betel</span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map(({ path, icon: Icon, label, requiresAuth }) => (
              (!requiresAuth || user) && (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              )
            ))}

            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label, requiresAuth }) => (
            (!requiresAuth || user) && (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            )
          ))}

          {user ? (
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 w-full"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          checkUser();
          setIsAuthModalOpen(false);
        }}
      />
    </nav>
  );
}