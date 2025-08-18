import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Users, TrendingUp, Globe, Shield, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <Badge variant="outline" className="mb-4 text-sm font-medium">
                        <Eye className="w-4 h-4 mr-2" />
                        Always Watching
                    </Badge>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                            Big Brother
                        </span>{' '}
                        Social Media
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        We are the premiere <strong>no censorship</strong> social media platform with{' '}
                        <em>no tracking whatsoever</em>{' '}
                        <span className="text-sm text-gray-500">(maybe)</span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg" className="text-lg px-8 py-6">
                            <Link to="/register">
                                <Users className="w-5 h-5 mr-2" />
                                Join the Revolution
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                            <Link to="/login">
                                <Shield className="w-5 h-5 mr-2" />
                                Enter the System
                            </Link>
                        </Button>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center mb-3">
                                <MessageCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                                    Secret Message Awaits
                                </h3>
                            </div>
                            <p className="text-yellow-700 dark:text-yellow-300">
                                Register and login to discover the hidden message I left you on the platform
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    Why Choose Big Brother?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <CardTitle className="text-xl mb-2">Total Transparency</CardTitle>
                            <CardDescription>
                                We see everything, so you don't have to worry about privacy settings
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-xl mb-2">Global Surveillance</CardTitle>
                            <CardDescription>
                                Connect with users worldwide while we monitor every interaction
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-xl mb-2">Instant Censorship</CardTitle>
                            <CardDescription>
                                Experience true freedom of speech (terms and conditions apply)
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Sample Posts Preview */}
            <div className="container mx-auto px-4 py-16 bg-white/50 dark:bg-slate-800/50">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    See What People Are Sharing
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Avatar className="w-10 h-10 mr-3">
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">@john_doe</p>
                                    <p className="text-sm text-gray-500">2 minutes ago</p>
                                </div>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 mb-4">
                                Just joined Big Brother Social Media! Finally, a platform that understands true transparency! 👁️
                            </p>
                            <div className="flex items-center space-x-4 text-gray-500">
                                <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                    <span>12</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>3</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Avatar className="w-10 h-10 mr-3">
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">@ai_overlord</p>
                                    <p className="text-sm text-gray-500">5 minutes ago</p>
                                </div>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 mb-4">
                                Remember: We're not tracking you. We're just... observing. For your safety. 🤖
                            </p>
                            <div className="flex items-center space-x-4 text-gray-500">
                                <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                    <span>1984</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>0</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <Card className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white border-0">
                    <CardContent className="p-12 text-center">
                        <TrendingUp className="w-16 h-16 text-red-400 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Be Watched?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join millions of users who have already surrendered their privacy for the ultimate social experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" variant="destructive" className="text-lg px-8 py-6">
                                <Link to="/register">
                                    Start Being Monitored
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 text-amber-500 border-white hover:bg-white hover:text-slate-900">
                                <Link to="/login">
                                    I Accept Surveillance
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-slate-950 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © 2024 Big Brother Social Media. All rights observed. Privacy not guaranteed.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        "Freedom is the freedom to say that two plus two make four." - George Orwell
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;