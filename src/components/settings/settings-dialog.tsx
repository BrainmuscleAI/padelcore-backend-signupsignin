import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Globe, Lock, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/theme-provider';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      matches: true,
      tournaments: true,
    },
    privacy: {
      profileVisibility: 'public',
      showStats: true,
      showActivity: true,
    },
    preferences: {
      language: 'es',
      theme: 'system',
    },
  });

  const handleSettingChange = (
    category: keyof typeof settings,
    setting: string,
    value: any
  ) => {
    if (category === 'preferences' && setting === 'theme') {
      setTheme(value);
    }

    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // TODO: Implement settings save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    handleSettingChange('notifications', 'email', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    handleSettingChange('notifications', 'push', checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5" />
              <h3 className="font-semibold">Privacy</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) =>
                    handleSettingChange('privacy', 'profileVisibility', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5" />
              <h3 className="font-semibold">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) =>
                    handleSettingChange('preferences', 'language', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) =>
                    handleSettingChange('preferences', 'theme', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}