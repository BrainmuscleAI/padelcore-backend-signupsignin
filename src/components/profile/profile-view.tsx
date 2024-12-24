import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Upload, User } from 'lucide-react';
import { useState } from 'react';

const profileSchema = z.object({
  username: z.string().min(3).max(20),
  full_name: z.string().min(2).max(50),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileView() {
  const { profile, loading, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
    },
  });

  if (loading) {
    return <ProfileSkeleton />;
  }

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile({
      username: data.username,
      full_name: data.full_name,
    });
    setEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // TODO: Implement file upload to Supabase storage
      // For now just show a success message
      setTimeout(() => {
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          {editing && (
            <div className="absolute -bottom-2 -right-2">
              <label
                htmlFor="avatar-upload"
                className={`${
                  uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity`}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile?.full_name || 'Your Profile'}</h2>
          <p className="text-muted-foreground">
            @{profile?.username || 'username'}
          </p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...form.register('username')}
              className={form.formState.errors.username ? 'border-red-500' : ''}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...form.register('full_name')}
              className={form.formState.errors.full_name ? 'border-red-500' : ''}
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <Label>Username</Label>
            <p>{profile?.username || 'Not set'}</p>
          </div>
          <div>
            <Label>Full Name</Label>
            <p>{profile?.full_name || 'Not set'}</p>
          </div>
          <div>
            <Label>Rating</Label>
            <p>{profile?.rating}</p>
          </div>
          <div>
            <Label>Match Stats</Label>
            <p>
              {profile?.wins}W - {profile?.losses}L ({profile?.matches_played} total)
            </p>
          </div>
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </Card>
  );
}