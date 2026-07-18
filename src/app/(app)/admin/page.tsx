"use client";

import * as React from "react";
import { ClipboardList, Gavel, ShieldAlert } from "lucide-react";
import { profileById, useAppStore } from "@/lib/store";
import { REPORT_CATEGORY_OPTIONS, labelFor } from "@/lib/options";
import { formatDateTime } from "@/lib/utils";
import type { Report } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

/**
 * Moderations-Dashboard.
 * Im Demo-Modus für alle sichtbar; mit Supabase-Anbindung schützt die Rolle
 * (app_users.role in 'admin'/'moderator') + RLS den Zugriff serverseitig.
 */
export default function AdminPage() {
  const store = useAppStore();
  const { state } = store;

  if (!state.isAdmin) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Kein Zugriff"
        description="Dieser Bereich ist dem Moderationsteam vorbehalten."
      />
    );
  }

  const statusLabel: Record<Report["status"], string> = {
    open: "Offen",
    in_review: "In Prüfung",
    resolved: "Erledigt",
    dismissed: "Abgelehnt",
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Moderation</h1>
      <Alert variant="info" title="Demo-Modus">
        Mit Supabase-Anbindung ist dieser Bereich über die Rolle „admin“/„moderator“ und Row
        Level Security geschützt.
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert aria-hidden="true" className="size-5 text-primary" />
            Gemeldete Profile und Nachrichten
          </CardTitle>
          <CardDescription>
            {state.reports.filter((r) => r.status === "open").length} offene Meldungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.reports.length === 0 ? (
            <p className="text-muted-foreground">
              Aktuell gibt es keine Meldungen. Du kannst im Entdecken-Bereich testweise ein Profil
              melden — es erscheint dann hier.
            </p>
          ) : (
            <ul className="space-y-4">
              {state.reports.map((report) => (
                <ReportRow key={report.id} report={report} statusLabel={statusLabel} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="size-5 text-primary" />
            Audit-Log (Moderationsaktionen)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.moderationActions.length === 0 ? (
            <p className="text-muted-foreground">Noch keine Aktionen protokolliert.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {state.moderationActions.map((a) => {
                const target = profileById(state, a.targetProfileId);
                return (
                  <li key={a.id} className="rounded-md border border-border p-3">
                    <span className="font-medium">{formatDateTime(a.createdAt)}</span> —{" "}
                    {a.actionType === "warning"
                      ? "Verwarnung"
                      : a.actionType === "temp_ban"
                        ? "Temporäre Sperre"
                        : a.actionType === "perma_ban"
                          ? "Dauerhafte Sperre"
                          : a.actionType === "dismissed"
                            ? "Meldung abgelehnt"
                            : "Notiz"}{" "}
                    für {target?.displayName ?? a.targetProfileId}: {a.reason}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReportRow({
  report,
  statusLabel,
}: {
  report: Report;
  statusLabel: Record<Report["status"], string>;
}) {
  const store = useAppStore();
  const { state } = store;
  const reported = profileById(state, report.reportedProfileId);
  const [notes, setNotes] = React.useState(report.moderatorNotes ?? "");

  function act(actionType: "warning" | "temp_ban" | "perma_ban" | "dismissed") {
    store.addModerationAction({
      reportId: report.id,
      targetProfileId: report.reportedProfileId,
      actionType,
      reason: notes || labelFor(REPORT_CATEGORY_OPTIONS, report.category),
    });
    store.updateReportStatus(report.id, actionType === "dismissed" ? "dismissed" : "resolved", notes);
  }

  return (
    <li className="space-y-3 rounded-md border border-border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{reported?.displayName ?? "Unbekanntes Profil"}</span>
        <Badge variant={report.status === "open" ? "destructive" : "outline"}>
          {statusLabel[report.status]}
        </Badge>
        <Badge>{labelFor(REPORT_CATEGORY_OPTIONS, report.category)}</Badge>
        {report.messageId ? <Badge variant="outline">Nachricht gemeldet</Badge> : null}
        <span className="text-sm text-muted-foreground">{formatDateTime(report.createdAt)}</span>
      </div>
      <p className="text-sm">{report.description}</p>
      {report.status === "open" || report.status === "in_review" ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`notes-${report.id}`} className="text-sm">
              Interne Moderationsnotiz
            </Label>
            <Textarea
              id={`notes-${report.id}`}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => store.updateReportStatus(report.id, "in_review", notes)}>
              In Prüfung nehmen
            </Button>
            <Button size="sm" variant="outline" onClick={() => act("warning")}>
              <Gavel aria-hidden="true" /> Verwarnung
            </Button>
            <Button size="sm" variant="outline" onClick={() => act("temp_ban")}>
              Temporäre Sperre
            </Button>
            <Button size="sm" variant="destructive" onClick={() => act("perma_ban")}>
              Dauerhafte Sperre
            </Button>
            <Button size="sm" variant="ghost" onClick={() => act("dismissed")}>
              Meldung ablehnen
            </Button>
          </div>
        </div>
      ) : report.moderatorNotes ? (
        <p className="text-sm text-muted-foreground">Notiz: {report.moderatorNotes}</p>
      ) : null}
    </li>
  );
}
