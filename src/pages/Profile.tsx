import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Star, Link2, ExternalLink, Calendar, Users, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useParasocial } from '@/hooks/useParasocial';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { AppHeader } from '@/components/AppHeader';
import { Footer } from '@/components/Footer';

interface ProfileData {
  user_id: string;
  display_name: string | null;
  user_handle: string | null;
  avatar_url: string | null;
  is_parasocial_personality: boolean;
  is_public: boolean;
  created_at: string;
}

interface PublicShare {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
}

export default function Profile() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { followParasocial, unfollowParasocial } = useParasocial(user?.id);
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [shares, setShares] = useState<PublicShare[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (handle) {
      fetchProfile(handle.replace('@', ''));
    }
  }, [handle, user?.id]);

  const fetchProfile = async (userHandle: string) => {
    setLoading(true);
    setNotFound(false);
    setIsPrivate(false);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, user_handle, avatar_url, is_parasocial_personality, is_public, created_at')
        .eq('user_handle', userHandle)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setNotFound(true);
        return;
      }

      if (!data) {
        setNotFound(true);
        return;
      }

      // Check if profile is private and not the current user
      if (!data.is_public && data.user_id !== user?.id) {
        setIsPrivate(true);
        setProfile(data);
        return;
      }

      setProfile(data);

      // Fetch shares if parasocial personality
      if (data.is_parasocial_personality) {
        const { data: sharesData } = await supabase
          .from('parasocial_shares')
          .select('id, title, url, description, created_at')
          .eq('creator_id', data.user_id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (sharesData) {
          setShares(sharesData);
        }

        // Get follower count
        const { count } = await supabase
          .from('parasocial_follows')
          .select('*', { count: 'exact', head: true })
          .eq('parasocial_id', data.user_id);

        setFollowerCount(count || 0);

        // Check if current user is following
        if (user?.id) {
          const { data: followData } = await supabase
            .from('parasocial_follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('parasocial_id', data.user_id)
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!profile) return;

    if (isFollowing) {
      const result = await unfollowParasocial(profile.user_id);
      if (result.success) {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        toast.success(`Unfollowed @${profile.user_handle}`);
      }
    } else {
      const result = await followParasocial(profile.user_id);
      if (result.success) {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`Following @${profile.user_handle}`);
      } else {
        toast.error(result.error || 'Failed to follow');
      }
    }
  };

  const handleSignIn = () => navigate('/auth');
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader 
          isLoggedIn={!!user} 
          userEmail={user?.email}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <User className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-display font-bold">Profile Not Found</h1>
            <p className="text-muted-foreground">
              No user exists with the handle @{handle?.replace('@', '')}
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isPrivate && profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader 
          isLoggedIn={!!user} 
          userEmail={user?.email}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-display font-bold">Private Profile</h1>
            <p className="text-muted-foreground">
              @{profile.user_handle} has set their profile to private
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader 
        isLoggedIn={!!user} 
        userEmail={user?.email}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile.display_name?.[0]?.toUpperCase() || <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h1 className="text-2xl font-display font-bold">
                      {profile.display_name || 'Anonymous'}
                    </h1>
                    {profile.is_parasocial_personality && (
                      <Badge variant="secondary" className="w-fit mx-auto sm:mx-0">
                        <Star className="h-3 w-3 mr-1" />
                        Creator
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground">@{profile.user_handle}</p>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                    </span>
                    {profile.is_parasocial_personality && (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                      </span>
                    )}
                  </div>

                  {profile.is_parasocial_personality && user?.id !== profile.user_id && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? 'outline' : 'default'}
                      className="mt-4"
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shares Section */}
          {profile.is_parasocial_personality && shares.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Latest Shares</CardTitle>
                <CardDescription>
                  Content shared by {profile.display_name || `@${profile.user_handle}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {shares.map((share) => (
                  <motion.a
                    key={share.id}
                    href={share.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {share.title}
                        </h3>
                        {share.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {share.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </CardContent>
            </Card>
          )}

          {profile.is_parasocial_personality && shares.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No shares yet
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}