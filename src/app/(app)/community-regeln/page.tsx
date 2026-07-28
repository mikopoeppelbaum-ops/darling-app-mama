import type { Metadata } from "next";
import { CommunityRulesContent } from "@/components/community-rules-content";

export const metadata: Metadata = { title: "Community-Regeln" };

export default function CommunityRulesPage() {
  return <CommunityRulesContent />;
}
