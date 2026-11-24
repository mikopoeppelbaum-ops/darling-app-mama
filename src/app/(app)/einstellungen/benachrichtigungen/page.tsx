"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export default function NotificationSettingsPage() {
  const store = useAppStore();
  const n = store.state.notificationSettings;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Benachrichtigungen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Worüber möchtest du informiert werden?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="not-matches" className="font-normal">
              Neue Matches
            </Label>
            <Switch
              id="not-matches"
              checked={n.newMatches}
              onCheckedChange={(v) => store.updateNotificationSettings({ newMatches: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="not-messages" className="font-normal">
              Neue Nachrichten
            </Label>
            <Switch
              id="not-messages"
              checked={n.newMessages}
              onCheckedChange={(v) => store.updateNotificationSettings({ newMessages: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="not-dates" className="font-normal">
              Date-Erinnerungen
            </Label>
            <Switch
              id="not-dates"
              checked={n.dateReminders}
              onCheckedChange={(v) => store.updateNotificationSettings({ dateReminders: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gebündelte Benachrichtigungen</CardTitle>
          <CardDescription>
            Statt jeder einzelnen Meldung bekommst du eine Zusammenfassung in deinem Rhythmus —
            weniger Unterbrechungen, weniger Reize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="not-bundled" className="font-normal">
              Benachrichtigungen bündeln
            </Label>
            <Switch
              id="not-bundled"
              checked={n.bundled}
              onCheckedChange={(v) => store.updateNotificationSettings({ bundled: v })}
            />
          </div>
          {n.bundled ? (
            <FormField label="Bündeln alle (Minuten)" htmlFor="not-interval">
              <Input
                id="not-interval"
                type="number"
                min={15}
                max={1440}
                step={15}
                value={n.bundleIntervalMinutes}
                onChange={(e) =>
                  store.updateNotificationSettings({
                    bundleIntervalMinutes: Number(e.target.value) || 60,
                  })
                }
                className="max-w-32"
              />
            </FormField>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
