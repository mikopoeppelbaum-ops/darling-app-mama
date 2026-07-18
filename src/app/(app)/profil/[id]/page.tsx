"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Flag, Heart, ShieldOff, UserX } from "lucide-react";
import { profileById, useAppStore } from "@/lib/store";
import { matchReasons } from "@/lib/matching";
import { ProfileDetails } from "@/components/profile/profile-details";
import { MatchReasonsList } from "@/components/discover/match-reasons";
import { ReportDialog } from "@/components/profile/report-dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProfileViewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const store = useAppStore();
  const { state } = store;
  const [reportOpen, setReportOpen] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const profile = profileById(state, params.id);

  if (!profile || state.blocked.includes(profile.id)) {
    return (
      <EmptyState
        icon={UserX}
        title="Profil nicht verfügbar"
        description="Dieses Profil existiert nicht oder ist für dich nicht sichtbar."
        action={
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft aria-hidden="true" /> Zurück
          </Button>
        }
      />
    );
  }

  const isMatched = state.matches.some(
    (m) => m.profileIds.includes(profile.id) && m.status !== "ended",
  );
  const alreadyLiked = state.likesGiven.some((l) => l.toProfileId === profile.id);
  const reasons = matchReasons(state.me, profile);

  function handleLike() {
    const result = store.like(profile!.id);
    if (result.limitReached) setNotice("Dein Tageslimit an Likes ist erreicht.");
    else if (result.rateLimited) setNotice("Bitte mache eine kurze Pause.");
    else if (result.match) setNotice(`Es ist ein Match mit ${profile!.displayName}!`);
    else setNotice("Like gesendet.");
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft aria-hidden="true" /> Zurück
      </Button>

      {notice ? (
        <Alert variant="success" role="status">
          {notice}{" "}
          {notice.includes("Match") ? (
            <Link href="/matches" className="font-medium underline">
              Zu deinen Matches
            </Link>
          ) : null}
        </Alert>
      ) : null}

      <ProfileDetails profile={profile} context={isMatched ? "matched" : "public"} />

      {reasons.length > 0 ? <MatchReasonsList reasons={reasons} /> : null}

      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        {!isMatched && !alreadyLiked ? (
          <Button size="lg" onClick={handleLike}>
            <Heart aria-hidden="true" /> Gefällt mir
          </Button>
        ) : null}
        <Button variant="ghost" onClick={() => setReportOpen(true)}>
          <Flag aria-hidden="true" /> Melden
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            store.block(profile.id);
            router.push("/entdecken");
          }}
        >
          <ShieldOff aria-hidden="true" /> Blockieren
        </Button>
      </div>

      <ReportDialog
        profileId={profile.id}
        profileName={profile.displayName}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}
