import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <SettingsIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Settings Coming Soon</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            User preferences, notification settings, and account management features will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
