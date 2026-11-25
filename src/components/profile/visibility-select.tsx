"use client";

import type { Visibility } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const OPTIONS: { value: Visibility; label: string }[] = [
  { value: "public", label: "Sofort sichtbar" },
  { value: "after_match", label: "Erst nach einem Match sichtbar" },
  { value: "hidden", label: "Nicht anzeigen" },
];

/** Einheitliche Sichtbarkeits-Auswahl für sensible Angaben. */
export function VisibilitySelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value as Visibility)}>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
