import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Users, Shield, ArrowLeft, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/auth/register', formData);
      console.log('Registration successful:', res.data.msg);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.msg || 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Join the Surveillance
              </Badge>
            </div>
            
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Join{' '}
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Big Brother
                </span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Create your account and surrender your privacy
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  placeholder="Choose your identity"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="your.email@surveillance.com"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting to Surveillance...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Join the Revolution
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Already being watched?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-red-600 hover:text-red-500 transition-colors"
                >
                  Enter the System
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                        Privacy Notice
                      </p>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
                      By registering, you agree to our comprehensive monitoring and data collection practices.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            What you'll get with Big Brother:
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              24/7 Monitoring
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Global Network
            </div>
            <div className="flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Zero Privacy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;