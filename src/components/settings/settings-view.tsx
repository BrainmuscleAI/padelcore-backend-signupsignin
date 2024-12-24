import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
import { Bell, Globe, Lock, Mail, Moon } from 'lucide-react';

export function SettingsView() {
  const { toast } = useToast();
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Notifications</h2>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="match-notifications">Match Updates</Label>
                <Switch
                  id="match-notifications"
                  checked={settings.notifications.matches}
                  onCheckedChange={(checked) =>
                    handleSettingChange('notifications', 'matches', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tournament-notifications">Tournament Updates</Label>
                <Switch
                  id="tournament-notifications"
                  checked={settings.notifications.tournaments}
                  onCheckedChange={(checked) =>
                    handleSettingChange('notifications', 'tournaments', checked)
                  }
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Privacy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Privacy</h2>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="show-stats">Show Statistics</Label>
                <Switch
                  id="show-stats"
                  checked={settings.privacy.showStats}
                  onCheckedChange={(checked) =>
                    handleSettingChange('privacy', 'showStats', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-activity">Show Activity</Label>
                <Switch
                  id="show-activity"
                  checked={settings.privacy.showActivity}
                  onCheckedChange={(checked) =>
                    handleSettingChange('privacy', 'showActivity', checked)
                  }
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Preferences</h2>
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

        <div className="mt-8">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}