"use client";

import { ShieldOff } from "lucide-react";
import { profileById, useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function BlockedUsersPage() {
  const store = useAppStore();
  const { state } = store;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blockierte Nutzer:innen</h1>
      <p className="text-muted-foreground">
        Blockierte Personen können dein Profil nicht sehen und dir nicht schreiben. Sie erfahren
        nicht, dass du sie blockiert hast.
      </p>
      {state.blocked.length === 0 ? (
        <EmptyState
          icon={ShieldOff}
          title="Niemand blockiert"
          description="Wenn du eine Person blockierst, erscheint sie hier und kann jederzeit wieder freigegeben werden."
        />
      ) : (
        <ul className="space-y-2">
          {state.blocked.map((id) => {
            const p = profileById(state, id);
            return (
              <li key={id}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <p className="font-semibold">{p?.displayName ?? "Unbekanntes Profil"}</p>
                    <Button variant="outline" size="sm" onClick={() => store.unblock(id)}>
                      Blockierung aufheben
                    </Button>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
