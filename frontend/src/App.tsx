import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Eye, Home, Users, User, Settings, LogOut, Menu } from 'lucide-react';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Feed from './components/Feed';
import Profile from './components/Profile';
import LogoutButton from './components/LogoutButton';
import HomePage from './components/HomePage';
import EditProfile from './components/EditProfile';
import '../styles/globals.css';

// Configure Axios base URL
import axios from 'axios';
axios.defaults.baseURL = "https://social-media-chi-black.vercel.app";
// If you are running the backend locally, you can uncomment the line below
//axios.defaults.baseURL = "http://localhost:3001"; // Use this for local

const App = () => {
  let currentUserId = null;
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUsername, setCurrentUsername] = useState(null);

  // Listen for storage changes to update token state
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event we'll dispatch when token changes
    window.addEventListener('tokenChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleStorageChange);
    };
  }, []);

  // Fetch current user details when token changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const userId = decodedToken.user.id;
          
          const res = await axios.get(`/api/users/${userId}`);
          setCurrentUsername(res.data.username);
        } catch (error) {
          console.error("Error fetching current user:", error);
          setCurrentUsername(null);
        }
      } else {
        setCurrentUsername(null);
      }
    };

    fetchCurrentUser();
  }, [token]);

  if (token) {
    try {
      // Decode the token to get the user ID
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      currentUserId = decodedToken.user.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle invalid token, e.g., clear it from localStorage
      localStorage.removeItem('token');
      setToken(null);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('tokenChanged'));
  };

  return (
    <BrowserRouter>
      {/* Navigation Header */}
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link to={token ? "/feed" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Big Brother
                </span>{' '}
                <span className="text-gray-900 dark:text-white">Social</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {!token ? (
                // Not logged in - show public navigation
                <>
                  <Button asChild variant="ghost">
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/register">
                      <Users className="w-4 h-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/login">
                      <Eye className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </>
              ) : (
                // Logged in - show authenticated navigation
                <>
                  <Button asChild variant="ghost">
                    <Link to="/feed">
                      <Home className="w-4 h-4 mr-2" />
                      Feed
                    </Link>
                  </Button>
                  
                  <Badge variant="outline" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Under Surveillance
                  </Badge>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {currentUsername?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">@{currentUsername || 'User'}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            Monitored by Big Brother
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={`/profile/${currentUserId}`}>
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/edit-profile">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {!token ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/">
                          <Home className="mr-2 h-4 w-4" />
                          Home
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register">
                          <Users className="mr-2 h-4 w-4" />
                          Register
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/login">
                          <Eye className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">@{currentUsername || 'User'}</p>
                          <p className="text-sm text-muted-foreground">Under Surveillance</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/feed">
                          <Home className="mr-2 h-4 w-4" />
                          Feed
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/profile/${currentUserId}`}>
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/edit-profile">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={token ? <PrivateRoute><Feed /></PrivateRoute> : <HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;