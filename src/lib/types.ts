/**
 * Zentrale Domain-Typen für EchtNah.
 * Diese Typen spiegeln das Datenbankschema in supabase/migrations wider.
 */

export type Visibility = "public" | "after_match" | "hidden";

export type Gender =
  | "woman"
  | "man"
  | "nonbinary"
  | "genderfluid"
  | "agender"
  | "self_described"
  | "prefer_not_to_say";

export type Orientation =
  | "hetero"
  | "gay"
  | "lesbian"
  | "bi"
  | "pan"
  | "ace"
  | "demi"
  | "queer"
  | "questioning"
  | "prefer_not_to_say";

export type RelationshipGoal =
  "long_term" | "open_to_anything" | "friendship_first" | "casual" | "companionship";

export type ContactFrequency = "daily" | "few_times_week" | "weekly" | "flexible";

export type PlanningStyle = "spontaneous" | "semi_planned" | "structured";

export type EnergyLevel = "low" | "medium" | "high" | "varies";

export type CommunicationStyle =
  | "texting"
  | "voice_messages"
  | "calls"
  | "video_calls"
  | "in_person"
  | "written_detailed"
  | "short_messages";

export type ResponsePace = "fast" | "same_day" | "takes_time";

/** Sichtbarkeitsstufen für sensible Angaben — pro Angabe einzeln einstellbar. */
export interface SensitiveDisclosure {
  id: string;
  /** Frei formulierte Bezeichnung, z. B. "ADHS" oder "chronische Erkrankung". */
  label: string;
  /** Optionale eigene Beschreibung in den Worten der Person. */
  description?: string;
  visibility: Visibility;
  /** Nur wenn true darf die Angabe in Suchfiltern anderer auftauchen. */
  searchable: boolean;
}

export interface ProfilePhoto {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProfilePrompts {
  helpsMeOnDates?: string;
  aboutMyCommunication?: string;
  howIShowInterest?: string;
  whatGivesMeSafety?: string;
  myBoundaries?: string;
  perfectFirstDate?: string;
}

export interface Profile {
  id: string;
  displayName: string;
  birthdate: string; // ISO-Datum; nach außen wird nur das Alter angezeigt
  gender: Gender;
  genderSelfDescribed?: string;
  pronouns?: string;
  orientation: Orientation;
  orientationVisibility: Visibility;
  /** Ungefährer Standort — niemals exakte Adresse. */
  city: string;
  approxLat: number;
  approxLng: number;
  bio: string;
  relationshipGoal: RelationshipGoal;
  interests: string[];
  values: string[];
  communicationStyles: CommunicationStyle[];
  contactFrequency: ContactFrequency;
  planningStyle: PlanningStyle;
  energyLevel: EnergyLevel;
  responsePace: ResponsePace;
  socialActivities: string[];
  sensoryNeeds: string[];
  accessibilityNeeds: string[];
  accessibilityVisibility: Visibility;
  disclosures: SensitiveDisclosure[];
  prompts: ProfilePrompts;
  boundaries: string;
  lifestyle: {
    childrenWish?: string;
    smoking?: string;
    alcohol?: string;
    pets?: string;
  };
  photos: ProfilePhoto[];
  /** Status "Meine Antwort kann etwas dauern" u. Ä. */
  statusFlags: {
    slowReplies: boolean;
    pausedNeedTime: boolean;
  };
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Preferences {
  profileId: string;
  seekingGenders: Gender[];
  ageMin: number;
  ageMax: number;
  maxDistanceKm: number;
  relationshipGoals: RelationshipGoal[];
  dealbreakers: string[];
}

export interface DiscoverFilters {
  ageMin?: number;
  ageMax?: number;
  maxDistanceKm?: number;
  genders?: Gender[];
  orientations?: Orientation[];
  relationshipGoals?: RelationshipGoal[];
  interests?: string[];
  values?: string[];
  communicationStyles?: CommunicationStyle[];
  planningStyles?: PlanningStyle[];
  contactFrequencies?: ContactFrequency[];
  accessibleMeetingPlaces?: boolean;
  childrenWish?: string[];
  smoking?: string[];
  alcohol?: string[];
  pets?: string[];
  /** Nur Profile, die eine Angabe ausdrücklich als durchsuchbar freigegeben haben. */
  disclosureLabels?: string[];
}

export interface Like {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  createdAt: string;
}

export type MatchStatus = "active" | "paused" | "ended";

export interface Match {
  id: string;
  profileIds: [string, string];
  status: MatchStatus;
  createdAt: string;
  endedReason?: string;
}

export type MessageStatus = "sent" | "read" | "deleted";

export interface Message {
  id: string;
  matchId: string;
  senderProfileId: string;
  body: string;
  imageUrl?: string;
  status: MessageStatus;
  /** ADHS-Funktion: "Später beantworten" mit optionaler Erinnerungszeit. */
  answerLater?: boolean;
  remindAt?: string;
  createdAt: string;
}

export interface ConversationSettings {
  matchId: string;
  profileId: string;
  muted: boolean;
  important: boolean;
  readReceipts: boolean;
  typingIndicator: boolean;
  draft?: string;
}

export type ReportCategory =
  | "harassment"
  | "ableism"
  | "discrimination"
  | "sexual_harassment"
  | "fetishization"
  | "manipulation"
  | "scam"
  | "stalking"
  | "unwanted_medical_advice"
  | "diagnosis_pressure"
  | "fake_profile"
  | "other";

export type ReportStatus = "open" | "in_review" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporterProfileId: string;
  reportedProfileId: string;
  messageId?: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  createdAt: string;
  moderatorNotes?: string;
}

export type DatePlanStatus = "proposed" | "confirmed" | "rescheduled" | "cancelled" | "completed";

export interface DatePlan {
  id: string;
  matchId: string;
  createdByProfileId: string;
  dateType: string;
  startsAt: string;
  durationMinutes: number;
  locationName: string;
  locationNotes?: string;
  accessibilityRequirements: string[];
  notes?: string;
  status: DatePlanStatus;
  remindersEnabled: boolean;
  safetyContactName?: string;
  safetyContactPhone?: string;
  safetyCode?: string;
  shareWithTrustedPerson: boolean;
  checkInDone: boolean;
  lastChangeNote?: string;
  createdAt: string;
}

export type ModerationActionType = "warning" | "temp_ban" | "perma_ban" | "note" | "dismissed";

export interface ModerationAction {
  id: string;
  reportId?: string;
  targetProfileId: string;
  actionType: ModerationActionType;
  reason: string;
  createdAt: string;
}

export interface NotificationSettings {
  profileId: string;
  newMatches: boolean;
  newMessages: boolean;
  dateReminders: boolean;
  /** Gebündelte Benachrichtigungen statt einzelner Meldungen. */
  bundled: boolean;
  bundleIntervalMinutes: number;
}

export interface PrivacySettings {
  profileId: string;
  showAge: boolean;
  showCity: boolean;
  showPronouns: boolean;
  showLastActive: boolean;
  incognito: boolean;
}

export interface ConsentRecord {
  id: string;
  profileId: string;
  consentType: "privacy_policy" | "terms" | "community_rules" | "sensitive_data";
  version: string;
  givenAt: string;
}
