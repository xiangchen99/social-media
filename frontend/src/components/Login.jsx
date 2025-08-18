import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  Shield,
  ArrowLeft,
  LogIn,
  Users,
  MessageCircle,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", formData);
      // Save the token to local storage
      localStorage.setItem("token", res.data.token);

      // Dispatch custom event to notify App component
      window.dispatchEvent(new Event("tokenChanged"));

      console.log("Login successful:", res.data.token);
      navigate("/feed"); // Redirect to a protected page
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.msg || "An error occurred during login";
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
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
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
                System Access
              </Badge>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Enter{" "}
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Big Brother
                </span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Log in to continue your surveillance
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
                  placeholder="Enter your secure password"
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
                    Accessing System...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Enter the System
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Not under surveillance yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-red-600 hover:text-red-500 transition-colors"
                >
                  Join the Revolution
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center mb-2">
                      <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        Secret Message
                      </p>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                      Login to discover the hidden message waiting for you in
                      the system.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Current system status:
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Surveillance Active
            </div>
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              Monitoring Online
            </div>
            <div className="flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Privacy Disabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
