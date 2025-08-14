import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Users, TrendingUp, Globe } from 'lucide-react';

const HomePage = () => {
    return (
        <div>
            <h1> Welcome to Big Brother Social Media!</h1>
            <h3>We are the premiere no censorship social media with no tracking whatsoever (maybe)</h3>

            <h2>Register and Login to get started and see trending posts on the platform!</h2>
        </div>
    );
};

export default HomePage;